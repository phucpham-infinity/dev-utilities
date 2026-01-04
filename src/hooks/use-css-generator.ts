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


  const generateCss = async () => {
    if (!htmlInput.trim()) return;
    setLoading(true);

    try {
      // Logic has moved to server: we send raw HTML + prefix, server returns both CSS and Prefixed HTML
      
      const response = await fetch('/api/generate-css', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlInput, // Send raw HTML
          customConfig,
          prefix, 
          includePreflight,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CSS');
      }

      setOutputCss(data.css || '/* No CSS generated */');
      
      // Update prefixed HTML from server response
      if (data.prefixedHtml) {
        setPrefixedHtml(data.prefixedHtml);
      } else {
        // Fallback or empty if something weird happened, though server should return it
        setPrefixedHtml(htmlInput);
      }

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
