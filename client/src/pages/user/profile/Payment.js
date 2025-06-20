/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  getDevice,
  getInfo,
  getOrders,
  getVATCurrent,
} from "../../../services/Api";
import { formatDateTime, formatPrice } from "../../../shared/utils";
import { Link, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.data.id;
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [vat, setVat] = useState(null);

  useEffect(() => {
    if (!id) return;

    getOrders({
      params: {
        status: "Completed",
        repairmanId: id,
      },
    })
      .then(async (res) => {
        const orders = res.data.data.items;
        const orderInfo = await Promise.all(
          orders.map(async (item) => {
            const customer = await getInfo(item.customerId);
            const repairman = await getInfo(item.repairmanId);
            const device = await getDevice(item.serviceDeviceId);
            return {
              ...item,
              customerName: customer?.data?.data?.fullName,
              repairmanName: repairman?.data?.data?.fullName,
              deviceName: device?.data?.data?.name,
              paid: item.paymentStatus === true,
            };
          })
        );
        setOrders(orderInfo);
        console.log("Đơn hàng", orderInfo);
      })
      .catch((error) => console.log("Lỗi không tải được đơn hàng.", error));
  }, [id]);
  useEffect(() => {
    getVATCurrent()
      .then((res) => {
        // console.log("Đây là phí dịch vụ", res.data.value);
        setVat(res.data.value);
      })
      .catch((error) => console.log("Lỗi khi lấy phí dịch vụ: ", error));
  }, []);

  const unpaidOrders = orders.filter((order) => !order.paid);
  const paidOrders = orders.filter((order) => order.paid);

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "unpaid":
        return unpaidOrders;
      case "paid":
        return paidOrders;
      default:
        return orders;
    }
  };

  const renderStatusButton = (paid) =>
    paid ? (
      <span className="btn btn-sm bg-success-light">
        <i className="fas fa-check" /> Đã thanh toán
      </span>
    ) : (
      <span className="btn btn-sm bg-warning-light">
        <i className="fas fa-clock" /> Chưa thanh toán
      </span>
    );

  if (!id || !userInfo || loading) return <div>Đang tải thông tin...</div>;

  return (
    <div className="card">
      <div className="card-body pt-0">
        {/* Tabs */}
        <nav className="user-tabs mb-4">
          <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "unpaid" ? "active" : ""}`}
                onClick={() => setActiveTab("unpaid")}
              >
                Chưa thanh toán{" "}
                <span className="text-warning">({unpaidOrders.length})</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "paid" ? "active" : ""}`}
                onClick={() => setActiveTab("paid")}
              >
                Đã thanh toán
              </button>
            </li>
          </ul>
        </nav>

        {/* Table */}
        <div className="card card-table mb-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover table-center mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã đơn</th>
                    <th>Ngày hoàn thành</th>
                    <th>Hạn thanh toán</th>
                    <th>Thiết bị</th>
                    <th>Chi phí</th>
                    <th>Trạng thái</th>
                    <th>Tương tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders().map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to={`/user/order-detail/${order.id}`}>
                          {order.orderCode}
                        </Link>
                      </td>
                      <td>{formatDateTime(order.completedAt)}</td>
                      <td className={order.paid ? "" : "text-danger"}>
                        {formatDateTime(order.paymentTerm)}
                      </td>
                      <td>{order.deviceName}</td>
                      <td>{formatPrice(order.total * vat)}</td>
                      <td>{renderStatusButton(order.paid)}</td>
                      <td>
                        <div className="table-action">
                          <button
                            className="btn btn-sm bg-info-light"
                            onClick={() =>
                              navigate(`/user/payment-detail/${order.id}`)
                            }
                          >
                            <i className="far fa-eye" /> Xem
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {getFilteredOrders().length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* /Table */}
      </div>
    </div>
  );
};

export default Payment;
