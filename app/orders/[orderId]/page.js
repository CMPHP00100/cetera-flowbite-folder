"use client";

import { useOrderHistory } from "@/context/OrderContext";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CiCreditCard1, CiBoxes, CiCalendar, CiLocationOn } from "react-icons/ci";
import { IoCheckmarkCircle, IoTimeOutline, IoArrowBack } from "react-icons/io5";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { orders } = useOrderHistory();
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h3 className="mb-3">Order not found</h3>
          <p className="text-muted mb-4">We couldn't find the order you're looking for.</p>
          <Link href="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Update image URL parameters (same as in your cart component)
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

  return (
    <div className="container py-4 font-cetera-josefin">
      <div className="d-flex align-items-center mb-4">
        <Link href="/orders" className="btn text-cetera-dark-blue hover:text-cetera-mono-orange p-0 me-3">
          <IoArrowBack size={24} />
        </Link>
        <h2 className="mb-0">Order #{order.id}</h2>
      </div>

      <div className="row">
        {/* Order Summary */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.cartId}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Image
                              src={updateRSParam(item.pics?.[0]?.url || item.thumbPic, "100")}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded border me-3"
                            />
                            <div>
                              <div>{item.displayName || item.name}</div>
                              {item.selectedColor && (
                                <small className="text-muted">Color: {item.selectedColor}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>${item.prc.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.prc * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <h6>Shipping Address</h6>
                  <address>
                    {order.customer.firstName} {order.customer.lastName}<br />
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                    {order.shipping.country}
                  </address>
                </div>
                <div className="col-md-6">
                  <h6>Shipping Method</h6>
                  <p>
                    {order.shipping.shippingMethod === 'standard' && 'Standard Shipping (5-7 days)'}
                    {order.shipping.shippingMethod === 'express' && 'Express Shipping (2-3 days)'}
                    {order.shipping.shippingMethod === 'overnight' && 'Overnight Shipping (1 day)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Totals */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Details</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Status:</span>
                  <span className="fw-bold">
                    {order.status === 'Processing' ? (
                      <span className="badge bg-warning text-dark">
                        <IoTimeOutline className="me-1" /> Processing
                      </span>
                    ) : (
                      <span className="badge bg-success flex">
                        <IoCheckmarkCircle className="me-1" /> Completed
                      </span>
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Order Date:</span>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <h6 className="mb-3">Payment Summary</h6>
                <div className="d-flex justify-content-between mb-1">
                  <span>Subtotal:</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                {order.totals.discount > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success">
                    <span>Discount ({order.totals.coupon}):</span>
                    <span>-${((order.totals.subtotal * order.totals.discount) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-1">
                  <span>Shipping:</span>
                  <span>${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Tax:</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${order.totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="alert alert-light mt-4">
                <h6>Payment Method</h6>
                <p>
                  Credit Card ending in ****{order.payment.cardNumber.slice(-4)}<br />
                  {order.payment.cardName}
                </p>
              </div>
            </div>
          </div>

          <Link href="/products" className="btn bg-cetera-dark-blue text-cetera-light-gray hover:bg-cetera-mono-orange w-100">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}