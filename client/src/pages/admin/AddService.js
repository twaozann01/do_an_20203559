import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  postServices,
  getServices,
  postServiceDevices,
  postDeviceDetails,
  getServiceDevices,
  getDeviceDetails,
} from "../../services/Api";
import CommonModal from "../../shared/components/CommonModal";

const AddService = () => {
  const [activeTab, setActiveTab] = useState("service");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    minPrice: "",
    selectedServiceId: "",
    selectedDeviceId: "",
  });
  const [services, setServices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [modalData, setModalData] = useState({
    show: false,
    type: "",
    title: "",
    payload: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data.data.items || []);
      } catch (err) {
        console.error("Lỗi tải ngành:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      if ((activeTab === "device" || activeTab === "detail") && formValues.selectedServiceId) {
        try {
          const res = await getServiceDevices(formValues.selectedServiceId);
          setDevices(res.data.data.items || []);
        } catch (err) {
          console.error("Lỗi tải thiết bị:", err);
        }
      }
    };
    fetchDevices();
  }, [activeTab, formValues.selectedServiceId]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (activeTab === "detail" && formValues.selectedServiceId && formValues.selectedDeviceId) {
        try {
          const res = await getDeviceDetails(
            formValues.selectedServiceId,
            formValues.selectedDeviceId
          );
          setDeviceDetails(res.data.data.items || []);
        } catch (err) {
          console.error("Lỗi tải chi tiết thiết bị:", err);
        }
      }
    };
    fetchDetails();
  }, [activeTab, formValues.selectedServiceId, formValues.selectedDeviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formValues.name.trim()) throw new Error("Tên không được để trống");

    const nameTrimmed = formValues.name.trim().toLowerCase();

    if (activeTab === "service") {
      const isDuplicate = services.some((s) => s.name.toLowerCase() === nameTrimmed);
      if (isDuplicate) throw new Error("Tên ngành đã tồn tại, vui lòng chọn tên khác");
    }

    if (activeTab === "device") {
      if (!formValues.selectedServiceId) throw new Error("Vui lòng chọn ngành dịch vụ");
      const isDuplicate = devices.some((d) => d.name.toLowerCase() === nameTrimmed);
      if (isDuplicate) throw new Error("Tên thiết bị đã tồn tại trong ngành này");
    }

    if (activeTab === "detail") {
      if (!formValues.selectedServiceId) throw new Error("Vui lòng chọn ngành dịch vụ");
      if (!formValues.selectedDeviceId) throw new Error("Vui lòng chọn thiết bị");
      const isDuplicate = deviceDetails.some((dt) => dt.name.toLowerCase() === nameTrimmed);
      if (isDuplicate) throw new Error("Tên chi tiết sửa chữa đã tồn tại trong thiết bị này");
      if (!formValues.minPrice || parseInt(formValues.minPrice) <= 0)
        throw new Error("Giá phải lớn hơn 0");
    }
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
      minPrice: "",
      selectedServiceId: "",
      selectedDeviceId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateForm();

      if (activeTab === "service") {
        await postServices({ name: formValues.name, description: formValues.description });
      } else if (activeTab === "device") {
        await postServiceDevices(formValues.selectedServiceId, {
          name: formValues.name,
          description: formValues.description,
        });
      } else if (activeTab === "detail") {
        await postDeviceDetails(formValues.selectedServiceId, formValues.selectedDeviceId, {
          name: formValues.name,
          description: formValues.description,
          minPrice: parseInt(formValues.minPrice),
        });
      }

      setModalData({
        show: true,
        type: "notify",
        title: "Thêm thành công",
        payload: {
          message: `Bạn đã thêm ${
            activeTab === "service"
              ? "ngành"
              : activeTab === "device"
              ? "thiết bị"
              : "chi tiết sửa chữa"
          } thành công.\nBạn có muốn thêm nữa không?`,
          showActions: true,
        },
      });

      resetForm();
    } catch (err) {
      console.error("Lỗi thêm:", err);
      setModalData({
        show: true,
        type: "notify",
        title: "Thêm thất bại",
        payload: {
          message: err.message || "Có lỗi xảy ra khi thêm.",
          showActions: false,
        },
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Thêm mới</h3>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "service" ? "active" : ""}`}
            onClick={() => setActiveTab("service")}
          >
            Ngành dịch vụ
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "device" ? "active" : ""}`}
            onClick={() => setActiveTab("device")}
          >
            Thiết bị
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "detail" ? "active" : ""}`}
            onClick={() => setActiveTab("detail")}
          >
            Chi tiết sửa chữa
          </button>
        </li>
      </ul>

      <form onSubmit={handleSubmit}>
        {(activeTab === "device" || activeTab === "detail") && (
          <div className="mb-3">
            <label className="form-label">Chọn ngành dịch vụ</label>
            <select
              className="form-select"
              name="selectedServiceId"
              value={formValues.selectedServiceId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn ngành --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "detail" && (
          <div className="mb-3">
            <label className="form-label">Chọn thiết bị</label>
            <select
              className="form-select"
              name="selectedDeviceId"
              value={formValues.selectedDeviceId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn thiết bị --</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">
            Tên {activeTab === "service" ? "ngành" : activeTab === "device" ? "thiết bị" : "chi tiết"}
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            required
            value={formValues.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            rows={3}
            value={formValues.description}
            onChange={handleChange}
          />
        </div>

        {activeTab === "detail" && (
          <div className="mb-3">
            <label className="form-label">Giá (VNĐ)</label>
            <input
              type="number"
              className="form-control"
              name="minPrice"
              value={formValues.minPrice}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" className="btn btn-success">
          Lưu {activeTab === "service" ? "ngành" : activeTab === "device" ? "thiết bị" : "chi tiết"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(-1)}
        >
          Huỷ
        </button>
      </form>

      <CommonModal
        show={modalData.show}
        type={modalData.type}
        title={modalData.title}
        payload={modalData.payload}
        onClose={() => {
          setModalData({ show: false, type: "", title: "", payload: null });
        }}
        onSubmit={() => {
          navigate("/admin/list-service");
        }}
      />
    </div>
  );
};

export default AddService;
