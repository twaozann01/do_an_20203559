/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Link } from 'react-router-dom'

const Support = () => {
  return (
    <div>
      <div>
  {/* Page Content */}
  <div className="content">
    <div className="container">
          <section className="contact-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-md-12">
                  <div className="section-inner-header contact-inner-header">
                    <h2>Bạn có câu hỏi?</h2>
                    <h6>Hãy liên hệ chúng tôi</h6>
                  </div>
                  <div className="card contact-card">
                    <div className="card-body">
                      <div className="contact-icon">
                        <i className="fas fa-map-marked-alt" />
                      </div>
                      <div className="contact-details">
                        <h4>Địa chỉ</h4>
                        <p>Hoàng Mai, Hà Nội</p>
                      </div>
                    </div>
                  </div>
                  <div className="card contact-card">
                    <div className="card-body">
                      <div className="contact-icon">
                        <i className="fas fa-blender-phone" />
                      </div>
                      <div className="contact-details">
                        <h4>Điện thoại</h4>
                        <p>+84 363 468 723</p>
                      </div>
                    </div>
                  </div>
                  <div className="card contact-card">
                    <div className="card-body">
                      <div className="contact-icon">
                        <i className="fas fa-envelope-open-text" />
                      </div>
                      <div className="contact-details">
                        <h4>Email</h4>
                        <p>doccure@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="card contact-card">
                    <div className="card-body">
                      <Link to='/chat'>
                      <div className="contact-icon">
                        <i className="far fa-comments" />
                      </div>
                      <div className="contact-details">
                        <h4>Chat</h4>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-md-12 d-flex">
                  <div className="card contact-form-card w-100">
                    <div className="card-body">
                      <form action="#">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="mb-2">Họ tên</label>
                              <input type="text" className="form-control" placeholder="Nhập tên của bạn" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="mb-2">Email</label>
                              <input type="text" className="form-control" placeholder="Nhập địa chỉ email" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="mb-2"> Số điện thoại</label>
                              <input type="text" className="form-control" placeholder="Nhập số điện thoại" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="mb-2">Dịch vụ</label>
                              <input type="text" className="form-control" placeholder="Nhập dịch vụ bạn cần" />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="mb-2">Nội dung</label>
                              <textarea className="form-control" placeholder="Nhập nội dung" defaultValue={""} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group-btn mb-0">
                              <button type="submit" className="btn btn-primary prime-btn">Gửi</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
  </div>
  {/* /Page Content */}
</div>

    </div>
  )
}

export default Support
