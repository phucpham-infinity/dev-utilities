import Link from "next/link";
import CssGenerator from "@/components/css-generator";

export default function TailwindBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-4 md:p-8 flex flex-col items-center justify-center font-inter selection:bg-indigo-500 selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto z-10">
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Utilities
          </Link>
        </div>

        <header className="mb-10 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4 animate-gradient-x">
            Tailwind CSS Builder
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto text-lg">
            Generate clean, prefixed CSS files from your HTML snippets
            instantly.
          </p>
        </header>

        <CssGenerator />
      </div>
    </div>
  );
}
