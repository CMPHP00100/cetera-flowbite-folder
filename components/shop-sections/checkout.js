"use client";
import { useState } from "react";
import { useShoppingCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useShoppingCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customer: formData,
      cart: cart,
      total: totalPrice,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Checkout failed");

      clearCart(); // Empty cart after successful checkout
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-2xl font-bold">Checkout</h2>

      <ul>
        {Object.values(cart).map((item) => (
          <li key={item.spc} className="border-b py-2">
            {item.name} - ${item.prc} x {item.quantity}
          </li>
        ))}
      </ul>

      <h3 className="mt-4 text-lg font-bold">
        Total: ${totalPrice.toFixed(2)}
      </h3>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-2 w-full border p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-2 w-full border p-2"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          className="mb-2 w-full border p-2"
          required
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 px-4 py-2 text-white"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
