import { NextResponse } from 'next/server';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss-v3';
import postcssCustomProperties from 'postcss-custom-properties';

import autoprefixer from 'autoprefixer';

import { preflightCss } from '@/lib/preflight-css';

export async function POST(request: Request) {
  try {
    const { html, customConfig, prefix, includePreflight } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML input is required' }, { status: 400 });
    }

    // Prepare Tailwind Config
    let config: any = {
      content: [{ raw: html, extension: 'html' }],
      theme: {},
      plugins: [],
      corePlugins: {
        // ALWAYS disable built-in preflight to avoid "ENOENT" error when Tailwind tries to read the file
        // We will manually append our own static preflight string if needed.
        preflight: false, 
      },
    };

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

    console.log('/api/generate-css',result);

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

    return NextResponse.json({ css: finalCss });

  } catch (error: any) {
    console.error('CSS Generation Error:', error);
    return NextResponse.json({ 
        error: 'Failed to generate CSS', 
        details: error.message 
    }, { status: 500 });
  }
}
