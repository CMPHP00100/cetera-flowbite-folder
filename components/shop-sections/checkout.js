//components/shop-sections/checkout.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useShoppingCart } from "@/context/CartContext";
import { useOrderHistory } from "@/context/OrderContext";
import { CiCreditCard1, CiUser, CiLocationOn } from "react-icons/ci";
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";

const Checkout = ({ onBack }) => {
  const {
    cart,
    totalPrice,
    coupon,
    discount,
    clearCart,
    getCartItemCount,
  } = useShoppingCart();

  // Inside the Checkout component, add this after the useShoppingCart hook
  const { addOrder } = useOrderHistory();

  // Form states
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  // Shipping information
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    shippingMethod: "standard",
  });

  // Payment information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    sameAsShipping: true,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Shipping options
  const shippingOptions = [
    { id: "standard", name: "Standard Shipping (5-7 days)", price: 9.99 },
    { id: "express", name: "Express Shipping (2-3 days)", price: 19.99 },
    { id: "overnight", name: "Overnight Shipping (1 day)", price: 39.99 },
  ];

  // Calculate shipping cost
  const getShippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === shippingInfo.shippingMethod);
    return option ? option.price : 0;
  };

  // Calculate tax (example: 8.5%)
  const getTaxAmount = () => {
    return (totalPrice + getShippingCost()) * 0.085;
  };

  // Calculate final total
  const getFinalTotal = () => {
    return totalPrice + getShippingCost() + getTaxAmount();
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

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};
    if (!customerInfo.firstName.trim()) newErrors.firstName = "First name is required";
    if (!customerInfo.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!customerInfo.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = "Invalid email format";
    if (!customerInfo.phone.trim()) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!paymentInfo.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = "Card number is required";
    if (!paymentInfo.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!paymentInfo.cvv) newErrors.cvv = "CVV is required";
    if (!paymentInfo.cardName.trim()) newErrors.cardName = "Cardholder name is required";
    
    if (!paymentInfo.sameAsShipping) {
      if (!paymentInfo.billingAddress.trim()) newErrors.billingAddress = "Billing address is required";
      if (!paymentInfo.billingCity.trim()) newErrors.billingCity = "Billing city is required";
      if (!paymentInfo.billingState.trim()) newErrors.billingState = "Billing state is required";
      if (!paymentInfo.billingZip.trim()) newErrors.billingZip = "Billing ZIP is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submissions
  const handleNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (isValid && currentStep === 3) {
      handlePlaceOrder();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Format card number input
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
  setIsProcessing(true);
  
  try {
    const orderData = {
      id: 'ORD-' + Date.now(),
      customer: customerInfo,
      shipping: shippingInfo,
      payment: { ...paymentInfo, cardNumber: paymentInfo.cardNumber.replace(/\s/g, '') },
      items: Object.values(cart),
      totals: {
        subtotal: totalPrice,
        shipping: getShippingCost(),
        tax: getTaxAmount(),
        total: getFinalTotal(),
        discount: discount,
        coupon: coupon,
      },
      date: new Date().toISOString(),
      status: 'Processing'
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save the order
    addOrder(orderData);
    setOrderId(orderData.id);
    setOrderComplete(true);
    clearCart();
    
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order is complete, show success page
  if (orderComplete) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center">
              <IoCheckmarkCircle className="text-success mb-3" size={80} />
              <h2 className="text-success mb-3">Order Confirmed!</h2>
              <p className="text-muted mb-4">
                Thank you for your order. Your order number is <strong>{orderId}</strong>
              </p>
              <p className="text-muted mb-4">
                You will receive an email confirmation shortly with tracking information.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn btn-outline-secondary"
                >
                  Continue Shopping
                </button>
                <button 
                   onClick={() => window.location.href = `/orders/${orderId}`}
                  className="btn btn-primary"
                >
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button
          onClick={onBack}
          className="btn btn-link text-decoration-none p-0 me-3 text-cetera-gray hover:text-cetera-orange"
        >
          <IoArrowBack size={24} />
        </button>
        <h2 className="mb-0">Checkout</h2>
      </div>

      {/* Progress Steps */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="d-flex align-items-center flex-fill">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${
                    currentStep >= step
                      ? 'bg-cetera-orange text-white'
                      : 'bg-light text-muted'
                  }`}
                  style={{ width: '40px', height: '40px' }}
                >
                  {step === 1 && <CiUser size={20} />}
                  {step === 2 && <CiLocationOn size={20} />}
                  {step === 3 && <CiCreditCard1 size={20} />}
                </div>
                <div className="ms-2 d-none d-md-block">
                  <small className="text-muted">
                    {step === 1 && 'Customer Info'}
                    {step === 2 && 'Shipping'}
                    {step === 3 && 'Payment'}
                  </small>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-fill border-top mx-3 ${
                      currentStep > step ? 'border-1 border-cetera-orange' : 'border-light-gray'
                    }`}
                    style={{ height: '2px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Form */}
        <div className="col-lg-8">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="card border-cetera-gray">
              <div className="card-header bg-cetera-gray text-white">
                <h5 className="mb-0">Customer Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.firstName ? 'is-invalid' : ''}`}
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.lastName ? 'is-invalid' : ''}`}
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.email ? 'is-invalid' : ''}`}
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label border-[#ccc] rounded">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.phone ? 'is-invalid' : ''}`}
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Company (Optional)</label>
                    <input
                      type="text"
                      className="form-control border-[#ccc] rounded focus:border-cetera-orange"
                      value={customerInfo.company}
                      onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Information */}
          {currentStep === 2 && (
            <div className="card border-cetera-gray">
              <div className="card-header bg-cetera-gray text-white">
                <h5 className="mb-0">Shipping Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Address <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.address ? 'is-invalid' : ''}`}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.city ? 'is-invalid' : ''}`}
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">State <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.state ? 'is-invalid' : ''}`}
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">ZIP Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.zipCode ? 'is-invalid' : ''}`}
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    />
                    {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Shipping Method</label>
                    {shippingOptions.map((option) => (
                      <div key={option.id} className="form-check">
                        <input
                          className="form-check-input checked:bg-cetera-orange"
                          type="radio"
                          name="shippingMethod"
                          value={option.id}
                          checked={shippingInfo.shippingMethod === option.id}
                          onChange={(e) => setShippingInfo({...shippingInfo, shippingMethod: e.target.value})}
                        />
                        <label className="form-check-label d-flex justify-content-between w-100">
                          <span>{option.name}</span>
                          <span className="fw-bold">${option.price.toFixed(2)}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Information */}
          {currentStep === 3 && (
            <div className="card border-cetera-gray">
              <div className="card-header bg-cetera-gray text-white">
                <h5 className="mb-0">Payment Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Cardholder Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.cardName ? 'is-invalid' : ''}`}
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                    />
                    {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Card Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.cardNumber ? 'is-invalid' : ''}`}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.expiryDate ? 'is-invalid' : ''}`}
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`form-control border-[#ccc] rounded focus:border-cetera-orange ${errors.cvv ? 'is-invalid' : ''}`}
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                  </div>
                  
                  {/* Billing Address */}
                  <div className="col-12 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={paymentInfo.sameAsShipping}
                        onChange={(e) => setPaymentInfo({...paymentInfo, sameAsShipping: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Billing address same as shipping address
                      </label>
                    </div>
                  </div>
                  
                  {!paymentInfo.sameAsShipping && (
                    <>
                      <div className="col-12 mb-3">
                        <label className="form-label">Billing Address <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.billingAddress ? 'is-invalid' : ''}`}
                          value={paymentInfo.billingAddress}
                          onChange={(e) => setPaymentInfo({...paymentInfo, billingAddress: e.target.value})}
                        />
                        {errors.billingAddress && <div className="invalid-feedback">{errors.billingAddress}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Billing City <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.billingCity ? 'is-invalid' : ''}`}
                          value={paymentInfo.billingCity}
                          onChange={(e) => setPaymentInfo({...paymentInfo, billingCity: e.target.value})}
                        />
                        {errors.billingCity && <div className="invalid-feedback">{errors.billingCity}</div>}
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Billing State <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.billingState ? 'is-invalid' : ''}`}
                          value={paymentInfo.billingState}
                          onChange={(e) => setPaymentInfo({...paymentInfo, billingState: e.target.value})}
                        />
                        {errors.billingState && <div className="invalid-feedback">{errors.billingState}</div>}
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Billing ZIP <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.billingZip ? 'is-invalid' : ''}`}
                          value={paymentInfo.billingZip}
                          onChange={(e) => setPaymentInfo({...paymentInfo, billingZip: e.target.value})}
                        />
                        {errors.billingZip && <div className="invalid-feedback">{errors.billingZip}</div>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button
              onClick={handlePrevStep}
              className={`btn btn-outline-secondary hover:bg-cetera-gray hover:border-cetera-gray ${currentStep === 1 ? 'd-invisible' : ''}`}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              className="btn bg-cetera-gray hover:bg-cetera-orange text-white"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                currentStep === 3 ? 'Place Order' : 'Next'
              )}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-lg-4">
          <div className="card position-sticky border-cetera-gray" style={{ top: '20px' }}>
            <div className="card-header bg-cetera-gray text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              {/* Cart Items */}
              <div className="mb-3">
                <h6 className="text-muted mb-2">Items ({getCartItemCount()})</h6>
                {Object.values(cart).slice(0, 3).map((product) => (
                  <div key={product.cartId} className="d-flex align-items-center mb-2">
                    <Image
                      src={updateRSParam(product.pics?.[0]?.url || product.thumbPic, "200")}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded border me-2"
                    />
                    <div className="flex-fill">
                      <div className="text-sm">{product.displayName || product.name}</div>
                      <div className="text-xs text-muted">Qty: {product.quantity}</div>
                    </div>
                  </div>
                ))}
                {Object.keys(cart).length > 3 && (
                  <div className="text-muted text-sm">
                    +{Object.keys(cart).length - 3} more items
                  </div>
                )}
              </div>

              <hr />

              {/* Price Breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success">
                    <span>Discount ({coupon}):</span>
                    <span>-${((totalPrice * discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-1">
                  <span>Shipping:</span>
                  <span>${getShippingCost().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Tax:</span>
                  <span>${getTaxAmount().toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="alert alert-light text-center">
                <small className="text-muted">
                  <i className="fas fa-lock me-1"></i>
                  Your payment information is secure and encrypted
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;