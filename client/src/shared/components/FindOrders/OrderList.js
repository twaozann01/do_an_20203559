import React from "react";
import OrderCard from "./OrderCard";

const OrderList = ({ isActive, orders, setSelectedOrder, setOrders }) => {
  if (!isActive) return null;

  const handleReject = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối đơn hàng này không?")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h5 className="mb-0">
            <i className="fas fa-list-ol me-2"></i>Đơn hàng phù hợp
          </h5>
          <span className="badge bg-primary rounded-pill">
            {orders.length} đơn
          </span>
        </div>
        <p className="mb-0 text-muted small">
          Chọn đơn phù hợp để xem chi tiết và nhận việc
        </p>
      </div>

      <div className="card-body">
        {orders.length === 0 ? (
          <p className="text-center text-muted">
            Hiện không có đơn hàng phù hợp.
          </p>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => setSelectedOrder(order)}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
