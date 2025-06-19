import React, { useEffect, useState } from "react";
import { getWalletInfo } from "../../../services/Api";
import { formatDateTime, formatPrice } from "../../../shared/utils";

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getWalletInfo()
      .then((res) => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy ví:", err);
      });
  }, []);

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5>💰 Ví của bạn</h5>
      </div>
      <div className="card-body">
        <h4>Số dư: <span className="text-success">{formatPrice(balance)}</span></h4>
        <hr />
        <h6>Lịch sử giao dịch</h6>
        <ul className="list-group">
          {transactions.map((t) => (
            <li key={t.id} className="list-group-item d-flex justify-content-between">
              <span>{t.description}</span>
              <span>
                {formatPrice(t.amount)} | {formatDateTime(t.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletPage;
