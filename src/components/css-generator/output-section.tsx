import React, { useState } from "react";
import type { ViewMode, OutputTab } from "@/hooks/use-css-generator";
import { createPortal } from "react-dom";

interface OutputSectionProps {
  outputTab: OutputTab;
  setOutputTab: (tab: OutputTab) => void;
  outputCss: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  formattedCss: string;
  prefixedHtml: string;
  handleDownload: () => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  outputTab,
  setOutputTab,
  outputCss,
  viewMode,
  setViewMode,
  formattedCss,
  prefixedHtml,
  handleDownload,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const contentToDisplay = outputTab === "css" ? formattedCss : prefixedHtml;

  const PreviewFrame = ({ html, css }: { html: string; css: string }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 2rem; font-family: system-ui, -apple-system, sans-serif; background-color: transparent; }
              ${css}
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;

      doc.open();
      doc.write(content);
      doc.close();
    }, [html, css]);

    return (
      <iframe
        ref={iframeRef}
        title="Preview"
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };

  const PreviewModal = () => {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              UI Preview
            </h3>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950/50 relative">
            <div className="absolute inset-0 p-4">
              <div className="w-full h-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner bg-white">
                <PreviewFrame html={prefixedHtml} css={formattedCss} />
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setOutputTab("css")}
            className={`text-sm px-4 py-1.5 rounded-md transition-all font-medium ${
              outputTab === "css"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            CSS Output
          </button>
          <button
            onClick={() => setOutputTab("html")}
            className={`text-sm px-4 py-1.5 rounded-md transition-all font-medium ${
              outputTab === "html"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            HTML Output
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="text-sm px-4 py-1.5 rounded-md transition-all font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
          >
            Preview UI
          </button>
        </div>

        {outputTab === "css" && outputCss && !outputCss.startsWith("/*") && (
          /* View Mode Toggles */
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 mr-auto ml-4">
            <button
              onClick={() => setViewMode("beautify")}
              className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                viewMode === "beautify"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Beautify
            </button>
            <button
              onClick={() => setViewMode("minify")}
              className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                viewMode === "minify"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              Minify
            </button>
          </div>
        )}

        {(outputCss || (outputTab === "html" && prefixedHtml)) && (
          <button
            onClick={handleDownload}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 ml-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download {outputTab === "css" ? ".css" : ".html"}
          </button>
        )}
      </div>

      <div className="flex-1 relative group">
        <textarea
          readOnly
          className="w-full h-full min-h-[400px] p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-900 text-zinc-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          value={contentToDisplay}
          placeholder={
            outputTab === "css"
              ? "CSS result will appear here..."
              : "HTML result will appear here..."
          }
        />
        {contentToDisplay && (
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(contentToDisplay);
              }}
              className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 p-2 rounded-md backdrop-blur-sm transition-colors"
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {showPreview && <PreviewModal />}
    </div>
  );
};

export default OutputSection;
