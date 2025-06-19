import React, { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Bạn có thể sửa giúp mình không?",
    lastTime: "2 phút trước",
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Cảm ơn bạn rất nhiều!",
    lastTime: "5 phút trước",
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Khi nào bạn tới sửa?",
    lastTime: "10 phút trước",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Tôi cần hỗ trợ gấp.",
    lastTime: "15 phút trước",
  },
  {
    id: 5,
    name: "Đỗ Văn E",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Lịch sửa có thể thay đổi không?",
    lastTime: "20 phút trước",
  },
  {
    id:6,
    name: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Khi nào bạn tới sửa?",
    lastTime: "10 phút trước",
  },
  {
    id: 7,
    name: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Tôi cần hỗ trợ gấp.",
    lastTime: "15 phút trước",
  },
  {
    id: 8,
    name: "Đỗ Văn E",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Lịch sửa có thể thay đổi không?",
    lastTime: "20 phút trước",
  },
  {
    id: 7,
    name: "Phạm Thị D",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Tôi cần hỗ trợ gấp.",
    lastTime: "15 phút trước",
  },
  {
    id: 8,
    name: "Đỗ Văn E",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Lịch sửa có thể thay đổi không?",
    lastTime: "20 phút trước",
  },
];

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [messages, setMessages] = useState([
    { from: "user", text: "Chào bạn!", time: "10:00" },
    { from: "admin", text: "Chào bạn, mình có thể giúp gì?", time: "10:01" },
    { from: "user", text: "Tủ lạnh nhà mình bị hỏng.", time: "10:02" },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const sendMessage = () => {
    if (newMsg.trim()) {
      setMessages([...messages, { from: "admin", text: newMsg, time: "Bây giờ" }]);
      setNewMsg("");
    }
  };

  return (
      <div className="row">
        <div className="col-md-3 border-end">
          <div className="fw-bold mb-2">Danh sách người dùng</div>
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className={`d-flex align-items-center p-2 mb-2 rounded ${
                selectedUser.id === user.id ? "bg-light" : ""
              }`} 
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.avatar} alt={user.name || "Avatar"} className="rounded-circle me-2" width={40} height={40} />
              <div>
                <div className="fw-bold">{user.name}</div>
                <div className="text-muted small">{user.lastMessage}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-9 d-flex flex-column">
          <div className="border p-3 mb-2 flex-grow-1 overflow-auto" style={{ maxHeight: 650 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex ${msg.from === "admin" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`p-2 my-1 rounded ${
                    msg.from === "admin" ? "bg-primary text-white" : "bg-light"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msg.text}
                  <div className="text-end small mt-1">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tin nhắn..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    
  );
};

export default AdminChat;
