/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { getAddressUser, getInfo, getOrders } from '../../../services/Api';
import { ITEMS_PER_PAGE } from '../../../shared/constants/app';
import { formatDateTime, formatPrice } from '../../../shared/utils';

const RepairedTab = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const id = userInfo?.data.id;

  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'InProgress', label: 'Đang sửa chữa' },
    { id: 'Completed', label: 'Hoàn thành' },
  ];

  useEffect(() => {
    if (!id) return;
    getOrders({
      params: {
        repairmanId: id,
      }
    })
      .then(async (res) => {
        const orders = res.data.data.items;

        const orderName = await Promise.all(
          orders.map(async (order) => {
            const customer = await getInfo(order.customerId);
            const address = order.addressId ? await getAddressUser(order?.customerId, order?.addressId) : null
            
            return {
              ...order,
              customerName: address?.data?.data.fullName,
              statusLabel: getStatusLabel(order.status),
            };
          })
        );
        setOrders(orderName);
      })
      .catch((err) => console.log("Lỗi khi tải đơn hàng!", err));
  }, [id]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'InProgress':
        return 'Đang sửa chữa';
      case 'Completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'InProgress':
        return 'bg-primary-light';
      case 'Completed':
        return 'bg-success-light';
      default:
        return '';
    }
  };

  const filteredOrders = orders
    .filter((o) => activeTab === 'all' || o.status === activeTab)
    .filter((o) => o.orderCode?.toLowerCase().includes(searchOrder.toLowerCase()));

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (!id || !userInfo || loading) return <div>Đang tải thông tin......</div>;

  return (
    <div>
      <nav className="user-tabs mb-4">
        <ul className="nav nav-tabs nav-tabs-bottom nav-justified">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="input-group">
        <span className="input-group-text">
          <i className="fas fa-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm theo mã đơn hàng..."
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
        />
      </div>

      <div className="card card-table mb-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-center mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Ngày hẹn</th>
                  <th>Chi phí</th>
                  <th>Trạng thái</th>
                  <th>Tương tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td><Link to="/user/item-detail">{item.orderCode}</Link></td>
                    <td>{item.customerName}</td>
                    <td>{formatDateTime(item.repairDate)}</td>
                    <td>{formatPrice(item.total)}</td>
                    <td>
                      <span className={`badge ${getStatusClass(item.status)}`}>{item.statusLabel}</span>
                    </td>
                    <td>
                      <Link to={`/user/order-detail/${item.id}`} className="btn btn-sm bg-info-light">
                        <i className="far fa-eye" /> Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>Trang {currentPage} / {totalPages}</div>
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
            {filteredOrders.length === 0 && (
              <p className="text-center mt-3">Không có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairedTab;
