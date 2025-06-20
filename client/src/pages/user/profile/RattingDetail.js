/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDevice,
  getInfo,
  getOrder,
  patchOrderRate,
} from "../../../services/Api";
import { formatDateTime } from "../../../shared/utils";

const RattingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      getOrder(id)
        .then(async (res) => {
          const order = res.data.data;

          const device = await getDevice(order.serviceDeviceId);
          let repairmanName = "Chưa có thợ";

          if (order.repairmanId) {
            const repairman = await getInfo(order.repairmanId);
            repairmanName = repairman.data.data.fullName;
          }

          const enrichedOrder = {
            ...order,
            deviceName: device.data.data.name,
            repairmanName,
          };

          setOrder(enrichedOrder);
          setRating(order.ratingNumber || 0);
          setDescription(order.ratingDescription || "");
        })
        .catch((error) => console.log("Lỗi khi tải đơn hàng!", error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patchOrderRate(order.id, {
        ratingNumber: rating,
        ratingDescription: description,
      });
      alert("Đánh giá thành công!");
      navigate("/user/ratting");
    } catch (error) {
      alert(
        "Đánh giá thất bại: " + (error.response?.data || "Lỗi không xác định")
      );
    }
  };

  const isRattingDeletedByAdmin =
    order?.ratingDate && !order?.ratingNumber && !order?.ratingDescription;

  if (!order) return <div>Đang tải chi tiết đơn hàng...</div>;

  return (
    <div className="container">
      <div className="card ratting-detail">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="review-card">
              <div className="card-header">
                <strong className="fs-5">Đánh giá đơn hàng</strong>
              </div>
              <div className="card-body">
                <div className="write-review">
                  <div className="row">
                    <div className="col-md-6 py-2">
                      <p>
                        <i className="fas fa-user me-2" /> Kỹ thuật viên:{" "}
                        <strong className="ms-2">{order?.repairmanName}</strong>
                      </p>
                    </div>
                    <div className="col-md-6 py-2">
                      <p>
                        <i className="fas fa-tools me-2" /> Thiết bị:{" "}
                        <strong className="ms-2">{order?.deviceName}</strong>
                      </p>
                    </div>
                    <div className="col-md-6 py-2">
                      <p>
                        <i className="fas fa-calendar-check me-2" /> Ngày hoàn
                        thành:{" "}
                        <strong className="ms-2">
                          {formatDateTime(order?.completedAt)}
                        </strong>
                      </p>
                    </div>
                    {!order.ratingDate && (
                      <div className="col-md-6 py-2">
                        <p>
                          <i className="fas fa-hourglass-half me-2" /> Hạn đánh
                          giá:{" "}
                          <strong className="text-warning ms-2">
                            {order?.completedAt &&
                              formatDateTime(
                                new Date(order.completedAt).setDate(
                                  new Date(order.completedAt).getDate() + 15
                                )
                              )}
                          </strong>
                        </p>
                      </div>
                    )}
                    {order.ratingDate && !order.ratingUpdatedDate && (
                      <>
                        <div className="col-md-6 py-2">
                          <p>
                            <i className="fas fa-check-circle me-2" /> Ngày đánh
                            giá:{" "}
                            <strong className=" ms-2">
                              {formatDateTime(order?.ratingDate)}
                            </strong>
                          </p>
                        </div>
                        <div className="col-md-6 py-1">
                          <p>
                            <i className="fas fa-hourglass-end"></i> Hạn sửa
                            đánh giá:{" "}
                            <strong className="text-warning ms-2">
                              {order?.ratingDate &&
                                formatDateTime(
                                  new Date(order?.ratingDate).setDate(
                                    new Date(order?.ratingDate).getDate() + 30
                                  )
                                )}
                            </strong>
                          </p>
                        </div>
                      </>
                    )}
                    {order.ratingUpdatedDate && (
                      <div className="col-md-6 py-2">
                        <p>
                          <i className="fas fa-sync-alt me-2" /> Ngày sửa đánh
                          giá:{" "}
                          <strong className="ms-2">
                            {formatDateTime(order.ratingUpdatedDate)}
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>
                  {isRattingDeletedByAdmin ? (
                    <div className="alert alert-warning mt-2">
                      <i className="fas fa-exclamation-circle me-2" />
                      Đánh giá của bạn đã bị xoá bởi quản trị viên.
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3 text-start">
                        <label className="mb-2 py-2">Đánh giá</label>
                        <div className="star-rating">
                          {[5, 4, 3, 2, 1].map((num) => (
                            <React.Fragment key={num}>
                              <input
                                id={`star-${num}`}
                                type="radio"
                                name="rating"
                                value={num}
                                checked={rating === num}
                                onChange={() => setRating(num)}
                              />
                              <label
                                htmlFor={`star-${num}`}
                                title={`${num} sao`}
                              >
                                <i className="active fa fa-star" />
                              </label>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="mb-2">Nội dung đánh giá</label>
                        <textarea
                          id="review_desc"
                          maxLength={100}
                          className="form-control"
                          placeholder="Nhập nội dung đánh giá"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      {!order.ratingUpdatedDate && (
                        <div className="submit-section">
                          <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                          >
                            Gửi đánh giá
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary submit-btn"
                            onClick={() => navigate("/user/ratting")}
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                      {order.ratingUpdatedDate && (
                        <div className="submit-section">
                          <button
                            type="button"
                            className="btn btn-secondary submit-btn"
                            onClick={() => navigate("/user/ratting")}
                          >
                            Quay về
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RattingDetail;
