import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAddress, deleteAddress } from "../../../services/Api";
import CommonModal from "../../../shared/components/CommonModal";
import { AuthContext } from "../../../contexts/AuthContext";

const Address = () => {
  const {userInfo, loading} = useContext(AuthContext)
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (loading || !userInfo || !userInfo.id) return;
    const fetchAddresses = async () => {
      try {
        const res = await getAddress(userInfo.id);
        const sorted = (res.data || []).sort((a, b) => b.addressMain - a.addressMain);
        setAddresses(sorted);
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ:", err);
      } finally {
        setLoadings(false);
      }
    };

    fetchAddresses();
  }, [userInfo, loading]);

  const handleDelete = async () => {
    const addressToDelete = addresses.find(a => a.id === selectedAddressId);
    if (addressToDelete?.addressMain) {
      alert("❌ Không thể xoá địa chỉ chính. Vui lòng chọn địa chỉ khác làm mặc định trước.");
      setShowConfirmModal(false);
      return;
    }

    try {
      await deleteAddress(userInfo.id, selectedAddressId);
      alert("✅ Xoá địa chỉ thành công");
      setAddresses((prev) => prev.filter((a) => a.id !== selectedAddressId));
    } catch (err) {
      console.error("❌ Lỗi khi xoá địa chỉ:", err);
      alert("❌ Xoá địa chỉ thất bại");
    } finally {
      setShowConfirmModal(false);
      setSelectedAddressId(null);
    }
  };

  return (
    <div className="card">
    <div className="card-body py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <i className="fas fa-map-pin me-2"></i> Địa chỉ của Tôi
        </h3>
        <Link to="/user/add-address" className="btn btn-primary">
          <i className="fas fa-plus me-2" /> Thêm Địa Chỉ Mới
        </Link>
      </div>

      {loadings ? (
        <p>Đang tải địa chỉ...</p>
      ) : addresses.length === 0 ? (
        <div className="alert alert-info">Chưa có địa chỉ nào.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {addresses.map((item) => (
            <div key={item.id} className="border rounded shadow-sm bg-light p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-1">
                    <i className="fas fa-user me-2 text-primary" />{item.fullName}
                  </h5>
                  <p className="mb-1 text-muted">
                    <i className="fas fa-phone-alt me-2" />{item.phone}
                  </p>
                  <p className="mb-0 text-secondary">
                    <i className="fas fa-map-marker-alt me-2 text-danger" />
                    {item.street}, {item.ward}, {item.district}, {item.city}
                  </p>
                </div>
                {item.addressMain && (
                  <span className="badge bg-success">Địa chỉ chính</span>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/user/edit-address/${item.id}`)}
                >
                  <i className="fas fa-edit me-1" />
                </button>
                {!item.addressMain && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedAddressId(item.id);
                      setShowConfirmModal(true);
                    }}
                  >
                    <i className="fas fa-trash-alt me-1" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CommonModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onSubmit={handleDelete}
        type="confirm"
        title="❗ Xác nhận xoá địa chỉ"
        payload={{
          message: "Bạn có chắc chắn muốn xoá địa chỉ này không?",
          showActions: true,
        }}
      />
    </div>
    </div>
  );
};

export default Address;
