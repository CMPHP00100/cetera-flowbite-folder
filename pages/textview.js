/*import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setItems } from "../redux/slices/textSlice";

export default function ViewPage() {
  const dispatch = useDispatch();
  const selectedItems = useSelector((state) => state.text.selectedItems);
  //const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];
    dispatch(setItems(storedItems));
  }, [dispatch]); // Refresh on Redux updates

  // Sync localStorage whenever Redux updates
  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]); // Runs every time Redux state changes

  return (
    <div>
      <h1>Selected Items</h1>
      {selectedItems.length === 0 ? (
        <p>No items selected.</p>
      ) : (
        <ul>
          {selectedItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}*/

/*import { useSelector } from "react-redux";

export default function ViewPage() {
  const selectedItems = useSelector((state) => state.text.selectedItems); // Get state from Redux
  console.log("Selected Items:", selectedItems);
  return (
    <div>
      <h1>Selected Items</h1>
      {selectedItems.length === 0 ? (
        <p>No items selected.</p>
      ) : (
        <ul>
          {selectedItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}*/
