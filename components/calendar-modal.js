const CalendarModal = ({ header, description }) => {
  return (
    <div
      id="default-modal"
      tabindex="-1"
      aria-hidden="true"
      class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
    >
      <div class="relative max-h-full w-full max-w-2xl p-4">
        {/*  Modal content */}
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* Modal header */}
          <div class="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {header}
            </h3>
            <button
              type="button"
              class="h-8 ms-auto inline-flex w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <svg
                class="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div class="space-y-4 p-4 md:p-5">
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
          {/*<div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                        <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                    </div>*/}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
