/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { user_1, user_2, user_3, user_4, user_5, user_6 } from "../../../assets/img/user";

const Chat = () => {
  return (
    <div>
      {/* Page Content */}
      <div className="card">
        <div className="pt-0">
            <div className="row chat-window">
              <div className="col-xl-12">
                <div className="chat-window">
                  {/* Chat Left */}
                  <div className="chat-cont-left">
                    <div className="chat-header">
                      <span>Trò chuyện</span>
                      <a className="chat-compose">
                        <i className="fab fa-facebook-messenger" />
                      </a>
                    </div>
                    <form className="chat-search">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <i className="fas fa-search" />
                        </div>
                        <input
                          type="text"
                          className="form-control rounded-pill"
                          placeholder="Tìm kiếm"
                        />
                      </div>
                    </form>
                    <div className="chat-users-list">
                      <div className="chat-scroll">
                        <a
                          className="notify-block d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-away">
                              <img
                                src={user_1}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Hoàng Văn Thợ</div>
                              <div className="user-last-chat">
                                Bạn có khỏe không
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">2 phút</div>
                              <div className="badge badge-success rounded-pill">
                                15
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat active d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Hồng Đăng</div>
                              <div className="user-last-chat">
                                Gọi cho tôi.{" "}
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                18:01
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-away">
                              <img
                                src={user_3}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Nguyễn Bảo</div>
                              <div className="user-last-chat">
                                Bạn có thể đến vào sáng mai.
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                15:30
                              </div>
                              <div className="badge badge-success rounded-pill">
                                3
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_4}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Nguyễn Đảng</div>
                              <div className="user-last-chat">
                                Tủ lạnh tôi bị làm sao?
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                15:59
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-offline">
                              <img
                                src={user_5}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">
                                Nguyễn Công
                              </div>
                              <div className="user-last-chat">
                                Bạn đến sửa cho tôi
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                11:21
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_6}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">
                                Minh Công
                              </div>
                              <div className="user-last-chat">
                                okk
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                10:05
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-away">
                              <img
                                src={user_1}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Hoàng Văn Thợ</div>
                              <div className="user-last-chat">
                                Bạn có khỏe không
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">2 phút</div>
                              <div className="badge badge-success rounded-pill">
                                15
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat active d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Hồng Đăng</div>
                              <div className="user-last-chat">
                                Gọi cho tôi.{" "}
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                18:01
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-away">
                              <img
                                src={user_3}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Nguyễn Bảo</div>
                              <div className="user-last-chat">
                                Bạn có thể đến vào sáng mai.
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                15:30
                              </div>
                              <div className="badge badge-success rounded-pill">
                                3
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_4}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">Nguyễn Đảng</div>
                              <div className="user-last-chat">
                                Tủ lạnh tôi bị làm sao?
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                15:59
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-offline">
                              <img
                                src={user_5}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">
                                Nguyễn Công
                              </div>
                              <div className="user-last-chat">
                                Bạn đến sửa cho tôi
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                11:21
                              </div>
                            </div>
                          </div>
                        </a>
                        <a
                          className="notify-block read-chat d-flex open-chat"
                        >
                          <div className="media-img-wrap flex-shrink-0">
                            <div className="avatar avatar-online">
                              <img
                                src={user_6}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                          </div>
                          <div className="media-body chat-custom flex-grow-1">
                            <div>
                              <div className="user-name">
                                Minh Công
                              </div>
                              <div className="user-last-chat">
                                okk
                              </div>
                            </div>
                            <div>
                              <div className="last-chat-time block">
                                10:05
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* /Chat Left */}
                  {/* Chat Right */}
                  <div className="chat-cont-right">
                    <div className="chat-header">
                      <a
                        id="back_user_list"
                      
                        className="back-user-list"
                      >
                        <i className="fas fa-chevron-left" />
                      </a>
                      <div className="notify-block d-flex">
                        <div className="media-img-wrap flex-shrink-0">
                          <div className="avatar avatar-online">
                            <img
                              src={user_2}
                              alt="User Image"
                              className="avatar-img rounded-circle"
                            />
                          </div>
                        </div>
                        <div className="media-body flex-grow-1">
                          <div className="user-name">Hồng Đăng</div>
                          <div className="user-status">Đang hoạt động</div>
                        </div>
                      </div>
                      <div className="chat-options">
                        <a
                        
                          data-bs-toggle="modal"
                          data-bs-target="#voice_call"
                        >
                          <i className="fas fa-phone" />
                        </a>
                        <a
                        
                          data-bs-toggle="modal"
                          data-bs-target="#video_call"
                        >
                          <i className="fas fa-video" />
                        </a>
                        <a>
                          <i className="fas fa-ellipsis-v" />
                        </a>
                      </div>
                    </div>
                    <div className="chat-body">
                      <div className="chat-scroll">
                        <ul className="list-unstyled">
                          <li className="notify-block sent d-flex">
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>Xin chào.</p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:30</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="notify-block received d-flex">
                            <div className="avatar flex-shrink-0">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>Tủ lạnh của tôi đang bị hỏng</p>
                                  <p>
                                    Bạn có thể sửa chữa giúp tôi không?
                                  </p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:35</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="msg-box">
                                <div>
                                  <p>Nó không vào điện.</p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:40</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="msg-box">
                                <div>
                                  <div className="chat-msg-attachments">
                                    <div className="chat-attachment">
                                      <img
                                        src={user_1}
                                        alt="Attachment"
                                      />
                                      <a
                                        href="#"
                                        className="chat-attach-download"
                                      >
                                        <i className="fas fa-download" />
                                      </a>
                                    </div>
                                    <div className="chat-attachment">
                                      <img
                                        src={user_3}
                                        alt="Attachment"
                                      />
                                      <a
                                        href="#"
                                        className="chat-attach-download"
                                      >
                                        <i className="fas fa-download" />
                                      </a>
                                    </div>
                                  </div>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:41</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="notify-block sent d-flex">
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>Bạn ở đâu?</p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:42</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="msg-box">
                                <div>
                                  <p>
                                    Tôi có thể đến sửa chữa cho bạn.
                                  </p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:42</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>       
                            </div>
                          </li>
                          <li className="notify-block received d-flex">
                            <div className="avatar flex-shrink-0">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>Cảm ơn bạn</p>
                                  <p>Tối ở Hoàng Mai</p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>8:55</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="chat-date">Hôm nay</li>
                          <li className="notify-block received d-flex">
                            <div className="avatar flex-shrink-0">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>
                                    Bạn đến chưa?
                                  </p>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>10:17</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="notify-block sent d-flex">
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <p>Tôi đang đến</p>
                                  <div className="chat-msg-actions dropdown">
                                    <a
                                      href="#"
                                      data-bs-toggle="dropdown"
                                      aria-haspopup="true"
                                      aria-expanded="false"
                                    >
                                      <i className="fe fe-elipsis-v" />
                                    </a>
                                    
                                  </div>
                                  <ul className="chat-msg-info">
                                    <li>
                                      <div className="chat-time">
                                        <span>10:19</span>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="notify-block received d-flex">
                            <div className="avatar flex-shrink-0">
                              <img
                                src={user_2}
                                alt="User Image"
                                className="avatar-img rounded-circle"
                              />
                            </div>
                            <div className="media-body flex-grow-1">
                              <div className="msg-box">
                                <div>
                                  <div className="msg-typing">
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="chat-footer">
                      <div className="input-group">
                        <div className="btn-file btn">
                          <i className="fa fa-paperclip" />
                          <input type="file" />
                        </div>
                        <input
                          type="text"
                          className="input-msg-send form-control rounded-pill"
                          placeholder="Nhập nội dung"
                        />
                        <button
                          type="button"
                          className="btn msg-send-btn rounded-pill ms-2"
                        >
                          <i className="fab fa-telegram-plane" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* /Chat Right */}
                </div>
              </div>
            </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default Chat;
