import React from "react";
import { formatDateTime, formatPrice } from "../../utils";

const OrderCard = ({ order, onClick, onReject }) => {
  return (
    <div className="card order-card mb-3" style={{ cursor: "pointer" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">
              {order?.deviceName || "Thiết bị chưa xác định"}
            </h5>

            <div className="mt-2">
              <small className="text-muted">
                <i className="fas fa-map-marker-alt text-danger me-1"></i>
                {order?.addressWard}, {order?.addressDistrict}
              </small>
            </div>
          </div>

          <div className="text-end">
            <div className="text-primary fw-bold">
              {formatPrice(order?.total)}
            </div>
            <small className="text-muted">
              {formatDateTime(order?.createdAt)}
            </small>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="far fa-clock me-1"></i>
            Lịch hẹn: {formatDateTime(order?.repairDate)}
          </small>
          <div className="text-end mt-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={onClick}
            >
              <i className="fas fa-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
