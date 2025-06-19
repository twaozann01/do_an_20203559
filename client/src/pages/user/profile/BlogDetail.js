/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { repair_1, repair_2, repair_3, repair_4, repair_5 } from '../../../assets/img/blog'
import { user_2, user_3, user_4, user_5 } from '../../../assets/img/user'

const BlogDetail = () => {
  return (
    <div className='container'>
      <div className="row">
  <div className="col-lg-8 col-md-12">
    <div className="blog-view">
      <div className="blog blog-single-post">
        <div className="blog-image">
          <a href="#"><img alt="blog-image" src={repair_5} className="img-fluid" /></a>
        </div>
        <h3 className="blog-title">Cách sửa điều hòa không mát hiệu quả</h3>
        <div className="blog-info clearfix">
          <div className="post-left">
            <ul>
              <li>
                <div className="post-author">
                  <a href="#"><img src={user_2} alt="Tác giả" /> <span>KTV Nguyễn Văn Thợ</span></a>
                </div>
              </li>
              <li><i className="far fa-calendar" />04/12/2023</li>
              <li><i className="far fa-comments" />12 Bình luận</li>
              <li><i className="fa fa-tags" />Điều hòa</li>
            </ul>
          </div>
        </div>
        <div className="blog-content">
          <p>Điều hòa không mát là vấn đề phổ biến trong mùa hè. Nguyên nhân có thể do thiếu gas, lọc bụi bẩn, hoặc bo mạch bị lỗi.</p>
          <p>Đầu tiên, bạn nên kiểm tra remote và cài đặt nhiệt độ. Nếu điều hòa vẫn không hoạt động bình thường, kiểm tra bộ lọc gió và dàn lạnh để làm sạch bụi bẩn tích tụ lâu ngày.</p>
          <p>Nếu vẫn không khắc phục được, hãy gọi kỹ thuật viên để kiểm tra gas lạnh và tình trạng máy nén. Tránh tự ý tháo lắp nếu bạn không có chuyên môn vì có thể gây hư hại thêm.</p>
        </div>
      </div>
      <div className="card blog-share clearfix">
        <div className="card-header">
          <h4 className="card-title">Chia sẻ bài đăng</h4>
        </div>
        <div className="card-body">
          <ul className="social-share">
            <li><a href="#" title="Facebook"><i className="fab fa-facebook" /></a></li>
            <li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
            <li><a href="#" title="Linkedin"><i className="fab fa-linkedin" /></a></li>
            <li><a href="#" title="Google Plus"><i className="fab fa-google-plus" /></a></li>
            <li><a href="#" title="Youtube"><i className="fab fa-youtube" /></a></li>
          </ul>
        </div>
      </div>
      <div className="card author-widget clearfix">
        <div className="card-header">
          <h4 className="card-title">Tác giả</h4>
        </div>
        <div className="card-body">
          <div className="about-author">
            <div className="about-author-img">
              <div className="author-img-wrap">
                <a href="#"><img className="img-fluid rounded-circle" alt="Darren Elder" src={user_2} /></a>
              </div>
            </div>
            <div className="author-details">
              <a href="#" className="blog-author-name">KTV Nguyễn Văn Thợ</a>
              <p className="mb-0">Chuyên gia sửa chữa điện lạnh với hơn 10 năm kinh nghiệm, chuyên xử lý các lỗi liên quan đến điều hòa, tủ lạnh, và hệ thống làm mát.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card blog-comments clearfix">
        <div className="card-header">
          <h4 className="card-title">Bình luận (12)</h4>
        </div>
        <div className="card blog-comments clearfix">
              <div className="card-header">
                <h4 className="card-title">Bình luận về bài viết</h4>
              </div>
              <div className="card-body pb-0">
                <ul className="comments-list">
                  <li>
                    <div className="comment">
                      <div className="comment-author">
                        <img
                          className="avatar"
                          alt="Trung Lê"
                          src={user_4}
                        />
                      </div>
                      <div className="comment-block">
                        <span className="comment-by">
                          <span className="blog-author-name">Trung Lê</span>
                        </span>
                        <p>Rất hữu ích! Mình làm theo và điều hòa đã mát trở lại.</p>
                        <p className="blog-date">06/12/2023</p>
                        <a className="comment-btn" href="#">
                          <i className="fas fa-reply" /> Trả lời
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="comment">
                      <div className="comment-author">
                        <img
                          className="avatar"
                          alt="Lan Nguyễn"
                          src={user_3}
                        />
                      </div>
                      <div className="comment-block">
                        <span className="comment-by">
                          <span className="blog-author-name">Lan Nguyễn</span>
                        </span>
                        <p>Bài viết chi tiết và dễ hiểu. Cảm ơn tác giả!</p>
                        <p className="blog-date">05/12/2023</p>
                        <a className="comment-btn" href="#">
                          <i className="fas fa-reply" /> Trả lời
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="comment">
                      <div className="comment-author">
                        <img
                          className="avatar"
                          alt="Minh Tú"
                          src={user_5}
                        />
                      </div>
                      <div className="comment-block">
                        <span className="comment-by">
                          <span className="blog-author-name">Minh Tú</span>
                        </span>
                        <p>
                          Nhà mình bị lỗi tương tự, sau khi kiểm tra lưới lọc
                          thì đúng là bụi quá nhiều.
                        </p>
                        <p className="blog-date">04/12/2023</p>
                        <a className="comment-btn" href="#">
                          <i className="fas fa-reply" /> Trả lời
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              </div>
      </div>
      <div className="card new-comment clearfix">
        <div className="card-header">
          <h4 className="card-title">Bình luận về bài viết</h4>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label className="mb-2">Tên <span className="text-danger">*</span></label>
              <input type="text" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="mb-2">Email <span className="text-danger">*</span></label>
              <input type="email" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="mb-2">Bình luận</label>
              <textarea rows={4} className="form-control" defaultValue={""} />
            </div>
            <div className="submit-section">
              <button className="btn btn-primary submit-btn" type="submit">Gửi</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* Blog Sidebar */}
  <div className="col-lg-4 col-md-12 sidebar-right theiaStickySidebar">
    {/* Search */}
    <div className="card search-widget">
      <div className="card-body">
        <form className="search-form">
          <div className="input-group">
            <input type="text" placeholder="Tìm kiếm..." className="form-control" />
            <button type="submit" className="btn btn-primary"><i className="fa fa-search" /></button>
          </div>
        </form>
      </div>
    </div>
    {/* /Search */}
    {/* Latest Posts */}
    <div className="card post-widget">
  <div className="card-header">
    <h4 className="card-title">Bài viết mới</h4>
  </div>
  <div className="card-body">
    <ul className="latest-posts">
      <li>
        <div className="post-thumb">
          <a href="./blog_detail.html">
            <img className="img-fluid" src={repair_5} alt="Sửa điều hòa" />
          </a>
        </div>
        <div className="post-info">
          <h4>
            <a href="./blog_detail.html">Cách sửa điều hòa không mát hiệu quả</a>
          </h4>
          <p>04/12/2023</p>
        </div>
      </li>
      <li>
        <div className="post-thumb">
          <a href="./blog_detail.html">
            <img className="img-fluid" src={repair_2} alt="Sửa tủ lạnh" />
          </a>
        </div>
        <div className="post-info">
          <h4>
            <a href="./blog_detail.html">Mẹo bảo trì tủ lạnh tiết kiệm điện</a>
          </h4>
          <p>03/12/2023</p>
        </div>
      </li>
      <li>
        <div className="post-thumb">
          <a href="./blog_detail.html">
            <img className="img-fluid" src={repair_1} alt="Sửa máy giặt" />
          </a>
        </div>
        <div className="post-info">
          <h4>
            <a href="./blog_detail.html">Cách khắc phục lỗi máy giặt không xả nước</a>
          </h4>
          <p>02/12/2023</p>
        </div>
      </li>
      <li>
        <div className="post-thumb">
          <a href="./blog_detail.html">
            <img className="img-fluid" src={repair_3} alt="Sửa điện" />
          </a>
        </div>
        <div className="post-info">
          <h4>
            <a href="./blog_detail.html">Xử lý chập điện trong gia đình an toàn</a>
          </h4>
          <p>01/12/2023</p>
        </div>
      </li>
      <li>
        <div className="post-thumb">
          <a href="./blog_detail.html">
            <img className="img-fluid" src={repair_4} alt="Sửa ống nước" />
          </a>
        </div>
        <div className="post-info">
          <h4>
            <a href="./blog_detail.html">Cách sửa ống nước rò rỉ nhanh chóng</a>
          </h4>
          <p>30/11/2023</p>
        </div>
      </li>
    </ul>
  </div>
</div>

    {/* /Latest Posts */}
    {/* Categories */}
    <div className="card category-widget">
      <div className="card-header">
        <h4 className="card-title">Danh mục bài viết</h4>
      </div>
      <div className="card-body">
        <ul className="categories">
          <li><a href="#">Điện tử <span>(62)</span></a></li>
          <li><a href="#">Điện lạnh <span>(27)</span></a></li>
          <li><a href="#">Điện nước <span>(41)</span></a></li>
          <li><a href="#">Thời trang <span>(16)</span></a></li>
          <li><a href="#">Nhà cửa <span>(55)</span></a></li>
          <li><a href="#">Nội thất <span>(07)</span></a></li>
        </ul>
      </div>
    </div>
    {/* /Categories */}
    {/* Tags */}
    <div className="card tags-widget">
      <div className="card-header">
        <h4 className="card-title">Tags</h4>
      </div>
      <div className="card-body">
        <ul className="tags">
          <li><a href="#" className="tag">Sửa chữa nhà</a></li>
          <li><a href="#" className="tag">Thợ điện</a></li>
          <li><a href="#" className="tag">Sửa ống nước</a></li>
          <li><a href="#" className="tag">Điều hòa</a></li>
          <li><a href="#" className="tag">Sửa WiFi</a></li>
          <li><a href="#" className="tag">Bảo trì</a></li>
          <li><a href="#" className="tag">Khẩn cấp</a></li>
          <li><a href="#" className="tag">Mẹo sửa chữa</a></li>
          <li><a href="#" className="tag">Tự sửa</a></li>
          <li><a href="#" className="tag">Báo giá</a></li>
          <li><a href="#" className="tag">Thợ lành nghề</a></li>
          <li><a href="#" className="tag">Sửa khóa</a></li>
          <li><a href="#" className="tag">Điện lạnh</a></li>
          <li><a href="#" className="tag">Chống thấm</a></li>
          <li><a href="#" className="tag">Nội thất</a></li>
          <li><a href="#" className="tag">Xây dựng</a></li>
          <li><a href="#" className="tag">Thợ đa năng</a></li>
          <li><a href="#" className="tag">Sửa máy giặt</a></li>
          <li><a href="#" className="tag">Sửa tủ lạnh</a></li>
          <li><a href="#" className="tag">Dịch vụ 24/7</a></li>
        </ul>
      </div>
    </div>
    {/* /Tags */}
  </div>
  {/* /Blog Sidebar */}
</div>

    </div>
  )
}

export default BlogDetail
