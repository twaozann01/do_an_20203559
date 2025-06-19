import React, { useEffect, useState } from "react";

const CommonModal = ({ show, onClose, onSubmit, type, title, payload }) => {
  const [inputValues, setInputValues] = useState({
    name: "",
    description: "",
    minPrice: "",
  });

  useEffect(() => {
    if (
      (type === "edit" ||
        type === "create-service" ||
        type === "create-device" ||
        type === "create-detail") &&
      payload
    ) {
      setInputValues({
        name: payload.name || "",
        description: payload.description || "",
        minPrice: payload.minPrice || "",
      });
    }
  }, [type, payload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  if (!show) return null;

  return (
    <div
      className="modal-backdrop-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="modal d-block"
        tabIndex="-1"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1051,
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {type === "delete" ? (
                <p>Bạn có chắc chắn muốn xoá mục này không?</p>
              ) : type === "notify" ? (
                <p className="text-center mb-0">{payload?.message}</p>
              ) : type === "confirm" ? (
                <p className="text-center mb-0">Bạn có chắc chắn muốn thực hiện hành động này không?</p>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={inputValues.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      value={inputValues.description}
                      onChange={handleChange}
                    />
                  </div>

                  {payload?.hasPrice && (
                    <div className="mb-3">
                      <label className="form-label">Giá (VNĐ)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="minPrice"
                        value={inputValues.minPrice}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              {type === "notify" && payload?.showActions ? (
                <>
                  <button className="btn btn-secondary" onClick={onClose}>
                    Ở lại
                  </button>
                  <button className="btn btn-primary" onClick={onSubmit}>
                    Chuyển tiếp
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={onClose}>
                    {type === "notify" ? "Đóng" : "Huỷ"}
                  </button>
                  {type !== "notify" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => onSubmit(inputValues)}
                    >
                      Đồng ý
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
