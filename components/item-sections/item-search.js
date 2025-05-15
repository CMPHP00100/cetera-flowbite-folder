import { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setSelectedItem } from "@/redux/slices/itemsSlice";
import Image from "next/image";

export default function ItemSearch({ item }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // Fetch all results when component mounts
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async (searchQuery = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/search?query=${searchQuery}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      //setResults(data);
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change and search on demand
  const handleSearch = () => {
    fetchResults(query);
  };

  const handleClick = () => {
    dispatch(setSelectedItem(item)); // Update Redux state
    localStorage.setItem("selectedItem", JSON.stringify(item)); // Save to localStorage
  };

  return (
    <>
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
                  class="mt-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  class="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>
          </div>{" "}
          {results.length > 0 ? (
            <div class="row mt-4">
              {results.map((item, index) => (
                <div key="index" class="col-sm-3">
                  <div class="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <a href="#">
                      <Image
                        class="rounded-t-lg p-8"
                        src={item.thumbPic}
                        alt={item.name}
                      />
                    </a>
                    <div class="px-5 pb-5">
                      <a href="#">
                        <h6 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                          {item.name}
                        </h6>
                      </a>
                      <div class="flex items-center justify-between">
                        <span class="text-md font-bold text-gray-900 dark:text-white">
                          {item.prc}
                        </span>
                        <small>{item.spc}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-primary mt-3 text-sm"
                        onClick={handleClick}
                      >
                        <FaCartPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}{" "}
            </div>
          ) : (
            !loading && <p>No results found.</p>
          )}
        </div>
      </div>
    </>
  );
}
