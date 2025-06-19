/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getDeviceDetails,
  getServiceDevices,
  getServices,
  deleteService,
  putService,
  deleteServiceDevice,
  putServiceDevice,
  putDeviceDetail,
  deleteDeviceDetail,
} from "../../services/Api";
import { Form, Link } from "react-router-dom";
import CommonModal from "../../shared/components/CommonModal";
import { ITEMS_PER_PAGE } from "../../shared/constants/app";
import { formatPrice } from "../../shared/utils";

const ListService = () => {
  const [servicesWithDevices, setServicesWithDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const servicesRes = await getServices();
        const services = servicesRes.data.items;

        const servicePromises = services.map(async (service) => {
          const devicesRes = await getServiceDevices(service.id);
          const devices = devicesRes.data.items;

          const devicePromises = devices.map(async (device) => {
            const detailsRes = await getDeviceDetails(service.id, device.id);
            return {
              ...device,
              details: detailsRes.data.items || [],
            };
          });

          const devicesWithDetails = await Promise.all(devicePromises);

          return {
            ...service,
            devices: devicesWithDetails,
          };
        });

        const fullTree = await Promise.all(servicePromises);
        setServicesWithDevices(fullTree);
      } catch (error) {
        console.log("Lỗi khi tải danh sách: ", error);
      }
    };
    fetchAll();
  }, []);

  const [modalData, setModalData] = useState({
    show: false,
    type: "",
    title: "",
    payload: null,
  });

  const handleDeleteService = (serviceId) => {
    setModalData({
      show: true,
      type: "delete",
      title: "Xác nhận xoá ngành",
      payload: {
        serviceId,
      },
    });
  };

  const handleEditService = (service) => {
    setModalData({
      show: true,
      type: "edit",
      title: "Chỉnh sửa ngành",
      payload: {
        serviceId: service.id,
        name: service.name,
        description: service.description || "",
      },
    });
  };

  const handleDeleteDevice = (serviceId, deviceId) => {
    setModalData({
      show: true,
      type: "delete",
      title: "Xác nhận xoá thiết bị",
      payload: {
        serviceId,
        deviceId,
      },
    });
  };

  const handleEditDevice = (serviceId, device) => {
    setModalData({
      show: true,
      type: "edit",
      title: "Chỉnh sửa thiết bị",
      payload: {
        serviceId,
        deviceId: device.id,
        name: device.name,
        description: device.description || "",
      },
    });
  };

  const handleEditDetail = (serviceId, deviceId, detail) => {
    setModalData({
      show: true,
      type: "edit",
      title: "Chỉnh sửa chi tiết sửa chữa",
      payload: {
        serviceId,
        deviceId,
        detailId: detail.id,
        name: detail.name,
        minPrice: detail.minPrice,
        description: detail.description || "",
        hasPrice: true,
      },
    });
  };

  const handleDeleteDetail = (serviceId, deviceId, detailId) => {
    setModalData({
      show: true,
      type: "delete",
      title: "Xác nhận xoá chi tiết",
      payload: { serviceId, deviceId, detailId },
    });
  };

  const flattenedDevices = servicesWithDevices.flatMap((service) =>
    (service.devices || []).map((device) => ({
      ...device,
      serviceId: service.id,
      serviceName: service.name,
      serviceDescription: service.description,
    }))
  );

  const totalPages = Math.ceil(flattenedDevices.length / ITEMS_PER_PAGE);

  const paginatedDevices = flattenedDevices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
        <h4 className="card-title mb-0">Danh sách dịch vụ</h4>
        <select
          className="form-select w-auto"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Tất cả ngành</option>
          {servicesWithDevices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Link to="/admin/add-service" className="btn btn-primary text-white">
          <i className="fas fa-plus me-1"></i> Thêm dịch vụ
        </Link>
      </div>

      <div className="card-body table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ngành</th>
              <th>Thiết bị</th>
              <th>Chi tiết sửa chữa</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDevices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedDevices.map((device, index) => {
                const stt = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                return (
                  <tr key={device.id} className="align-middle">
                    <td>{stt}</td>
                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{device.serviceName}</span>
                        <div className="ms-2">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() =>
                              handleEditService({
                                id: device.serviceId,
                                name: device.serviceName,
                                description: device.serviceDescription,
                              })
                            }
                            title="Sửa ngành"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDeleteService(device.serviceId)
                            }
                            title="Xoá ngành"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{device.name}</span>
                        <div className="ms-2">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() =>
                              handleEditDevice(device.serviceId, device)
                            }
                            title="Sửa thiết bị"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDeleteDevice(device.serviceId, device.id)
                            }
                            title="Xoá thiết bị"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      {device.details?.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {device.details.map((detail, i) => (
                            <li
                              key={i}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <span>
                                {detail.name} - {formatPrice(detail.minPrice)}
                              </span>
                              <div>
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  title="Sửa chi tiết"
                                  onClick={() =>
                                    handleEditDetail(
                                      device.serviceId,
                                      device.id,
                                      detail
                                    )
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Xoá chi tiết"
                                  onClick={() =>
                                    handleDeleteDetail(
                                      device.serviceId,
                                      device.id,
                                      detail.id
                                    )
                                  }
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em className="text-muted">Chưa có dịch vụ</em>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, i) => (
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

      <CommonModal
        show={modalData.show}
        type={modalData.type}
        title={modalData.title}
        payload={modalData.payload}
        onClose={() =>
          setModalData({ show: false, type: "", title: "", payload: null })
        }
        onSubmit={async (formValues) => {
          const { type, payload } = modalData;

          try {
            // ✅ Sửa ngành
            if (
              type === "edit" &&
              payload.serviceId &&
              !payload.deviceId &&
              !payload.detailId
            ) {
              await putService(payload.serviceId, {
                name: formValues.name,
                description: formValues.description,
              });

              setServicesWithDevices((prev) =>
                prev.map((s) =>
                  s.id === payload.serviceId
                    ? {
                        ...s,
                        name: formValues.name,
                        description: formValues.description,
                      }
                    : s
                )
              );
            }

            // ✅ Xoá ngành
            if (
              type === "delete" &&
              payload.serviceId &&
              !payload.deviceId &&
              !payload.detailId
            ) {
              await deleteService(payload.serviceId);
              setServicesWithDevices((prev) =>
                prev.filter((s) => s.id !== payload.serviceId)
              );
            }

            // ✅ Sửa thiết bị
            if (type === "edit" && payload.deviceId && !payload.detailId) {
              await putServiceDevice(payload.serviceId, payload.deviceId, {
                name: formValues.name,
                description: formValues.description,
              });

              setServicesWithDevices((prev) =>
                prev.map((s) =>
                  s.id === payload.serviceId
                    ? {
                        ...s,
                        devices: s.devices.map((d) =>
                          d.id === payload.deviceId
                            ? {
                                ...d,
                                name: formValues.name,
                                description: formValues.description,
                              }
                            : d
                        ),
                      }
                    : s
                )
              );
            }

            // ✅ Xoá thiết bị
            if (type === "delete" && payload.deviceId && !payload.detailId) {
              await deleteServiceDevice(payload.serviceId, payload.deviceId);
              setServicesWithDevices((prev) =>
                prev.map((s) =>
                  s.id === payload.serviceId
                    ? {
                        ...s,
                        devices: s.devices.filter(
                          (d) => d.id !== payload.deviceId
                        ),
                      }
                    : s
                )
              );
            }

            // ✅ Sửa chi tiết
            if (type === "edit" && payload.detailId) {
              await putDeviceDetail(
                payload.serviceId,
                payload.deviceId,
                payload.detailId,
                {
                  name: formValues.name,
                  description: formValues.description,
                  minPrice: parseInt(formValues.minPrice),
                }
              );

              setServicesWithDevices((prev) =>
                prev.map((s) =>
                  s.id === payload.serviceId
                    ? {
                        ...s,
                        devices: s.devices.map((d) =>
                          d.id === payload.deviceId
                            ? {
                                ...d,
                                details: d.details.map((det) =>
                                  det.id === payload.detailId
                                    ? {
                                        ...det,
                                        name: formValues.name,
                                        description: formValues.description,
                                        minPrice: parseInt(formValues.minPrice),
                                      }
                                    : det
                                ),
                              }
                            : d
                        ),
                      }
                    : s
                )
              );
            }

            // ✅ Xoá chi tiết
            if (type === "delete" && payload.detailId) {
              await deleteDeviceDetail(
                payload.serviceId,
                payload.deviceId,
                payload.detailId
              );

              setServicesWithDevices((prev) =>
                prev.map((s) =>
                  s.id === payload.serviceId
                    ? {
                        ...s,
                        devices: s.devices.map((d) =>
                          d.id === payload.deviceId
                            ? {
                                ...d,
                                details: d.details.filter(
                                  (det) => det.id !== payload.detailId
                                ),
                              }
                            : d
                        ),
                      }
                    : s
                )
              );
            }
          } catch (err) {
            console.error("Lỗi xử lý modal:", err);
            alert("Đã xảy ra lỗi khi xử lý.");
          }

          setModalData({ show: false, type: "", title: "", payload: null });
        }}
      />
    </div>
  );
};

export default ListService;
