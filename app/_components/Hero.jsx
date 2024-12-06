import React from "react";

function Hero() {
  return (
    <div className="relative" id="home">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <div>
        <div className="relative pt-24 md:pt-36 px-4 sm:px-8">
          <div className="lg:w-2/3 text-center mx-auto">
            <h1 className="text-gray-900 dark:text-white font-bold text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-tight">
              Loopr is where{" "}
              <span className="text-primary dark:text-white">
                work happens, in sync.
              </span>
            </h1>
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">
              Welcome to Loopr, a powerful collaborative workspace platform
              designed to streamline teamwork and enhance productivity. With
              features like real-time document editing, AI-assisted writing, and
              seamless workspace management, Loopr empowers users to create,
              collaborate, and stay connected effortlessly. Whether you're
              organizing projects, drafting documents, or staying updated with
              notifications, Loopr provides the tools you need—all in one
              intuitive platform.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-y-4 gap-x-6">
              <a
                href="/dashboard"
                className="relative flex h-11 w-full sm:w-max items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
              >
                <span className="relative text-base font-semibold text-white">
                  Get started
                </span>
              </a>
              <a
                href="#"
                className="relative flex h-11 w-full sm:w-max items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800"
              >
                <span className="relative text-base font-semibold text-primary dark:text-white">
                  Learn more
                </span>
              </a>
            </div>
            <div className="hidden py-8 mt-12 border-y border-gray-100 dark:border-gray-800 sm:flex flex-col md:flex-row justify-between gap-8">
              <div className="text-center md:text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The lowest price
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
              <div className="text-center md:text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The fastest on the market
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
              <div className="text-center md:text-left">
                <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                  The most loved
                </h6>
                <p className="mt-2 text-gray-500">Some text here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
