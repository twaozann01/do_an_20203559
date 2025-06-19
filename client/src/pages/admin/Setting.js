import React, { useState } from "react";
import { postVAT } from "../../services/Api";

const Setting = () => {
  const [vat, setVat] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const vatValue = parseFloat(vat);

    if (isNaN(vatValue) || vatValue <= 0 || vatValue > 1) {
      setError("❌ VAT phải là số trong khoảng 0.01 đến 1.00 (ví dụ: 0.12)");
      return;
    }

    try {
      const res = await postVAT(vatValue);
      setMessage(`✅ ${res.data.message} (Giá trị mới: ${res.data.value})`);
      setVat("");
    } catch (err) {
      const errorMsg =
        err.response?.data || "❌ Lỗi không xác định khi cập nhật VAT.";
      setError(errorMsg);
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="row">
        <div className="col-12">
          {/* General */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Chung</h4>
            </div>
            <div className="card-body">
              <form action="#">
                <div className="mb-3">
                  <label className="mb-2">Tên Website</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="mb-2">Logo Website</label>
                  <input type="file" className="form-control" />
                  <small className="text-secondary">
                    Chọn ảnh có kích thước <b>150px x 150px</b>
                  </small>
                </div>
                <div className="mb-0">
                  <label className="mb-2">Biểu tượng</label>
                  <input type="file" className="form-control" />
                  <small className="text-secondary">
                    Chọn ảnh có kích thước <b>16px x 16px</b> hoặc{" "}
                    <b>32px x 32px</b>
                  </small>
                  <br />
                  <small className="text-secondary">
                    Chỉ chọn ảnh có định dạng .png hoặc .ico
                  </small>
                </div>
              </form>
            </div>
          </div>
          {/* /General */}
        </div>
        <div className="col-12">
          <div className="card shadow-sm mt-4">
      <div className="card-header ">
        <h5 className="mb-0">
          <i className="fas fa-percentage me-2"></i> Cập nhật phí dịch vụ
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vat" className="form-label">
              Nhập biểu phí (0.01 → 1.00):
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1"
              className="form-control"
              id="vat"
              placeholder="Ví dụ: 0.12"
              value={vat}
              onChange={(e) => setVat(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            <i className="fas fa-save me-1"></i> Lưu phí dịch vụ
          </button>
        </form>

        {message && (
          <div className="alert alert-success mt-3">
            <i className="fas fa-check-circle me-2"></i> {message}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mt-3">
            <i className="fas fa-exclamation-circle me-2"></i> {error}
          </div>
        )}
      </div>
    </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  );
};

export default Setting;
