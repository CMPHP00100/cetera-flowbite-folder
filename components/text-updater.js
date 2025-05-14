import { useDispatch } from "react-redux";
import { updateText, addText } from "@/redux/slices/textSlice";

const TextUpdater = ({ newTexts }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(updateText(newTexts));
  };

  const handleAdd = () => {
    dispatch(addText("New Item")); // Add a new item
  };

  return (
    <>
      <button onClick={handleUpdate}>Update Array</button>
      <button onClick={handleAdd}>Add Item</button>
    </>
  );
};

export default TextUpdater;
