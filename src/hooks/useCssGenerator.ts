import { useState, useEffect } from 'react';
import { css as cssBeautify } from 'js-beautify';
import { useLocalStorage } from './useLocalStorage';

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
            return `${prefixStr}${cls}`;
        }).join(' ');
        
        return `${attrName}=${quote}${newContent}${quote}`;
    });
  };

  const generateCss = async () => {
    if (!htmlInput.trim()) return;
    setLoading(true);

    try {
      const classes = extractClasses(htmlInput);
      
      // Generate Prefixed HTML immediately
      const newHtml = generatePrefixedHtml(htmlInput, prefix);
      setPrefixedHtml(newHtml);
      
      if (classes.length === 0) {
        setOutputCss('/* Không tìm thấy class nào trong đoạn HTML */');
        setLoading(false);
        return;
      }

      // We use the original classes for the dummy HTML
      // We will apply the prefix to the generated CSS text later
      const dummyHtml = `<div class="${classes.join(' ')}"></div>`;

      // Prepare config object
      let configObj: any = {
        corePlugins: {
            preflight: includePreflight,
        }
      };

      try {
        if (customConfig.trim()) {
            const parsedConfig = JSON.parse(customConfig);
            configObj = {
                ...configObj,
                ...parsedConfig,
                corePlugins: {
                    ...configObj.corePlugins,
                    ...(parsedConfig.corePlugins || {})
                },
                theme: {
                    ...configObj.theme,
                    ...(parsedConfig.theme || {}),
                    extend: {
                        ...(configObj.theme?.extend || {}),
                        ...(parsedConfig.theme?.extend || {})
                    }
                }
            };
        }
      } catch (e) {
        console.error("Invalid JSON config", e);
        // Continue but maybe warn user? 
        // For now we'll just use default or log error
        setOutputCss('/* Error: Invalid JSON in Tailwind Config */');
        setLoading(false);
        return;
      }
      
      const configString = JSON.stringify(configObj);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error('Cannot access iframe document');
      }

      doc.open();
      // We use standard no-prefix config to generate the raw CSS
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = ${configString}
          </script>
        </head>
        <body>
          ${dummyHtml}
        </body>
        </html>
      `);
      doc.close();

      let attempts = 0;
      const checkStyles = () => {
        if (!doc) return;
        const styleTags = doc.querySelectorAll('style');
        
        let foundCss = '';
        for (let i = 0; i < styleTags.length; i++) {
            const content = styleTags[i].textContent || '';
            // Check for known Tailwind variable or if it contains our classes
            if (content.includes('--tw-') || content.includes('.') || (includePreflight && content.includes('html'))) {
              foundCss += content + '\n';
            }
        }
        
        if (foundCss && (classes.some(c => foundCss.includes(c.replace(':', '\\:'))) || foundCss.includes('*, ::before, ::after') || includePreflight)) {
           // Post-process: Apply prefix to class selectors
           let finalCss = foundCss;

           if (!includePreflight) {
               // Clean up universal selectors and global variables to stricter match "only css of classes"
               finalCss = finalCss.replace(/\s*\*,\s*::before,\s*::after\s*\{[\s\S]*?\}/g, '');
               finalCss = finalCss.replace(/\s*::backdrop\s*\{[\s\S]*?\}/g, '');
           }
           
           finalCss = finalCss.trim();
           
           if (prefix) {
             // We iterate over the extracted classes and replace their selectors in the CSS
             classes.forEach(cls => {
                const escapeForCss = (str: string) => {
                  return str.replace(/([:.])/g, '\\$1').replace(/\//g, '\\/'); 
                };
                
                const cssSelector = escapeForCss(cls);
                const re = new RegExp(`\\.(${cssSelector.replace(/\\/g, '\\\\')})(?![\\w-])`, 'g');
                finalCss = finalCss.replace(re, `.${prefix}$1`);
             });
           }

           setOutputCss(finalCss);
           document.body.removeChild(iframe);
           setLoading(false);
        } else {
            attempts++;
            if (attempts < 20) {
                setTimeout(checkStyles, 100);
            } else {
                setOutputCss('/* Timeout or Empty: Không thể generate CSS. Kiểm tra lại HTML của bạn. */');
                document.body.removeChild(iframe);
                setLoading(false);
            }
        }
      };

      setTimeout(checkStyles, 500);

    } catch (error) {
      console.error(error);
      setOutputCss('/* Error generating CSS */');
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
