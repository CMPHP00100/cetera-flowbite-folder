import { useSelector } from "react-redux";

const DisplayImages = () => {
  const { data, loading, error } = useSelector((state) => state.apiData);
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!Array.isArray(data) || data.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div>
      <h2>List of Items</h2>
      <div className="row">
        {data.map((item) => (
          <div
            className="col-12 col-sm-6 col-md-3 w-full py-2.5"
            key={item.public_id}
          >
            <img
              className="object-cover"
              src={item.secure_url}
              alt={item.public_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default DisplayImages;
