import React, { useEffect, useState } from "react";
import {
  getAddressUser,
  getDevice,
  getInfo,
  getOrders,
  patchOrderRate,
} from "../../services/Api";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";
import { getImage } from "../../shared/utils/getImage";
import { formatDateTime } from "../../shared/utils";
import { Link } from "react-router-dom";

// Hiển thị sao đánh giá
const Ratting = ({ rating }) => {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <i
          key={i}
          className={`fe ${
            i < rating ? "fe-star text-warning" : "fe-star text-muted"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewTable = () => {
  const [orders, setOrders] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getOrders({
      params: {
        status: "Completed",
      },
    })
      .then(async (res) => {
        const orders = res.data.data.items;

        const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
            const device = await getDevice(order.serviceDeviceId);
            const repairman = order.repairmanId
              ? await getInfo(order.repairmanId)
              : null;
            const customer = order.customerId
              ? await getInfo(order.customerId)
              : null;

            const address = order.addressId
              ? await getAddressUser(order.customerId, order.addressId)
              : null;

            return {
              ...order,
              deviceName: device?.data.data?.name || "Không rõ",
              repairmanName: repairman?.data.data?.fullName || "Chưa có thợ",
              repairmanAvatar: repairman?.data?.data?.avatar
                ? getImage(repairman.data.data.avatar)
                : "",
              customerName: address?.data.data?.fullName || "Không rõ",
              customerAvatar: customer?.data?.data?.avatar
                ? getImage(customer?.data.data.avatar)
                : "",
            };
          })
        );

        setOrders(enrichedOrders.filter((o) => o.ratingNumber !== null));
      })
      .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
  }, []);

  // Lọc và phân trang
  const filteredOrders = orders.filter((order) =>
    order.orderCode?.toLowerCase().includes(searchCode.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const handleDeleteRating = async (orderId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa đánh giá của đơn hàng này không?"
      )
    )
      return;

    try {
      await patchOrderRate(orderId, {
        ratingNumber: null,
        ratingDescription: null,
      });

      // Cập nhật lại danh sách đơn hàng nếu cần
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, ratingNumber: null, ratingDescription: null }
            : o
        )
      );
    } catch (err) {
      console.error("Lỗi khi xóa đánh giá:", err);
      alert("Không thể xóa đánh giá. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-100"
          placeholder="Tìm theo mã đơn hàng..."
          value={searchCode}
          onChange={(e) => {
            setSearchCode(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-center mb-0">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Thiết bị</th>
              <th>Thợ sửa chữa</th>
              <th>Khách hàng</th>
              <th>Đánh giá</th>
              <th>Ngày đánh giá</th>
              <th>Nội dung</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, idx) => (
              <tr key={idx}>
                <td>
                  {" "}
                  <Link
                    className="text-dark"
                    to={`/admin/order-detail/${order?.id}`}
                  >
                    {order?.orderCode}
                  </Link>
                </td>
                <td>{order?.deviceName}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={order?.repairmanAvatar}
                      width={30}
                      className="me-2 rounded-circle"
                      alt="KTV"
                    />
                    {order?.repairmanName}
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={order.customerAvatar}
                      width={30}
                      className="me-2 rounded-circle"
                      alt="Customer"
                    />
                    {order.customerName}
                  </div>
                </td>
                <td>
                  <Ratting rating={order.ratingNumber} />
                </td>
                <td>
                  {order.ratingDate
                    ? formatDateTime(order.ratingDate)
                    : "Không rõ"}
                </td>
                <td>{order?.ratingDescription ? order?.ratingDescription : "(Trống)" }</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteRating(order.id)}
                  >
                    <i className="fa fa-trash" /> Xóa
                  </button>
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
    </>
  );
};

export default ReviewTable;
