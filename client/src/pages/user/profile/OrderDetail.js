/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useRef } from "react";
import { logo, user } from "../../../assets/img/banner";
import { Link, useParams } from "react-router-dom";
import {
  getAddressUser,
  getDevice,
  getInfo,
  getOrder,
  patchOrderCannel,
  patchOrderCompleted,
  patchOrderStart,
  getVATCurrent,
} from "../../../services/Api";
import {
  formatDateTime,
  formatPhoneNumber,
  formatPrice,
} from "../../../shared/utils";
import { AuthContext } from "../../../contexts/AuthContext";
import { getImage } from "../../../shared/utils/getImage";
import { Modal } from "bootstrap";
const OrderDetail = () => {
  const { userInfo } = useContext(AuthContext);
  const { id } = useParams();
  const [vat, setVat] = useState(null);

  const [order, setOrder] = useState(null);

  const [mediaUrl, setMediaUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    getVATCurrent()
      .then((res) => {
        // console.log("Đây là phí dịch vụ", res.data.data);
        setVat(res.data.value);
        // console.log(vat);
      })
      .catch((error) => console.log("Lỗi khi lấy phí dịch vụ: ", error));
  }, []);

  const handleOpenModal = (url, isVideoFile) => {
    setMediaUrl(url);
    setIsVideo(isVideoFile);

    const modalEl = document.getElementById("mediaModal");

    if (!modalRef.current) {
      modalRef.current = new Modal(modalEl);
    }

    modalRef.current.show();
  };

  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.hide();
    }
  };

  const fetchData = async () => {
    try {
      const res = await getOrder(id);
      const orderInfo = res.data.data;

      if (orderInfo.customerId) {
        const customerRes = await getInfo(orderInfo.customerId);
        orderInfo.customer = customerRes.data.data;
      }

      if (orderInfo.repairmanId) {
        const repairmanRes = await getInfo(orderInfo.repairmanId);
        orderInfo.repairman = repairmanRes.data.data;
      }

      if (orderInfo.addressId) {
        const addressRes = await getAddressUser(
          orderInfo.customerId,
          orderInfo.addressId
        );
        orderInfo.address = addressRes.data.data;
      }

      if (orderInfo.serviceDeviceId) {
        const device = await getDevice(orderInfo.serviceDeviceId);
        orderInfo.device = device.data.data;
      }

      setOrder(orderInfo);
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng", error);
    }
  };

  useEffect(() => {
    if (!id || !userInfo) return;
    fetchData();
    return () => {
      if (modalRef.current) {
        modalRef.current.dispose();
        modalRef.current = null;
      }
    };
  }, [id]);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (!confirmCancel) return;

    try {
      await patchOrderCannel(id);
      alert("✅ Đơn hàng đã bị hủy.");
      await fetchData();
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn:", error);
      alert("❌ Hủy đơn thất bại.");
    }
  };

  const handleCompleteOrder = async () => {
    const confirmComplete = window.confirm("Xác nhận hoàn thành đơn hàng?");
    if (!confirmComplete) return;

    try {
      await patchOrderCompleted(id);
      alert("✅ Đơn hàng đã được hoàn thành.");
      await fetchData();
    } catch (error) {
      console.error("❌ Lỗi khi hoàn thành đơn:", error);
      alert("❌ Hoàn thành đơn thất bại.");
    }
  };

  const handleStartRepair = async () => {
    const confirmStart = window.confirm("Xác nhận bắt đầu sửa chữa?");
    if (!confirmStart) return;

    try {
      await patchOrderStart(order.id);
      alert("✅ Đã cập nhật thời gian bắt đầu sửa chữa.");
      await fetchData(); // hoặc fetch lại đơn hàng
    } catch (error) {
      console.error("❌ Lỗi:", error);
      alert("❌ Không thể cập nhật.");
    }
  };

  if (!id || !user) return <div>Đang tải thông tin....</div>;
  return (
    <div>
      <div className="invoice-content shadow p-4 rounded bg-white">
        {/* Header */}
        <div className="invoice-item mb-4 border-bottom">
          <div className="row align-items-center ">
            <div className="col-md-12 border-bottom">
              <img src={logo} alt="logo" style={{ maxHeight: 60 }} />
            </div>
            <div className="col-md-6 mt-3">
              <p className="mb-1 ">
                <strong className="text-muted ">Mã đơn:</strong>{" "}
                {order?.orderCode}
              </p>
              <p className="mb-0">
                <strong className="text-muted">Thiết bị:</strong>{" "}
                {order?.device?.name}
              </p>
            </div>
          </div>
        </div>
        {/* Customer Info */}
        <div className="invoice-item mb-4 text-dark">
          <div className="row">
            <div className="col-md-6 border-end">
              <h5 className="mb-3 border-bottom pb-2">Thông tin đơn hàng</h5>
              <strong className="me-2">Khách hàng:</strong>
              <a href="#" className="text-decoration-underline">
                {" "}
                {order?.address?.fullName}
              </a>
              <p className="text-muted mb-0">
                <strong className="me-2">Số điện thoại:</strong>{" "}
                {formatPhoneNumber(order?.address?.phone)}
                <br />
                <strong className="me-2">Địa chỉ:</strong>{" "}
                {order?.address?.street}, {order?.address?.ward},{" "}
                {order?.address?.district}, {order?.address?.city}
              </p>
              <div className="mt-3"></div>
              {order?.status !== "Pending" && (
                <div className="mt-3">
                  <strong className="me-2">Kỹ thuật viên:</strong>
                  <a href="#" className="text-decoration-underline">
                    {order?.repairman?.fullName || "Chưa có thông tin"}
                  </a>
                  <p className="text-muted mb-2">
                    <strong className="me-2">Số điện thoại:</strong>{" "}
                    {formatPhoneNumber(order?.repairman?.phone) ||
                      "Chưa có thông tin"}
                  </p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <h5 className="mb-3 border-bottom pb-2">Trạng thái đơn hàng</h5>
              {/* Timeline */}
              <div className="timeline">
                {(order?.status === "Pending" || order?.createdAt) && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-check fa-xs" />
                    </div>
                    <div>
                      <small className="text-muted">
                        {formatDateTime(order?.createdAt) || "--:-- --:--:--"}
                      </small>
                      <p className="mb-1 fw-bold">Đặt lịch thành công</p>
                      <p className="text-muted small mb-0">
                        Đơn hàng đã được tiếp nhận
                      </p>
                    </div>
                  </div>
                )}
                {order?.status === "Canceled" && order?.canceledAt && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                    <div>
                      <small className="text-danger">
                        {formatDateTime(order?.canceledAt)}
                      </small>
                      <p className="mb-1 fw-bold text-danger">
                        Đơn hàng đã bị hủy
                      </p>
                    </div>
                  </div>
                )}
                {order?.status === "Pending" && !order?.foundRepairmanAt && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-spinner fa-pulse fa-xs" />
                    </div>
                    <div>
                      <small className="text-muted"> --:-- --:--:--</small>
                      <p className="mb-1 fw-bold">Đang tìm thợ</p>
                      <p className="text-muted small mb-0">
                        Đang tìm thợ phù hợp với đơn hàng
                      </p>
                    </div>
                  </div>
                )}
                {(order?.status === "InProgress" ||
                  order?.foundRepairmanAt) && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-check fa-xs" />
                    </div>
                    <div>
                      <small className="text-muted">
                        {formatDateTime(order?.foundRepairmanAt)}
                      </small>
                      <p className="mb-1 fw-bold">Tìm thợ thành công</p>
                      <p className="text-muted small mb-0">
                        Thợ {order?.repairman?.fullName} (
                        {order?.repairman?.average || 0} ★) đã nhận đơn
                      </p>
                    </div>
                  </div>
                )}
                {order?.status === "InProgress" && !order?.inProgressAt && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-spinner fa-pulse fa-xs" />
                    </div>
                    <div>
                      <p className="mb-1 fw-bold text-primary">
                        Lịch hẹn: {formatDateTime(order?.repairDate)}
                      </p>
                      <small className="text-muted">Đang chờ sửa chữa</small>
                    </div>
                  </div>
                )}
                {order?.status === "InProgress" && order?.inProgressAt && (
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-spinner fa-pulse fa-xs" />
                    </div>
                    <div>
                      <small className="text-muted">
                        {formatDateTime(order?.inProgressAt)}
                      </small>
                      <p className="mb-1 fw-bold">Đang tiến hành sửa chữa</p>
                    </div>
                  </div>
                )}
                {(order?.status === "Completed" || order?.completedAt) && (
                  <div className="d-flex align-items-start">
                    <div
                      className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="fas fa-check fa-xs" />
                    </div>
                    <div>
                      <small className="text-muted">
                        {formatDateTime(order?.completedAt)}
                      </small>
                      <p className="mb-1 fw-bold">Sửa chữa hoàn tất</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Service Table */}
        <div className="invoice-item">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th className="text-center">STT</th>
                  <th className="text-start">Chi tiết dịch vụ</th>

                  <th className="text-end">Giá trị tối thiểu</th>
                </tr>
              </thead>
              <tbody>
                {order?.orderDetails?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.deviceDetail?.name}</td>
                    <td className="text-end">
                      {formatPrice(item.deviceDetail?.minPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-responsive w-100 pe-2">
            <table className="w-100">
              <tbody>
                <tr>
                  <td className="text-end">
                    <p>
                      <strong>Tổng tiền:</strong>
                    </p>
                  </td>
                  <td className="text-end">
                    <p>{formatPrice(order?.total)}</p>
                  </td>
                </tr>
                {userInfo?.data.id === order?.repairman?.id && (
                  <tr>
                    <td className="text-end">
                      <p>
                        <strong>Cần thanh toán:</strong>
                      </p>
                    </td>
                    <td className="text-end">
                      <p>{formatPrice(order?.total * vat)}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mô tả dịch vụ */}
        <div className="mt-5">
          <h5 className="mb-3">
            <i className="bi bi-images me-2" /> Mô tả dịch vụ
          </h5>
          <div className="row">
            {/* Cột trái: Ảnh & Video minh họa */}
            <div className="col-md-6 mb-4">
              <div className="row g-3">
                <div className="row g-3">
                  {order?.orderDetails?.map((item, index) => (
                    <div key={index} className="col-6">
                      {/* Ảnh */}
                      {item.image && (
                        <div className="ratio ratio-16x9">
                          <img
                            src={getImage(item.image)}
                            alt={`Hình ảnh ${index + 1}`}
                            className="w-100 rounded shadow-sm object-fit-cover"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleOpenModal(getImage(item.image), false)
                            }
                          />
                        </div>
                      )}

                      {/* Video */}
                      {item.video && (
                        <div className="ratio ratio-16x9 mt-2">
                          <video
                            src={getImage(item.video)}
                            controls
                            className="w-100 rounded shadow-sm object-fit-cover"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleOpenModal(getImage(item.video), true)
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin chi tiết */}
            <div className="col-md-6">
              <h6 className="text-uppercase text-muted mb-3">
                Thông tin chi tiết
              </h6>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <span className="badge bg-primary me-2">1</span> Bảo hành
                  <br />
                  <small className="text-muted">
                    Bảo hành 1 tháng phát sinh lại lỗi cũ.
                  </small>
                </li>
                {order?.orderDetails?.map((item, index) => (
                  <li className="mb-3">
                    <span className="badge bg-primary me-2">{index + 2}</span>{" "}
                    {item.deviceDetail.name}
                    <br />
                    <small className="text-muted">
                      {item.deviceDetail.description}
                    </small>
                  </li>
                ))}
              </ul>
              {order?.customerNote && (
                <div className="alert alert-warning border mt-4">
                  <strong>
                    <i className="bi bi-exclamation-circle me-2" />
                    Lưu ý quan trọng
                  </strong>
                  <p className="small mb-0">
                    - Giá trên đơn hàng chỉ là giá trị tối thiểu cho dịch vụ đó,
                    chi phí thực sự sẽ được thợ sửa chữa báo với khách hàng sau
                    khi kiểm tra thiết bị.
                    <br />- Ghi chú từ khác hàng: {order?.customerNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="card-footer bg-light mt-4 py-3 px-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-2 mb-md-0">
              <p className="mb-1 small text-muted">
                <i className="fas fa-info-circle me-1" /> Vui lòng kiểm tra kỹ
                thông tin
              </p>
              <p className="mb-1 small text-muted">
                Cảm ơn bạn đã sử dụng dịch vụ
              </p>
            </div>
            <div>
              {order?.customer?.id === userInfo?.data.id && (
                <>
                  {order?.status === "Pending" && (
                    <button
                      className="btn btn-outline-danger btn-sm me-2"
                      onClick={handleCancelOrder}
                    >
                      <i className="fas fa-times me-1"></i> Hủy đơn
                    </button>
                  )}

                  {order?.status === "InProgress" && (
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleCompleteOrder}
                    >
                      <i className="fas fa-check me-1"></i> Hoàn thành
                    </button>
                  )}
                </>
              )}
              {order?.repairman?.id === userInfo?.data.id && (
                <>
                  {order?.status === "InProgress" && !order?.inProgressAt && (
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleStartRepair}
                    >
                      <i className="fas fa-tools me-1" /> Bắt đầu sửa chữa
                    </button>
                  )}
                  {order?.status === "InProgress" && order?.inProgressAt && (
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={handleCompleteOrder}
                    >
                      <i className="fas fa-check me-1" /> Hoàn thành
                    </button>
                  )}
                </>
              )}
              <Link to="/user/chat" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-whatsapp me-1" /> Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="mediaModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content bg-dark position-relative">
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={handleCloseModal}
              aria-label="Close"
            />
            <div className="modal-body p-0 text-center">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  className="d-inline-block"
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="preview"
                  className="d-inline-block"
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
