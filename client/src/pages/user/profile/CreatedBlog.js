/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import { Link } from "react-router-dom";
import { repair, repair_1 } from "../../../assets/img/blog";

const CreatedBlog = () => {
  return (
    <div>
      {/* Basic Information */}
      <div className="card">
        <div className="card-body">
          <div className="doc-review review-listing custom-edit-service">
            <div className="row mb-5">
              <div className="col">
                <ul className="nav nav-tabs nav-tabs-solid">
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/blog-posted">
                      Đã gửi
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/blog-pending">
                      Đang chờ xử lý
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Edit Blog */}
            <div className="card">
              <div className="card-body">
                <h3 className="pb-3">Thêm bài viết</h3>
                <form
                  method="post"
                  encType="multipart/form-data"
                  autoComplete="off"
                  id="update_service"
                  action="doctor-blog.html"
                >
                  <input
                    type="hidden"
                    name="csrf_token_name"
                    defaultValue="0146f123a4c7ae94253b39bca6bd5a5e"
                  />
                  <div className="service-fields mb-3">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="mb-2">
                            Tên bài viết <span className="text-danger">*</span>
                          </label>
                          <input
                            type="hidden"
                            name="service_id"
                            id="service_id"
                            defaultValue={18}
                          />
                          <input
                            className="form-control"
                            type="text"
                            name="service_title"
                            id="service_title"
                            defaultValue="Doccure – Making your clinic painless visit?"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-fields mb-3">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="mb-2">
                            Danh mục chính{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-control"
                            name="category"
                            required
                          >
                            <option value>-- Chọn danh mục --</option>
                            <option value={1}>
                              Sửa chữa nhà cửa
                            </option>
                            <option value={2}>Điện - Điện tử</option>
                            <option value={3}>Nước - Vệ sinh</option>
                            <option value={4}>Điều hòa - Lò sưởi</option>
                            <option value={5}>Mộc - Nội thất</option>
                            <option value={6}>Sửa đồ gia dụng</option>
                            <option value={7}>Dọn dẹp vệ sinh</option>
                            <option value={8}>Sơn - Trát</option>
                            <option value={9}>Khóa - An ninh</option>
                            <option value={10}>Diệt côn trùng</option>
                            <option value={11}>Sửa điện tử</option>
                            <option value={12}>Chuyển nhà</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="mb-2">
                            Danh mục phụ <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select form-control"
                            name="subcategory"
                            required
                          >
                            <option value>-- Chọn danh mục phụ --</option>
                            <option value={1}>Sửa chữa tổng hợp</option>
                            <option value={2}>Lắp đặt điện</option>
                            <option value={3}>Sửa chập điện</option>
                            <option value={4}>Sửa đường ống nước</option>
                            <option value={5}>Thông tắc cống</option>
                            <option value={6}>Sửa điều hòa</option>
                            <option value={7}>Bảo dưỡng máy nóng lạnh</option>
                            <option value={8}>Sửa tủ bếp</option>
                            <option value={9}>Sửa tủ lạnh</option>
                            <option value={10}>Vệ sinh nhà cửa</option>
                            <option value={11}>Sơn nhà</option>
                            <option value={12}>Đổi khóa cửa</option>
                            <option value={13}>Diệt mối mọt</option>
                            <option value={14}>Sửa TV - Loa đài</option>
                            <option value={15}>Chuyển đồ đạc</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-fields mb-3">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="mb-2">
                            Nội dung <span className="text-danger">*</span>
                          </label>
                          <textarea
                            id="about"
                            className="form-control service-desc"
                            name="about"
                            defaultValue={"note."}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-fields mb-3">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="service-upload">
                          <i className="fas fa-cloud-upload-alt" />
                          <span>Tải ảnh lên*</span>
                          <input
                            type="file"
                            name="images[]"
                            id="images"
                            multiple
                            accept="image/jpeg, image/png, image/gif"
                          />
                        </div>
                        <div id="uploadPreview">
                          <ul className="upload-wrap">
                            <li>
                              <div className=" upload-images">
                                <img
                                  alt="Blog Image"
                                  src={repair}
                                />
                              </div>
                            </li>
                            <li>
                              <div className=" upload-images">
                                <img
                                  alt="Blog Image"
                                  src={repair_1}
                                />
                              </div>
                            </li>
                            <li>
                              <div className=" upload-images">
                                <img
                                  alt="Blog Image"
                                  src={repair_1}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="service-fields mb-3">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="mb-2">
                            Mã Video <span className="text-danger">*</span>
                          </label>
                          <input
                            type="hidden"
                            name="video_id"
                            id="video_id"
                            defaultValue={18}
                          />
                          <input
                            className="form-control"
                            type="text"
                            name="video_id1"
                            id="video_id1"
                            defaultValue="Rf34rhkWW1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      type="submit"
                      name="form_submit"
                      value="submit"
                    >
                      Gửi
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* /Edit Blog */}
          </div>
        </div>
      </div>
      {/* /Basic Information */}
    </div>
  );
};

export default CreatedBlog;
