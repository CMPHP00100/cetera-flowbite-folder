"use client";

import { useOrderHistory } from "@/context/OrderContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CiCreditCard1, CiBoxes, CiCalendar } from "react-icons/ci";
import { IoCheckmarkCircle, IoTimeOutline } from "react-icons/io5";

export default function OrderHistory() {
  const { orders } = useOrderHistory();

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

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h3 className="mb-3">No orders yet</h3>
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>
      
      <div className="list-group">
        {orders.map((order) => (
          <div key={order.id} className="list-group-item mb-3 rounded border">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h5 className="mb-0">Order #{order.id}</h5>
                <small className="text-muted">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </small>
              </div>
              <div className="d-flex align-items-center">
                {order.status === 'Processing' ? (
                  <span className="badge bg-warning text-dark me-2">
                    <IoTimeOutline className="me-1" /> Processing
                  </span>
                ) : (
                  <span className="badge bg-success me-2">
                    <IoCheckmarkCircle className="me-1" /> Completed
                  </span>
                )}
                <span className="fw-bold">${order.totals.total.toFixed(2)}</span>
              </div>
            </div>

            <hr className="my-2" />

            <div className="row">
              <div className="col-md-8">
                <div className="d-flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.cartId} className="d-flex align-items-center me-3">
                      <Image
                        src={updateRSParam(item.pics?.[0]?.url || item.thumbPic, "100")}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded border me-2"
                      />
                      <div>
                        <div className="text-sm">{item.displayName || item.name}</div>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-muted">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <Link 
                  href={`/orders/${order.id}`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}