import React from 'react';
import './contactus.css';
import banner from '../images/shop-pic/店面圖banner.jpeg';
import shop1 from '../images/shop-pic/店面圖7.jpg';
import shop2 from '../images/shop-pic/店面圖5.jpeg';
import shop3 from '../images/shop-pic/店面圖2.jpeg';
import swal from 'sweetalert';
import GoogleMap from '../components/GoogleMap';
import { useForm, Controller } from 'react-hook-form';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';

function ContactUs() {
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      // 將表單數據發送到後端的 /send-email 路由
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 將表單數據轉為 JSON 格式
      });

      if (response.ok) {
        // 如果伺服器成功處理請求，可以執行以下操作
        swal('感謝您的來信', '我們將盡快回覆您', 'success');

        console.log('郵件發送成功');
      } else {
        // 如果伺服器返回錯誤狀態碼，可以執行以下操作
        swal('發送失敗', '請稍後再試', 'error');
        console.error('郵件發送失敗');
      }

      // 清空表單
      reset();
    } catch (error) {
      swal('發送失敗', '請稍後再試', 'error');
      console.error('發送請求時出現錯誤', error);
    }
  };

  AOS.init({
    duration: 2000,
    once: false,
  });

  //AOS.refresh是重新整理的意思 這邊是重新整理AOS的動畫 這樣才會有動畫
  AOS.refresh();

  return (
    <div className="contactus" style={{ marginTop: '15vh' }}>
      <Helmet>
        <title>聯絡我們 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <h2>基本資訊</h2>
      <div className="container contact-items shadow">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="item Email">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="2xl"
                  style={{ color: '#ffffff', margin: '2px' }}
                />
                <h4>聯絡信箱</h4>
                <p>eliotworkmail@gmail.com</p>
              </div>
            </Col>

            <Col lg={4}>
              <div className="item Tel">
                <FontAwesomeIcon
                  icon={faPhone}
                  size="2xl"
                  style={{ color: '#ffffff', margin: '2px' }}
                />
                <h4>客服電話</h4>
                <p>03-7415761</p>
              </div>
            </Col>

            <Col lg={4}>
              <div className="item Address">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  size="2xl"
                  style={{ color: '#ffffff', margin: '2px' }}
                />
                <h4>門市地址</h4>
                <p>宜蘭縣大同區菓子路10-4號</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="housetour mt-5">
        <h2>店面介紹</h2>
        <div className="tour">
          <div className="sit1">
            <Container className="p-5">
              <Row className="mb-5 ">
                <Col lg={6} className="text-center">
                  <div>
                    <img
                      data-aos="fade-up"
                      className="shop1"
                      src={shop1}
                      alt="店面圖"
                    />
                  </div>
                </Col>

                <Col lg={6} className="in">
                  <div>
                    <ul>
                      <li data-aos="fade-up">室內舒適座位</li>
                      <li data-aos="fade-up">
                        充滿日本風情的座位區，營造寧靜、放鬆的氛圍，適合品茶閱讀或聊天
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>

              <Row className="mb-5">
                <Col lg={6} className="col1">
                  <div>
                    <ul>
                      <li data-aos="fade-up">美麗山景座位</li>
                      <li data-aos="fade-up">
                        吃著和菓子，欣賞一年四季不同的壯麗風景，感受大自然的美妙
                      </li>
                    </ul>
                  </div>
                </Col>

                <Col lg={6} className="col2 text-center">
                  <div>
                    <img
                      data-aos="fade-up"
                      className="shop2"
                      src={shop2}
                      alt="店面圖"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={6} className="text-center" data-aos="fade-up">
                  <div>
                    <img className="shop1" src={shop3} alt="店面圖" />
                  </div>
                </Col>
                <Col lg={6} className="in">
                  <div data-aos="fade-up">
                    <ul>
                      <li>日系廊台</li>
                      <li>日系建築和自然的融合，體驗日本文化與自然和諧生活</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>

      <div className="googlemap" data-aos="fade-up">
        <GoogleMap />
      </div>

      {/* ///表單 */}
      <div className="contactForm container mt-5 mb-5 " data-aos="zoom-in">
        <h2>聯絡我們</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>姓名：</label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} className="form-control" />
              )}
            />
          </div>
          <div className="form-group">
            <label>電子郵件：</label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} className="form-control" />
              )}
            />
          </div>
          <div className="form-group">
            <label>訊息：</label>
            <Controller
              name="message"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <textarea {...field} className="form-control" />
              )}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <button type="submit" className="btn-color">
              送出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
