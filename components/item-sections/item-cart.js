/*import { useCart } from "../../context/cart-context";

export default function ItemCart() {
  const { cart, removeFromCart } = useCart();

  console.log(cart);
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> - ${item.prc}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}*/
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/slices/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items); // Get cart items
  const dispatch = useDispatch();

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id)); // Remove item
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.prodEId}>
            {item.name} - {item.prc}
            <button onClick={() => handleRemoveItem(item.prodEId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
