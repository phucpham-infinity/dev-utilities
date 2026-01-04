import { NextResponse } from 'next/server';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss-v3';
import postcssCustomProperties from 'postcss-custom-properties';
import autoprefixer from 'autoprefixer';
import { preflightCss } from '@/lib/preflight-css';
import * as cheerio from 'cheerio';

// Helper function to prefix class names robustly
const prefixClasses = (html: string, prefix: string) => {
  if (!html || !prefix) return html;

  const $ = cheerio.load(html, { 
    xmlMode: false, // HTML mode
    decodeEntities: false // Preserve entities
  });

  // Select any element with a class attribute
  $('[class]').each((_, el) => {
    const $el = $(el);
    const classes = $el.attr('class')?.split(/\s+/) || [];
    
    const newClasses = classes.map(cls => {
        if (!cls.trim()) return '';
        
        // Handle arbitrary values with colons inside [] or () - basic check
        const parts = cls.split(':');
        const utility = parts.pop(); // Get the last part
        
        if (!utility) return cls;

        let prefixedUtility = '';
        // Handle negative values e.g. -m-4 -> -{prefix}m-4
        if (utility.startsWith('-')) {
            prefixedUtility = `-${prefix}${utility.substring(1)}`;
        } else {
            prefixedUtility = `${prefix}${utility}`;
        }

        // Reconstruct logic
        if (parts.length > 0) {
            return `${parts.join(':')}:${prefixedUtility}`;
        }
        return prefixedUtility;
    }).join(' ');

    $el.attr('class', newClasses);
  });

  // Return only the body content if it was wrapped automatically, 
  // or the full html if the user provided a full document.
  // Cheerio behaves differently based on input.
  // If input starts with <div... it might wrap.
  
  // A simple heuristic: if input has <html> or <body, return full $.html()
  // else return $('body').html() || $.html();
  
  if (html.includes('<html') || html.includes('<body')) {
      return $.html();
  }
  return $('body').html() || $.html();
};

export async function POST(request: Request) {
  try {
    const { html, customConfig, prefix, includePreflight } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML input is required' }, { status: 400 });
    }

    // Process HTML Prefixing Server-Side
    const prefixedHtml = prefix ? prefixClasses(html, prefix) : html;

    // Use the *prefixed* HTML to generate CSS?
    // Tailwind needs to see the classes as they appear in the HTML to generate styles for them.
    // IF we send `prefixedHtml` and `config.prefix = prefix` -> Tailwind will look for `prefix-utility` in HTML.
    // AND it will generate `.prefix-utility`.
    // Correct.
    
    // Prepare Tailwind Config

    // Prepare Tailwind Config
    let config: any = {
      content: [{ raw: prefixedHtml, extension: 'html' }],
      theme: {},
      plugins: [],
      corePlugins: {
        // ALWAYS disable built-in preflight to avoid "ENOENT" error when Tailwind tries to read the file
        // We will manually append our own static preflight string if needed.
        preflight: false, 
      },
    };
    
    // Set prefix if provided
    if (prefix) {
      config.prefix = prefix;
    }


    // Merge custom config if provided
    if (customConfig && customConfig.trim()) {
      try {
        const parsedConfig = JSON.parse(customConfig);
        config = {
          ...config,
          ...parsedConfig,
          content: config.content, // Keep our content
          corePlugins: {
            ...config.corePlugins,
            ...(parsedConfig.corePlugins || {}),
            preflight: false, // Ensure it stays false
          },
          // We MUST set the prefix in config so Tailwind recognizes the classes we manually prefixed in the HTML content.
          // Example: HTML has "tw-p-4". Config has prefix "tw-". Tailwind matches these and generates ".tw-p-4".
          prefix: prefix || parsedConfig.prefix,
        };
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON configuration' }, { status: 400 });
      }
    }

    // Process CSS
    const plugins = [
      tailwindcss(config),
      autoprefixer(),
      // Plugin to resolve CSS variables (custom properties) to static values
      postcssCustomProperties({
        preserve: false, // Remove the original variable declaration
      }),
    ];

    const processor = postcss(plugins);
    
    // We remove '@tailwind base' to prevent Tailwind from looking for preflight files
    const result = await processor.process('@tailwind components; @tailwind utilities;', {
      from: undefined, // no file
    });

    let finalCss = result.css;

    // Manually prepend Preflight if requested
    if (includePreflight) {
        finalCss = `${preflightCss}\n${finalCss}`;
    } else {
        // If no preflight, try to clean up any residual global vars if any (usually from components/utilities layers)
        // But since we removed @tailwind base and set preflight: false, most should be gone already.
        // We can keep the regex cleaner just in case plugins inject garbage.

        finalCss = finalCss.replace(/\s*\*,\s*::before,\s*::after\s*\{[\s\S]*?\}/g, (match) => {
            if (match.includes('--tw-')) return ''; 
            return match;
        });

        finalCss = finalCss.replace(/\s*::backdrop\s*\{[\s\S]*?\}/g, (match) => {
             if (match.includes('--tw-')) return '';
             return match;
        });
        
        finalCss = finalCss.trim();
    }

    // Since we use PostCSS Custom Properties to resolve variables, standard Tailwind utilties 
    // might still rely on some base variables if not cleaned up properly or if used in animations.
    // However, the above removal targets the global reset blocks.

    return NextResponse.json({ 
        css: finalCss,
        prefixedHtml: prefixedHtml 
    });

  } catch (error: any) {
    console.error('CSS Generation Error:', error);
    return NextResponse.json({ 
        error: 'Failed to generate CSS', 
        details: error.message 
    }, { status: 500 });
  }
}
