import React from 'react';

interface InputSectionProps {
  htmlInput: string;
  setHtmlInput: (val: string) => void;
  prefix: string;
  setPrefix: (val: string) => void;
  loading: boolean;
  onGenerate: () => void;
  includePreflight: boolean;
  setIncludePreflight: (val: boolean) => void;
  customConfig: string;
  setCustomConfig: (val: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  htmlInput,
  setHtmlInput,
  prefix,
  setPrefix,
  loading,
  onGenerate,
  includePreflight,
  setIncludePreflight,
  customConfig,
  setCustomConfig,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          HTML Input
        </label>
        <textarea
          className="w-full h-80 p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
          placeholder='<div class="p-4 bg-blue-500 hover:opacity-75">...</div>'
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Prefix (Optional)
            </label>
            <div className="relative">
            <input
                type="text"
                className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. tw-"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
            />
            </div>
            <p className="text-xs text-zinc-500">
            Add a prefix to output CSS classes (e.g., <code>p-4</code> becomes <code>.tw-p-4</code>)
            </p>
        </div>

        <div className="space-y-2">
             <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Configuration
                </label>
             </div>
             
             <div className="flex items-center gap-2 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950">
                 <input
                    type="checkbox"
                    id="includePreflight"
                    checked={includePreflight}
                    onChange={(e) => setIncludePreflight(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="includePreflight" className="text-sm text-zinc-900 dark:text-zinc-100 cursor-pointer select-none">
                    Include Preflight (Reset CSS)
                </label>
             </div>
             <p className="text-xs text-zinc-500">
                Check to include Tailwind's base reset styles (preflight).
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Extend Theme (JSON)
          </label>
          <textarea
            className="w-full h-32 p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
            placeholder={`{
  "theme": {
    "extend": {
      "colors": {
        "primary": "#3b82f6"
      }
    }
  }
}`}
            value={customConfig}
            onChange={(e) => setCustomConfig(e.target.value)}
          />
          <p className="text-xs text-zinc-500">
            Enter standard Tailwind config JSON (theme, extend, etc.)
          </p>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !htmlInput}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all
          ${loading || !htmlInput 
            ? 'bg-zinc-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg active:transform active:scale-[0.98]'
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Generate CSS'}
      </button>
    </div>
  );
};

export default InputSection;
