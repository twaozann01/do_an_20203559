/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  getAddressUser,
  getDevice,
  getInfo,
  getOrders,
} from "../../../services/Api";
import { getImage } from "../../../shared/utils/getImage";
import { timeAgo } from "../../../shared/utils";
import { ITEMS_PER_PAGE } from "../../../shared/constants/app";

const RattingCustomer = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.id;
  const [order, setOrder] = useState();
  const [searchCode, setSearchCode] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getOrders({
      params: {
        repairmanId: id,
        status: "Completed",
      },
    })
      .then(async (res) => {
        const orders = res.data.items;
        console.log(orders);

        const orderWithRating = orders.filter(
          (order) => order.ratingNumber !== null
        );
        console.log(orderWithRating);

        const orderWithDevice = await Promise.all(
          orderWithRating.map(async (order) => {
            try {
              const device = await getDevice(order.serviceDeviceId);
              const customer = await getInfo(order.customerId);
              const address = await getAddressUser(
                order.customerId,
                order.addressId
              );

              return {
                ...order,
                deviceName: device?.data?.name,
                customerName: address?.data?.fullName,
                customerAvatar: customer?.data?.avatar,
              };
            } catch (err) {
              console.error("❌ Lỗi khi xử lý đơn:", err);
              return null;
            }
          })
        );
        setOrder(orderWithDevice);
        console.log("Đơn đánh giá", orderWithDevice);
      })
      .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
  }, [id]);
  const filteredOrders = (order ?? []).filter((o) =>
    o?.orderCode?.toLowerCase().includes(searchCode.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  if (!id || !userInfo || loading) return <div>Đang tải thông tin......</div>;
  return (
    <div>
      <div className="tab-pane fade show active">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search" />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mã đơn hàng..."
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {/* Review Listing */}
        <div className="widget review-listing">
          <ul className="comments-list">
            {paginatedOrders?.length > 0 ? (
              paginatedOrders.map((item, index) => (
                <li key={index}>
                  <div className="comment w-100 position-relative p-2  mb-2">
                    {/* Avatar */}
                    <img
                      className="avatar avatar-sm rounded-circle me-1 float-start"
                      alt="User Image"
                      src={getImage(item.customerAvatar)}
                    />

                    {/* Sao đánh giá ở góc phải trên */}
                    <div className="position-absolute top-0 end-0 p-2">
                      <div className="review-count rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fas fa-star ${
                              star <= item.ratingNumber ? "filled" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="comment-date text-muted small d-block mb-2">
                        {!item.ratingUpdatedDate
                          ? timeAgo(item.ratingDate)
                          : timeAgo(item.ratingUpdatedDate)}
                      </span>
                    </div>

                    {/* Nội dung đánh giá */}
                    <div className="ms-3">
                      <p className="mb-2 text-dark">
                        <strong>Mã đơn hàng:</strong> {item?.orderCode}
                      </p>
                      <span className="text-dark mb-2">
                        Khách hàng: <strong>{item.customerName}</strong>
                      </span>
                      <span className="comment-author fw-semibold d-block"></span>

                      <p className="recommended mb-3 mt-2">
                        <i className="fas fa-tools text-dark"></i>{" "}
                        <span className="text-dark">Thiết bị:</span>{" "}
                        {item.deviceName}
                      </p>
                      <p className="comment-content mb-0"> 
                        {!item.ratingDescription
                          ? "(Không có nội dung đánh giá)"
                          : (<>
                          Nội dung: {" "}{item.ratingDescription}
                          </>)}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-muted">Chưa có đánh giá nào.</li>
            )}
          </ul>
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Trang {currentPage} / {totalPages}
              </div>
              <div>
                <button
                  className="btn btn-outline-secondary me-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ← Trước
                </button>
                <button
                  className="btn btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
        {/* /Review Listing */}
      </div>
    </div>
  );
};

export default RattingCustomer;
