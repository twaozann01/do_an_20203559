import React, { useState } from "react";

const initialGifts = [
  { id: "Q001", name: "Phiếu giảm giá 10%", description: "Giảm 10% cho lần sửa chữa tiếp theo" },
  { id: "Q002", name: "Tặng 1 bộ lọc nước", description: "Áp dụng cho dịch vụ máy lọc nước" },
  { id: "Q003", name: "Miễn phí kiểm tra", description: "Áp dụng cho tất cả dịch vụ" },
  { id: "Q004", name: "Voucher 50.000đ", description: "Sử dụng khi đơn hàng trên 500.000đ" }
];

const Gift = () => {
  const [gifts, setGifts] = useState(initialGifts);
  const [search, setSearch] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (gift) => {
    setSelectedGift(gift);
    setShowModal(true);
  };

  const handleSave = () => {
    const exists = gifts.find((g) => g.id === selectedGift.id);
    let updatedList;
    if (exists) {
      updatedList = gifts.map((g) => (g.id === selectedGift.id ? selectedGift : g));
    } else {
      updatedList = [...gifts, selectedGift];
    }
    setGifts(updatedList);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa quà tặng này không?")) {
      setGifts(gifts.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">Danh sách quà tặng</h4>
        <input
          type="text"
          placeholder="Tìm kiếm quà tặng..."
          className="form-control w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-sm btn-success"
          onClick={() => {
            const newGift = {
              id: `Q${String(gifts.length + 1).padStart(3, "0")}`,
              name: "",
              description: ""
            };
            setSelectedGift(newGift);
            setShowModal(true);
          }}
        >
          + Thêm quà tặng
        </button>
      </div>
      <div className="card-body table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên quà tặng</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {gifts.filter(g => g.name.toLowerCase().includes(search.toLowerCase())).map((g, index) => (
              <tr key={index}>
                <td>{g.id}</td>
                <td>{g.name}</td>
                <td>{g.description}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(g)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedGift?.id ? "Chỉnh sửa quà tặng" : "Thêm quà tặng"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên quà</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedGift.name}
                    onChange={(e) => setSelectedGift({ ...selectedGift, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={selectedGift.description}
                    onChange={(e) => setSelectedGift({ ...selectedGift, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gift;
