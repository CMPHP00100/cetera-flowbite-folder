export default function BentoGrid() {
  return (
    <div className="bento-container m-4">
      <div className="border-1-gray mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="row-span-6 rounded-lg bg-gray-200 p-6">
          {/* Product Card Start 1 */}
          <div className="inner-product-container bg-none">
            <div className="h-56 w-full">
              <a href="#">
                <img
                  className="mx-auto h-full"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                  alt=""
                />
              </a>
            </div>
            <div className="pt-6">
              {/* Product Title */}
              <a
                href="#"
                className="text-lg font-semibold leading-tight text-gray-800 hover:underline"
              >
                Apple iMac 27", 1TB HDD, Retina 5K Display, M3 Max
              </a>
              <ul className="mt-2 flex items-center gap-4">
                <li className="flex items-center gap-2">
                  <svg
                    class="h-6 w-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    RHQDJ-LRAZA
                  </p>
                </li>
              </ul>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xl font-semibold leading-tight text-gray-900">
                  $1,699
                </p>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300"
                >
                  <svg
                    className="-ms-2 me-2 h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                    />
                  </svg>
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Product Card End 1 */}
        </div>
      </div>
    </div>
  );
}

//import React from 'react';
//import './bento-grid.css'; // Optional CSS for grid layout

/*const columns = [
  { header: 'Name', field: 'name' },
  { header: 'Age', field: 'age' },
  { header: 'Email', field: 'email' },
];
const data = [
  { 
    productImage: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg',
    productTitle: 'Apple iMac 27", 1TB HDD, Retina 5K Display, M3 Max', 
    age: 25, 
    email: 'alice@example.com' 
  },
];

const BentoGrid = ({ columns, data }) => {
  return (
    <div className="grid-container">
      Header Row
      <div className="grid-header">
        {columns.map((col, index) => (
          <div key={index} className="grid-column">
            {col.header}
          </div>
        ))}
      </div>
      Data Rows
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="grid-cell">
              {row[col.field]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;*/
