import React, { useEffect, useState } from "react";
//import "bootstrap/dist/css/bootstrap.min.css";

const ItemList = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/sage");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        if (result) {
        }
        setProducts(result.products);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <h1>SAGE Data</h1>
      {/*<pre>{JSON.stringify(products, null, 2)}</pre>*/}
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <form class="mx-auto max-w-md">
              <label
                for="default-search"
                class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Search
              </label>
              <div class="relative">
                <input
                  type="search"
                  id="default-search"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  class="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          {products.map((product) => (
            <div key="product" class="col-sm-3">
              <div class="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <a href="#">
                  <img
                    class="rounded-t-lg p-8"
                    src={product.thumbPic}
                    alt={product.name}
                  />
                </a>
                <div class="px-5 pb-5">
                  <a href="#">
                    <h6 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {product.name}
                    </h6>
                  </a>
                  <div class="flex items-center justify-between">
                    <span class="text-md font-bold text-gray-900 dark:text-white">
                      {product.prc}
                    </span>
                    <small>{product.spc}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ItemList;
