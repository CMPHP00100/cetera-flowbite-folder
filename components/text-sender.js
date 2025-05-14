import { useSelector } from "react-redux";

const TextSender = () => {
  const texts = useSelector((state) => state.text.values);

  return (
    <div>
      <h2>Redux Array:</h2>
      <ul>
        {texts.map((text, index) => (
          <li key={index}>{text}</li> // Display list items
        ))}
      </ul>
    </div>
  );
};

export default TextSender;
