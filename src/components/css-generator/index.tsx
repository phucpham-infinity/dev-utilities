"use client";

import { useCssGenerator } from "@/hooks/use-css-generator";
import InputSection from "./input-section";
import OutputSection from "./output-section";

const CssGenerator = () => {
  const {
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
    setCustomConfig,
  } = useCssGenerator();

  return (
    <div className="w-full max-w-8xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            CSS Generator for Tailwind
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter your HTML snippet to extract Tailwind classes and generate the
            corresponding CSS file.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <InputSection
            htmlInput={htmlInput}
            setHtmlInput={setHtmlInput}
            prefix={prefix}
            setPrefix={setPrefix}
            loading={loading}
            onGenerate={generateCss}
            includePreflight={includePreflight}
            setIncludePreflight={setIncludePreflight}
            customConfig={customConfig}
            setCustomConfig={setCustomConfig}
          />

          {/* Output Section */}
          <OutputSection
            outputTab={outputTab}
            setOutputTab={setOutputTab}
            outputCss={outputCss}
            viewMode={viewMode}
            setViewMode={setViewMode}
            formattedCss={formattedCss}
            prefixedHtml={prefixedHtml}
            handleDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default CssGenerator;
