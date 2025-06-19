import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils";

const OrderAcceptedModal = ({ order, onClose }) => {
  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <i className="fas fa-check-circle me-2"></i>Đã nhận đơn thành công
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{order?.deviceName}</h5>
        <p>
          <strong>Giá:</strong> {formatPrice(order?.total) }
        </p>
        <p>
          <strong>Địa chỉ:</strong> {order?.addressStreet}, {order?.addressWard}, 
          {order?.addressDistrict}, {order?.addressCity}
        </p>
        <p>
          <strong>Liên hệ:</strong> {order?.phone}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Link
          to={`/user/order-detail/${order?.id}`}
          className="btn btn-success"
          onClick={onClose}
        >
          <i className="fas fa-receipt me-2"></i>Xem đơn hàng
        </Link>

        <Button variant="outline-secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderAcceptedModal;
