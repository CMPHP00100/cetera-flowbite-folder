//components/shop-sections/cart.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useShoppingCart } from "@/context/CartContext";
import { CiTrash } from "react-icons/ci";
import { TfiPlus } from "react-icons/tfi";
import { TfiMinus } from "react-icons/tfi";
import { IoCloseOutline } from "react-icons/io5";
import { CiCreditCard1 } from "react-icons/ci";

const Cart = ({ onProceedToCheckout }) => {
  const {
    cart,
    clearCart,
    removeItem,
    increment,
    decrement,
    totalPrice,
    applyCoupon,
    coupon,
    getCartItemCount,
    updateQuantityTier,
  } = useShoppingCart();
  const [forceRender, setForceRender] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    setForceRender((prev) => !prev);
    console.log("Cart details updated in Cart component:", cart);
  }, [cart]);

  const handleApplyCoupon = () => {
    applyCoupon(couponCode);
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear all items from your cart?")) {
      clearCart();
    }
  };

  // Update image URL parameters
  const updateRSParam = (url, newRSValue) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      if (params.get("RS") !== newRSValue) {
        params.set("RS", newRSValue);
        urlObj.search = params.toString();
      }
      return urlObj.toString();
    } catch {
      return url;
    }
  };

  // Get available quantity tiers for a product
  const getQuantityTiers = (product) => {
    if (!product.originalProductDetails?.qty) return [];
    
    return product.originalProductDetails.qty
      .map((qty, index) => ({
        qty,
        price: product.originalProductDetails.prc?.[index] || product.prc,
        index
      }))
      .filter(pair => 
        pair.qty && 
        pair.qty !== '' && 
        pair.qty !== '0' && 
        pair.price && 
        pair.price !== ''
      );
  };

  // Get the selected tier for a product
  const getSelectedTier = (product) => {
    const tiers = getQuantityTiers(product);
    return tiers.find(tier => tier.qty === product.selectedQuantity) || tiers[0];
  };

  // Calculate the price based on selected tier
  const calculateTierPrice = (product) => {
    const selectedTier = getSelectedTier(product);
    if (selectedTier) {
      return selectedTier.qty * selectedTier.price;
    }
    return product.prc; // fallback to original price
  };

  // Handle quantity tier change
  const handleQuantityTierChange = (product, newQty) => {
    const tiers = getQuantityTiers(product);
    const selectedTier = tiers.find(tier => tier.qty === newQty);
    
    if (selectedTier && updateQuantityTier) {
      updateQuantityTier(product.cartId, newQty, selectedTier.price);
    }
  };

  return (
    <div className="container-fluid p-4 bg-cetera-dark-blue my-8">
      {/* Cart Header with Clear Button */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
        <h1 className="mb-0 font-cetera-libre text-[2.5rem] sm:text-[4rem] text-cetera-light-gray">Shopping Cart <span className="text-[1.5rem]">({getCartItemCount()} items)</span></h1>
        {Object.keys(cart).length > 0 && (
          <button
            onClick={handleClearCart}
            className="btn btn-outline-danger btn-dm"
          >
            <div className="row">
              <span className="col-2 me-1">
                <CiTrash className="text-[18px]" />
              </span>
              <span className="col-8 text-sm px-0">
                <span>Clear Cart</span>
              </span>
            </div>
          </button>
        )}
      </div>

      {Object.keys(cart).length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted mb-3">Your cart is empty.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/products'}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="list-group bg-cetera-light-gray">
            {Object.values(cart).map((product) => {
              const quantityTiers = getQuantityTiers(product);
              const hasMultipleTiers = quantityTiers.length > 1;
              const selectedTier = getSelectedTier(product);
              const tierPrice = calculateTierPrice(product);
              
              return (
                <li
                  key={product.cartId || product.spc}
                  id={product.prodEId}
                  className="list-group-item border-bottom py-3"
                >
                  <div className="row align-items-center">
                    {/* Product Image */}
                    <div className="col-4 col-md-2 col-lg-2">
                      <Image
                        src={updateRSParam(
                          product.pics?.[0]?.url || product.thumbPic,
                          "1800"
                        )}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="img-fluid rounded border border-gray-400"
                      />
                      {/* Remove Button - Desktop */}
                      <div className="d-none d-md-block mt-2 text-start">
                        <button
                          className="btn btn-sm btn-link text-danger px-0"
                          onClick={() => removeItem(product.cartId || product.prodEId)}
                        >
                          <span className="inline-flex">
                            <CiTrash
                              value="Remove"
                              className="text-xl text-red-600"
                            />
                            <span className="text-sm text-red-600">Remove</span>
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-8 col-md-5 col-lg-6">
                      <div className="d-flex flex-column">
                        <a className="text-decoration-none text-dark" href="#">
                          <h6 className="mb-1">
                            {product.displayName || product.name}
                          </h6>
                        </a>
                        
                        {/* Show selected options */}
                        <div className="text-sm text-gray-600">
                          {product.selectedColor && (
                            <span className="me-2">Color: {product.selectedColor}</span>
                          )}
                          {product.selectedQuantity && (
                            <span>Tier: {product.selectedQuantity} pcs</span>
                          )}
                        </div>

                        {/* Price - Desktop */}
                        <div className="d-none d-md-block">
                          <span className="fw-bold">${selectedTier ? (selectedTier.qty * selectedTier.price).toFixed(2) : product.prc}</span>
                          <span className="text-muted text-sm ms-2">total</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Tier Selector (if multiple tiers available) */}
                    <div className="col-12 col-md-5 col-lg-4 mt-2 mt-md-0">
                      <div className="row">
                        {hasMultipleTiers && (
                          <div className="col-12 mb-2">
                            <select
                              value={product.selectedQuantity || ''}
                              onChange={(e) => handleQuantityTierChange(product, e.target.value)}
                              className="form-select form-select-sm"
                            >
                              {quantityTiers.map((tier) => (
                                <option key={tier.index} value={tier.qty}>
                                  {tier.qty} pcs - ${parseFloat(tier.price).toFixed(2)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Quantity Controls */}
                        <div className="col-12">
                          <div className="d-flex align-items-center justify-content-between">
                            <div
                              className="input-group input-group-sm"
                              style={{ width: "120px" }}
                            >
                              <button
                                className="border-1 rounded-l-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                                type="button"
                                onClick={() => decrement(product.cartId || product.prodEId)}
                              >
                                <TfiMinus />
                              </button>
                              <input
                                readOnly
                                className="form-control text-center border-[#ccc] border-1"
                                type="text"
                                value={product.quantity}
                                name="quantity"
                              />
                              <button
                                className="border-1 rounded-r-lg border border-gray-500 bg-none p-2 hover:border-cetera-orange hover:bg-cetera-orange hover:text-white"
                                type="button"
                                onClick={() => increment(product.cartId || product.prodEId)}
                              >
                                <TfiPlus />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Only - Remove */}
                        <div className="col-6 d-md-none text-start mt-3">
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => removeItem(product.cartId || product.prodEId)}
                          >
                            <CiTrash className="text-xl" />
                          </button>
                        </div>

                        {/* Price - Mobile */}
                        <div className="col-6 d-md-none mt-3 text-end">
                          <span className="fw-bold">${selectedTier ? (selectedTier.qty * selectedTier.price * product.quantity).toFixed(2) : (product.prc * product.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
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
                  className="form-control border-1 rounded-l border-cetera-gray bg-none p-2 bg-cetera-light-gray"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="border-1 hover: ml-2 rounded-r border-cetera-gray bg-cetera-gray px-4 py-2 text-white hover:border-cetera-orange hover:bg-cetera-orange hover:border-1"
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

            <div className="col-md-6 text-md-end font-cetera-josefin">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end gap-2">
                <span className="fw-bold text-uppercase border-b border-cetera-orange text-cetera-light-gray">
                  Subtotal:
                </span>
                <span className="fs-4 text-cetera-orange">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card bg-cetera-light-gray border-cetera-gray border-1">
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="mb-3 mb-md-0">
                      <h5 className="mb-1">Ready to checkout?</h5>
                      <p className="text-muted mb-0 small">
                        {getCartItemCount()} items • Estimated total: ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-secondary hover:bg-cetera-gray hover:border-cetera-gray hover:border-1"
                        onClick={() => window.location.href = '/shop'}
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={onProceedToCheckout}
                        className="p-2 rounded-md bg-cetera-dark-blue text-white hover:bg-cetera-orange d-flex align-items-center"
                      >
                        <CiCreditCard1 className="me-2" size={20} />
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;