/*import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/textSlice";

export default function ItemsPage() {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/search?query=flashlight`);
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleSelect = (item) => {
    console.log("Dispatching item:", item);
    dispatch(addItem(item)); // Add to Redux state
    let storedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
    storedItems.push(item);
    localStorage.setItem("selectedItems", JSON.stringify(storedItems)); // Save all selected items
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Select Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => handleSelect(item)}>{item.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}*/
