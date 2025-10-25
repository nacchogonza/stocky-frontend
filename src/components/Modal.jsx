import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtonText,
  onAction,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title || "Detalles"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {actionButtonText && onAction && (
          <div className="modal-footer">
            <button className="btn-primary" onClick={onAction}>
              {actionButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
