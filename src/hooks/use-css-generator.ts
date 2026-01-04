import { useState, useEffect } from 'react';
import { css as cssBeautify } from 'js-beautify';
import { useLocalStorage } from './use-local-storage';

export type ViewMode = 'beautify' | 'minify';
export type OutputTab = 'css' | 'html';

export const useCssGenerator = () => {
  const [htmlInput, setHtmlInput] = useLocalStorage('dev-utils-html-input', '');
  const [prefix, setPrefix] = useLocalStorage('dev-utils-prefix', '');
  const [outputCss, setOutputCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('dev-utils-view-mode', 'beautify');
  const [formattedCss, setFormattedCss] = useState('');
  const [outputTab, setOutputTab] = useState<OutputTab>('css');
  const [prefixedHtml, setPrefixedHtml] = useState('');

  const [includePreflight, setIncludePreflight] = useLocalStorage('dev-utils-include-preflight', false);
  const [customConfig, setCustomConfig] = useLocalStorage('dev-utils-custom-config', '');

  // Update formatted CSS whenever output or view mode changes
  useEffect(() => {
    if (!outputCss) {
      setFormattedCss('');
      return;
    }

    if (outputCss.startsWith('/*')) {
       // Keep error/status messages as is
       setFormattedCss(outputCss);
       return;
    }

    if (viewMode === 'minify') {
      const minified = outputCss
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around delimiters
        .replace(/;}/g, '}') // Remove trailing semicolon
        .trim();
      setFormattedCss(minified);
    } else {
      const beautified = cssBeautify(outputCss, {
        indent_size: 2,
        space_around_selector_separator: true,
      });
      setFormattedCss(beautified);
    }
  }, [outputCss, viewMode]);

  const extractClasses = (html: string) => {
    const classSet = new Set<string>();
    
    // Pattern to match class="...", className="...", class='...', className='...'
    // and extract the content inside quotes.
    const regex = /(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    
    let match;
    while ((match = regex.exec(html)) !== null) {
      // match[1] is double quotes content, match[2] is single quotes content
      const content = match[1] || match[2];
      if (content) {
        // Split by whitespace to get individual classes
        content.split(/\s+/).forEach(cls => {
          if (cls.trim()) classSet.add(cls.trim());
        });
      }
    }
    
    return Array.from(classSet);
  };

  const generatePrefixedHtml = (html: string, prefixStr: string) => {
    if (!prefixStr) return html;
    
    return html.replace(/(class|className)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, (_, attrName, doubleQ, singleQ) => {
        const content = doubleQ || singleQ || '';
        const quote = doubleQ ? '"' : "'";
        
        const newContent = content.split(/\s+/).map((cls: string) => {
            if (!cls.trim()) return '';
            
            // Handle arbitrary values with colons inside [] or () - basic check
            // If the class contains brackets, we might need a smarter split, 
            // but for now let's assume standard variant:utility structure or simple arbitrary values.
            
            // Logic: Split by ':' to separate variants. 
            // The last part is the utility. Prefix applies to the utility.
            // Exception: arbitrary values like url('http://...') might have colons. 
            // We'll take a simple approach: Split by ':' but verify parts?
            // Actually, Tailwind recommends prefixing the utility.
            
            const parts = cls.split(':');
            const utility = parts.pop(); // Get the last part
            
            if (!utility) return cls; // Should not happen if cls is not empty

            let prefixedUtility = '';
            // Handle negative values e.g. -m-4 -> -{prefix}m-4
            if (utility.startsWith('-')) {
                prefixedUtility = `-${prefixStr}${utility.substring(1)}`;
            } else {
                prefixedUtility = `${prefixStr}${utility}`;
            }

            // Reconstruct logic
            if (parts.length > 0) {
                return `${parts.join(':')}:${prefixedUtility}`;
            }
            return prefixedUtility;
        }).join(' ');
        
        return `${attrName}=${quote}${newContent}${quote}`;
    });
  };

  const generateCss = async () => {
    if (!htmlInput.trim()) return;
    setLoading(true);

    try {
      // Generate Prefixed HTML immediately for display
      const newHtml = generatePrefixedHtml(htmlInput, prefix);
      setPrefixedHtml(newHtml);
      
      const response = await fetch('/api/generate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: newHtml, // Send prefixed HTML so Tailwind sees the prefixed classes
          customConfig,
          prefix, // Send prefix so Tailwind generates prefixed selectors
          includePreflight,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CSS');
      }

      // If success, set the CSS
      // If user provided includePreflight=false, we might want to strip things?
      // But server uses corePlugins: { preflight: false } so it should be clean.
      setOutputCss(data.css || '/* No CSS generated */');

    } catch (error: any) {
      console.error(error);
      setOutputCss(`/* Error generating CSS: ${error.message} */`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (outputTab === 'css') {
        const blob = new Blob([formattedCss], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailwind-generated${prefix ? '-' + prefix : ''}.${viewMode === 'minify' ? 'min.' : ''}css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        const blob = new Blob([prefixedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-component${prefix ? '-' + prefix : ''}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
  };

  return {
    htmlInput,
    setHtmlInput,
    prefix,
    setPrefix,
    outputCss,
    loading,
    viewMode,
    setViewMode,
    formattedCss,
    outputTab,
    setOutputTab,
    prefixedHtml,
    generateCss,
    handleDownload,
    includePreflight,
    setIncludePreflight,
    customConfig,
    setCustomConfig
  };
};
