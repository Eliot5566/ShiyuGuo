import React from 'react';
import './contactus.css';
import banner from '../images/shop-pic/店面圖banner.jpeg';
import shop1 from '../images/shop-pic/店面圖7.jpg';
import shop2 from '../images/shop-pic/店面圖5.jpeg';
import shop3 from '../images/shop-pic/店面圖2.jpeg';
import swal from 'sweetalert';
import GoogleMap from '../components/GoogleMap';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

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
  return (
    <div className="contactus">
      <Helmet>
        <title>聯絡我們 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <img
        className="banner"
        src={banner}
        alt="店面圖"
        style={{ width: '100%' }}
      />
      <h2>聯絡我們</h2>
      <div className="container contact-items">
        <div className="item Email">
          <h4>聯絡信箱</h4>
          <p>octmoon@octmoon.com</p>
        </div>
        <div className="item Tel">
          <h4>客服電話</h4>
          <p>03-11112222</p>
        </div>
        <div className="item Address">
          <h4>門市地址</h4>
          <p>宜蘭縣大同區菓子路10巷4號</p>
        </div>
      </div>
      <div className="housetour">
        <h2>店面介紹</h2>
        <div className="tour">
          <div className="sit1">
            <img className="shop1" src={shop1} alt="店面圖" />
            <ul>
              <li>室內舒適座位</li>
              <li>
                充滿日本風情的座位區，營造寧靜、放鬆的氛圍，適合品茶閱讀或聊天
              </li>
            </ul>
          </div>
          <div className="sit1">
            <ul>
              <li>美麗山景座位</li>
              <li>吃著和菓子，欣賞一年四季不同的壯麗風景，感受大自然的美妙</li>
            </ul>
            <img className="shop2" src={shop2} alt="店面圖" />
          </div>
          <div className="sit1">
            <img className="shop1" src={shop3} alt="店面圖" />
            <ul>
              <li>日系廊台</li>
              <li>日系建築和自然的融合，體驗日本文化與自然和諧生活</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="googlemap">
        <GoogleMap />
      </div>

      {/* ///表單 */}
      <div className="contactus container mt-5 mb-5">
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
