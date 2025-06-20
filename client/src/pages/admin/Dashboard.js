import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  getDashboard,
  getDashboardDailyOrders,
  getDashboardDailyRevenue,
  getDashboardServiceUsage,
  getDashboardOrderStatusRate,
  getDashboardTopRepairmen,
  getDashboardTopCustomers,
  getDashboardRecentOrders,
} from "../../services/Api";
import { formatPrice } from "../../shared/utils/formatPrice";
import dayjs from "dayjs";
import { formatDateTime } from "../../shared/utils/formatDate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [serviceUsage, setServiceUsage] = useState([]);
  const [orderStatusRate, setOrderStatusRate] = useState([]);
  const [topRepairmen, setTopRepairmen] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setStatistics(res.data.data);
      } catch (error) {
        console.log("Lỗi khi tải thông tin", error);
      }
    };

    const fetchData = async () => {
      try {
        const [ordersRes, revenueRes, usageRes, statusRes, repairmenRes, customersRes, recentOrdersRes] = await Promise.all([
          getDashboardDailyOrders(),
          getDashboardDailyRevenue(),
          getDashboardServiceUsage(),
          getDashboardOrderStatusRate(),
          getDashboardTopRepairmen(),
          getDashboardTopCustomers(),
          getDashboardRecentOrders(),
        ]);

        setDailyOrders(ordersRes.data.data);
        setDailyRevenue(revenueRes.data.data);
        setServiceUsage(usageRes.data.data);
        setOrderStatusRate(statusRes.data.data);
        setTopRepairmen(repairmenRes.data.data);
        setTopCustomers(customersRes.data.data);
        setOrders(recentOrdersRes.data.data);
      } catch (error) {
        console.log("Lỗi khi tải dữ liệu dashboard", error);
      }
    };

    fetchDashboard();
    fetchData();
  }, []);

  const orderChartData = {
    labels: dailyOrders.map((item) => dayjs(item.date).format("DD/MM")),
    datasets: [
      {
        label: "Số đơn mỗi ngày",
        data: dailyOrders.map((item) => item.orderCount),
        backgroundColor: "rgba(0, 123, 255, 0.6)",
      },
    ],
  };

  const revenueChartData = {
    labels: dailyRevenue.map((item) => dayjs(item.date).format("DD/MM")),
    datasets: [
      {
        label: "Doanh thu mỗi ngày (đ)",
        data: dailyRevenue.map((item) => item.revenue),
        borderColor: "rgba(255, 193, 7, 1)",
        backgroundColor: "rgba(255, 193, 7, 0.4)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const serviceUsageChartData = {
    labels: serviceUsage.map((item) => `${item.name} (${item.percentage}%)`),
    datasets: [
      {
        data: serviceUsage.map((item) => item.count),
        backgroundColor: [
          "#0d6efd",
          "#20c997",
          "#ffc107",
          "#fd7e14",
          "#6c757d",
          "#6610f2",
          "#198754",
        ],
      },
    ],
  };

  const orderStatusChartData = {
    labels: orderStatusRate.map((item) => `${item.name} (${item.percentage}%)`),
    datasets: [
      {
        data: orderStatusRate.map((item) => item.count),
        backgroundColor: ["#ffc107", "#0dcaf0", "#198754", "#dc3545"],
      },
    ],
  };

  const StarRating = ({ rating }) => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fe ${
              i < rating ? "fe-star text-warning" : "fe-star-o text-secondary"
            }`}
          ></i>
        ))}
      </>
    );
  };

  const renderStatusBadge = (status) => {
    const mapColor = {
      Pending: "secondary",
      InProgress: "warning",
      Completed: "success",
      Canceled: "danger",
    };

    const mapText = {
      Pending: "Chờ xử lý",
      InProgress: "Đang sửa",
      Completed: "Hoàn thành",
      Canceled: "Đã hủy",
    };

    return <span className={`badge bg-${mapColor[status] || "secondary"}`}>{mapText[status] || status}</span>;
  };


  return (
    <div className="p-4">
      <h3 className="mb-4">Chào mừng Quản trị viên</h3>

      <div className="row">
        {[
          {
            icon: "fas fa-user-nurse",
            label: "Thợ sửa chữa",
            value: statistics?.repairmanCount,
            color: "primary",
          },
          {
            icon: "fas fa-users",
            label: "Khách hàng",
            value: statistics?.customerCount,
            color: "success",
          },
          {
            icon: "fas fa-wrench",
            label: "Đơn hôm nay",
            value: statistics?.todayNewOrderCount,
            color: "danger",
          },
          {
            icon: "fa-dollar-sign",
            label: "Doanh thu hôm nay",
            value: formatPrice(statistics?.todayOrderRevenue),
            color: "warning",
          },
        ].map((item, i) => (
          <div className="col-xl-3 col-sm-6 col-12 mb-3" key={i}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <span className={`me-3 text-${item.color}`}>
                    <i className={`${item.icon} fa-2x`}></i>
                  </span>
                  <div>
                    <h3>{item.value}</h3>
                    <p className="text-muted mb-0">{item.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Đơn đặt hẹn</strong>
            </div>
            <div className="card-body">
              <Bar data={orderChartData} />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Tỷ lệ đặt dịch vụ</strong>
            </div>
            <div className="card-body">
              <Doughnut data={serviceUsageChartData} />
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Tỷ lệ trạng thái đơn hàng</strong>
            </div>
            <div className="card-body">
              <Doughnut data={orderStatusChartData} />
            </div>
          </div>
        </div>
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Doanh thu</strong>
            </div>
            <div className="card-body">
              <Line data={revenueChartData} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Top 5 thợ sửa chữa xuất sắc nhất</strong>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Số đơn</th>
                    <th>Đánh giá trung bình</th>
                  </tr>
                </thead>
                <tbody>
                  {topRepairmen.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.totalOrders}</td>
                      <td>
                        <StarRating rating={item.averageRating} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <strong>Top 5 khách hàng thân thiết nhất</strong>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Số đơn đã đặt</th>
                    <th>Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.totalOrders}</td>
                      <td>{formatPrice(item.totalSpent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">10 đơn hàng gần nhất</h4>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã đơn</th>
                    <th>Thời gian tạo</th>
                    <th>Trạng thái</th>
                    <th>Tên khách hàng</th>
                    <th>Ngành dịch vụ</th>
                    <th>Thiết bị</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.orderId}>
                      <td>{index + 1}</td>
                      <td>{order.orderCode}</td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      <td>{renderStatusBadge(order.status)}</td>
                      <td>{order.customerName}</td>
                      <td>{order.serviceName}</td>
                      <td>{order.deviceName}</td>
                      <td>{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
