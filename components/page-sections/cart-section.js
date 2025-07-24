"use client";
import "../custom-styles/cart.css";
import { FaTrashAlt } from "react-icons/fa";
import { PiArrowFatLinesUpDuotone } from "react-icons/pi";
import { PiArrowFatLinesDownDuotone } from "react-icons/pi";
import Image from "next/image";

const CartSection = ({
  image,
  title,
  price,
  category,
  quantity,
  remove,
  increment,
  decrement,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center cart-container w-100 line-item flex-wrap p-0 text-center">
        {/* Product Image */}
        <div className="col-12 col-md-3 d-flex justify-content-center mx-auto">
          <Image
            src={image}
            className="img-fluid rounded-3"
            alt={title}
          />
        </div>

        {/* Product Details */}
        <div className="col-12 col-md-4 text-md-start">
          <h6 className="text-muted">{category}</h6>
          <h6 className="mb-0">{title}</h6>
        </div>

        {/* Quantity Controls */}
        <div className="col-12 col-md-2 d-flex justify-content-center align-items-center">
          <button className="btn btn-link px-2" onClick={decrement}>
            <i className="fas fa-minus">
              <PiArrowFatLinesDownDuotone />
            </i>
          </button>

          {/*<input
            id="form1"
            min="0"
            name="quantity"
            value={quantity}
            type="number"
            className="form-control form-control-sm w-50 text-center"
          />*/}
          <span className="mx-2">{quantity}</span>

          <button className="btn btn-link px-2" onClick={increment}>
            <i className="fas fa-plus">
              <PiArrowFatLinesUpDuotone />
            </i>
          </button>
        </div>

        {/* Price */}
        <div className="col-12 col-md-2 text-center">
          <h6 className="mb-0">$ {price}</h6>
        </div>

        {/* Remove */}
        <div className="col-2 col-md-1 text-red trash-icon text-center">
          <button onClick={remove}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <hr />
    </>
  );
};
export default CartSection;
