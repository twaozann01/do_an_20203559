/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrder,
  getVATCurrent,
  patchUpdatePayment,
} from "../../../services/Api";
import { formatDateTime, formatPrice } from "../../../shared/utils";

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [vat, setVat] = useState(null); // giá trị mặc định tạm thời
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, vatRes] = await Promise.all([
          getOrder(id),
          getVATCurrent(),
        ]);
        setOrder(orderRes.data.data);
        setVat(vatRes.data.value);
      } catch (err) {
        alert("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);
  const handleUpdatePaymentWithConfirm = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn thanh toán không?"
    );
    if (!confirmed) return;

    try {
      const res = await patchUpdatePayment(id);
      alert("✅Thanh toán thành công!");
      console.log("Phản hồi:", res.data);
      // Ví dụ: cập nhật state nếu cần
      // setOrder({ ...order, paymentStatus: true });
    } catch (error) {
      console.error("❌ Lỗi thanh toán:", error);
      alert("❌ Thanh toán thất bại: " + (error.response?.data || "Lỗi server"));
    }
  };
  //   const handlePay = async () => {
  //     try {
  //       const res = await postOrderPayment(order.id);
  //       alert(res.data.message);
  //       setOrder({ ...order, paymentStatus: true });
  //     } catch (err) {
  //       alert(err.response?.data || "Lỗi khi thanh toán.");
  //     }
  //   };

  if (loading || !order)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Đang tải chi tiết đơn hàng...</p>
      </div>
    );

  const serviceFee = (order.total ?? 0) * vat;

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="fas fa-receipt me-2"></i>Chi tiết đơn hàng
        </h5>
        <span
          className={`badge ${
            order.paymentStatus ? "bg-success" : "bg-warning text-dark"
          }`}
        >
          {order.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
        </span>
      </div>

      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <p>
              <strong>Mã đơn:</strong> {order.orderCode}
            </p>
            <p>
              <strong>Ngày hoàn thành:</strong>{" "}
              {formatDateTime(order.completedAt)}
            </p>
            <p>
              <strong>Hạn thanh toán:</strong>{" "}
              {formatDateTime(order.paymentTerm)}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Chi phí gốc:</strong> {formatPrice(order.total)}
            </p>
            <p>
              <strong>Phí dịch vụ: </strong><span className="text-danger fw-bold">
                {vat * 100}%
              </span>
            </p>
            <p>
              <strong>Tổng thanh toán:</strong>{" "}
              <span className="text-danger fw-bold">
                {formatPrice(serviceFee)}
              </span>
            </p>
          </div>
        </div>

        {!order.paymentStatus && (
          <div className="text-center mt-4">
            <button className="btn btn-primary btn-lg px-4" onClick={handleUpdatePaymentWithConfirm}>
              <i className="fas fa-wallet me-2"></i>Thanh toán bằng ví
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-1"></i> Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
