import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Dev Utilities
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-zinc-500 dark:text-zinc-400">
            Frontend Development Toolkit to accelerate your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tool Card: Tailwind CSS Builder */}
          <Link
            to="/builder"
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute top-6 right-6 text-zinc-200 dark:text-zinc-800 group-hover:text-cyan-500/20 transition-colors">
              <svg
                className="w-24 h-24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center justify-center p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </span>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Tailwind Builder
              </h3>

              <p className="text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
                Extract and compile Tailwind Classes from HTML to raw CSS.
                Supports Prefixing and Minification.
              </p>

              <div className="flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400">
                Use Now
                <svg
                  className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Placeholder for future tools */}
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-4">
              <svg
                className="w-6 h-6 text-zinc-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
              Coming Soon
            </h3>
            <p className="text-sm text-zinc-500">More tools are on the way.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
