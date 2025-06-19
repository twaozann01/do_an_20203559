import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import { getDashboard } from "../../services/Api";
import { formatPrice } from "../../shared/utils/formatPrice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa66cc"];

const Report = () => {
  const [statistics, setStatistics] = useState(null);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);
  const [topTechnicians, setTopTechnicians] = useState([]);


  useEffect(() => {
      const fetchDashboard = async () => {
        try {
          const res = await getDashboard();
          console.log(res.data);
          console.log(res.data
          )
          setStatistics(res.data);
        } catch (error) {
          console.log("Lỗi khi tải thông tin", error);
        }
      };
      fetchDashboard();
    }, []);
  useEffect(() => {
    

    setMonthlyBookings([
      { _id: 1, total: 10 }, { _id: 2, total: 14 }, { _id: 3, total: 9 },
      { _id: 4, total: 22 }, { _id: 5, total: 18 }, { _id: 6, total: 27 },
      { _id: 7, total: 8 }, { _id: 8, total: 16 }, { _id: 9, total: 12 },
      { _id: 10, total: 19 }, { _id: 11, total: 23 }, { _id: 12, total: 28 },
    ]);

    setMonthlyRevenue([
      { _id: 1, revenue: 6000000 }, { _id: 2, revenue: 8500000 }, { _id: 3, revenue: 7400000 },
      { _id: 4, revenue: 12000000 }, { _id: 5, revenue: 9000000 }, { _id: 6, revenue: 11000000 },
      { _id: 7, revenue: 4000000 }, { _id: 8, revenue: 9700000 }, { _id: 9, revenue: 8800000 },
      { _id: 10, revenue: 13000000 }, { _id: 11, revenue: 14500000 }, { _id: 12, revenue: 15500000 },
    ]);

    setServiceStats([
      { service: "Sửa điện", count: 35 },
      { service: "Sửa nước", count: 25 },
      { service: "Máy lạnh", count: 40 },
      { service: "Internet", count: 12 },
      { service: "Khác", count: 12 },
    ]);

    setTopTechnicians([
      { name: "Nguyễn Văn A", orders: 34, rating: 4.8 },
      { name: "Trần Thị B", orders: 28, rating: 4.7 },
      { name: "Lê Văn C", orders: 32, rating: 4.6 },
      { name: "Lê Văn D", orders: 34, rating: 4.5 },
      { name: "Lê Văn E", orders: 24, rating: 4.5 },
    ]);
  }, []);

  const formatMonth = (m) => `Tháng ${m}`;

  return (
    <div className=" mt-4">
      {/* --- Tổng quan --- */}
      {statistics && (
        <div className="row mb-4">
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Tổng đơn<br /><strong>{statistics?.totalOrderCount}</strong></div></div></div>
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Hoàn thành<br /><strong>{statistics?.completedOrderStatusCount}</strong></div></div></div>
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Đã huỷ<br /><strong>{statistics?.canceledOrderStatusCount}</strong></div></div></div>
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Khách hàng<br /><strong>{statistics?.customerCount}</strong></div></div></div>
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Thợ sửa chữa<br /><strong>{statistics?.repairmanCount}</strong></div></div></div>
          <div className="col-md-2"><div className="card text-center"><div className="card-body">Doanh thu<br /><strong>{formatPrice(statistics?.totalUserCount) }</strong></div></div></div>
        </div>
      )}

      {/* --- Biểu đồ --- */}
      <div className="row mb-5">
        <div className="col-md-6">
          <h5 className="text-center">Đơn hàng theo tháng</h5>
          <BarChart width={750} height={400} data={monthlyBookings.map(item => ({ name: formatMonth(item._id), total: item.total }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </div>
        <div className="col-md-6">
          <h5 className="text-center">Doanh thu theo tháng</h5>
          <LineChart width={750} height={400} data={monthlyRevenue.map(item => ({ name: formatMonth(item._id), revenue: item.revenue }))}>
            <CartesianGrid  strokeDasharray="3 3" />
            <XAxis dataKey="name" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>

      {/* --- Tỷ lệ dịch vụ --- */}
      <div className="row mb-5">
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <PieChart width={350} height={300}>
            <Pie
              data={serviceStats}
              cx="50%" cy="50%" outerRadius={100} label
              dataKey="count" nameKey="service"
            >
              {serviceStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
        <div className="col-7">
          <h5 className="mb-3">🏆 Kỹ thuật viên nổi bật</h5>
          <table className="table table-striped">
            <thead><tr><th>Tên</th><th>Số đơn</th><th>Đánh giá</th></tr></thead>
            <tbody>
              {topTechnicians.map(tech => (
                <tr key={tech.name}>
                  <td>{tech.name}</td>
                  <td>{tech.orders}</td>
                  <td>{tech.rating} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
