import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatDateTime, formatPrice } from '../../utils';

const OrderDetailModal = ({ order, isActive, onAccept, onReject, onClose }) => {
  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Chi tiết đơn hàng 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Mã đơn hàng: {order?.orderCode}</h5>
        <p><strong>Thiết bị:</strong> {order?.deviceName}</p>
        <p><strong>Giá:</strong> {formatPrice(order?.total)}</p>
        <p><strong>Địa điểm</strong> {order?.addressWard}, {order?.addressDistrict}</p>
        <p><strong>Thời gian mong muốn:</strong> {formatDateTime(order?.repairDate)}</p>
        <p className="text-muted">(Thông tin khách hàng sẽ hiển thị sau khi nhận đơn)</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn từ chối đơn hàng này không?')) {
              onReject(order.id);
            }
          }}
        >
          Từ chối
        </Button>
        <Button
  variant="primary"
  onClick={() => onAccept(order)}
  disabled={!isActive}
>
  Nhận đơn ngay
</Button>

      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;
