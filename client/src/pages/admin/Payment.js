import React, { useEffect, useState } from "react";
import {
  getDevice,
  getInfo,
  getOrders,
  getVATCurrent,
} from "../../services/Api";
import { formatDateTime, formatPrice } from "../../shared/utils";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";

const Payment = () => {
  const [orders, setOrders] = useState([]);
  const [vat, setVat] = useState(0); // sửa từ "" -> 0
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, vatRes] = await Promise.all([
          getOrders({ params: { status: "Completed" } }),
          getVATCurrent(),
        ]);

        const vatValue = vatRes?.data || 0;
        setVat(vatValue);

        const orderInfo = await Promise.all(
          orderRes.data.items.map(async (item) => {
            const [repairmanRes, deviceRes] = await Promise.all([
              getInfo(item.repairmanId),
              getDevice(item.serviceDeviceId),
            ]);

            return {
              ...item,
              repairmanName: repairmanRes?.data?.fullName,
              deviceName: deviceRes?.data?.name,
              paid: item.paymentStatus === true,
            };
          })
        );

        setOrders(orderInfo);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng hoặc VAT:", error);
      }
    };

    fetchData();
  }, []);

  // Lọc và phân trang
  const getFilteredOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (activeTab) {
      case "unpaid":
        filtered = filtered.filter((o) => !o.paid);
        break;
      case "paid":
        filtered = filtered.filter((o) => o.paid);
        break;
      default:
        break;
    }

    return filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  };

  const totalFilteredOrders = orders.filter((order) =>
    order.orderCode?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((order) =>
    activeTab === "unpaid" ? !order.paid :
    activeTab === "paid" ? order.paid : true
  );

  const totalPages = Math.ceil(totalFilteredOrders.length / ITEMS_PER_PAGE);

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

  return (
    <div className="card">
      <div className="card-body pt-0">
        <nav className="user-tabs mb-4">
          <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
            {["all", "unpaid", "paid"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                >
                  {tab === "all"
                    ? "Tất cả"
                    : tab === "unpaid"
                    ? `Chưa thanh toán (${orders.filter(o => !o.paid).length})`
                    : "Đã thanh toán"}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-3">
          <input
            type="text"
            className="form-control w-100"
            placeholder="Tìm theo mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="card card-table mb-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên KTV</th>
                    <th>Dịch vụ</th>
                    <th>Số tiền</th>
                    <th>Hạn thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders().map((pay, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td>{pay?.orderCode}</td>
                      <td>{pay?.repairmanName}</td>
                      <td>{pay?.deviceName}</td>
                      <td>{formatPrice(pay?.total *  vat)}</td>
                      <td className="text-danger">
                        {formatDateTime(pay?.paymentTerm)}
                      </td>
                      <td>{renderStatusButton(pay?.paid)}</td>
                      <td>
                        {!pay.paid && (
                          <button className="btn btn-sm btn-outline-danger border">
                            Nhắc nhở
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
