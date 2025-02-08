import { useSelector } from "react-redux";

const DisplayDetails = ({ itemId }) => {
  const { data } = useSelector((state) => state.apiData);
  const item = data.find((d) => d.id === itemId);

  if (!item) return <p>Item not found</p>;

  return (
    <div>
      <h3>Details for Item {item.public_id}</h3>
      <p>{item.secure_url}</p>
    </div>
  );
};

export default DisplayDetails;
