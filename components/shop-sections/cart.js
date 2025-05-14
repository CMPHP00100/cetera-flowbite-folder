"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useShoppingCart } from "@/context/CartContext";
import { CiTrash } from "react-icons/ci";
import { TfiPlus } from "react-icons/tfi";
import { TfiMinus } from "react-icons/tfi";
import { IoCloseOutline } from "react-icons/io5";

const Cart = () => {
  const {
    cart,
    removeItem,
    increment,
    decrement,
    totalPrice,
    applyCoupon,
    coupon,
  } = useShoppingCart();
  const [forceRender, setForceRender] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    setForceRender((prev) => !prev);
    console.log("Cart details updated in Cart component:", cart);
  }, [cart]);

  const handleApplyCoupon = () => {
    applyCoupon(couponCode); // Apply coupon when button is clicked
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      {Object.keys(cart).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {Object.values(cart).map((product) => (
              <li
                key={product.spc}
                className="list-group-item border-bottom py-3"
              >
                <div className="row align-items-center">
                  {/* Product Image */}
                  <div className="col-4 col-md-2 col-lg-2">
                    <Image
                      src={product.thumbPic}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="img-fluid rounded border border-gray-400"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="col-8 col-md-5 col-lg-6">
                    <div className="d-flex flex-column">
                      <a className="text-decoration-none text-dark" href="#">
                        <h6 className="mb-1">{product.name}</h6>
                      </a>

                      {/* Mobile Only - Price and Remove */}
                      <div className="d-flex d-md-none justify-content-between align-items-center mt-2">
                        <span className="fw-bold">${product.prc}</span>
                        <button
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => removeItem(product.spc)}
                        >
                          <CiTrash className="text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls - Mobile */}
                  <div className="col-12 d-md-none mt-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className="input-group input-group-sm"
                        style={{ width: "120px" }}
                      >
                        <button
                          className="border-1 rounded-l-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                          type="button"
                          onClick={() => decrement(product.spc)}
                        >
                          <TfiMinus />
                        </button>
                        <input
                          readOnly
                          className="form-control text-center"
                          type="text"
                          value={product.quantity}
                          name="quantity"
                        />
                        <button
                          className="border-1 rounded-r-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                          type="button"
                          onClick={() => increment(product.spc)}
                        >
                          <TfiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls - Desktop */}
                  <div className="col-md-3 col-lg-2 d-none d-md-block">
                    <div className="input-group input-group-sm">
                      <button
                        className="border-1 rounded-l-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                        type="button"
                        onClick={() => decrement(product.spc)}
                      >
                        <TfiMinus />
                      </button>
                      <input
                        readOnly
                        className="form-control text-center"
                        type="text"
                        value={product.quantity}
                        name="quantity"
                      />
                      <button
                        className="border-1 rounded-r-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                        type="button"
                        onClick={() => increment(product.spc)}
                      >
                        <TfiPlus />
                      </button>
                    </div>
                  </div>

                  {/* Price - Desktop */}
                  <div className="col-md-2 d-none d-md-block text-center">
                    <span className="fw-bold">${product.prc}</span>
                  </div>

                  {/* Remove - Desktop */}
                  <div className="col-md-1 d-none d-md-block text-end">
                    <button
                      className="btn btn-sm btn-link text-danger px-0"
                      onClick={() => removeItem(product.spc)}
                    >
                      <span class="me-1 inline-flex">
                        <CiTrash
                          value="Remove"
                          className="text-xl text-red-600"
                        />{" "}
                        <span class="text-sm text-red-600">Remove</span>
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Coupon and Total */}
          <div className="row mt-4">
            <div className="col-md-6 mb-md-0 mb-3">
              <div className="input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="form-control border-1 rounded-l border-cetera-gray bg-none p-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="border-1 hover: ml-2 rounded-r border-cetera-gray bg-cetera-gray px-4 py-2 text-white hover:border-cetera-orange hover:bg-cetera-orange"
                >
                  Apply
                </button>
              </div>

              {coupon && (
                <div className="text-success mt-2">
                  <p>Coupon Applied: {coupon}</p>
                </div>
              )}
            </div>

            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end gap-2">
                <span className="fw-bold text-uppercase border-b border-cetera-orange">
                  Total Price:
                </span>
                <span className="fs-4 text-cetera-orange">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
