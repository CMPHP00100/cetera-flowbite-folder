import { useSelector } from "react-redux";

export default function ItemsPage() {
  const item = useSelector((state) => state.item.selectedItem);

  return (
    <div>
      <h2>Item Details</h2>
      {item ? (
        <p>
          {item.name} (ID: {item.id}) (src: {item.thumbPic})
        </p>
      ) : (
        <p>No item selected</p>
      )}
    </div>
  );
}
