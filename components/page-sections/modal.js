import React from "react";
import { IoCloseOutline } from "react-icons/io5";

//import "../custom-styles/modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          <IoCloseOutline />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Basic styles for modal
const overlayStyle = {
  position: "fixed",
  top: "-22rem",
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "",
  borderRadius: "5px",
  width: "75%",
  //minHeight: "50vh",
  height: "80vh",
  marginTop: "21rem",
  overflowY: "scroll",
  overflowX: "hidden",
};

const closeButtonStyle = {
  position: "absolute",
  top: "28.8rem",
  right: "14.5rem",
  padding: "5px 10px",
  cursor: "pointer",
  fontSize: "2.2rem",
  color: "#f85f14",
};

export default Modal;
