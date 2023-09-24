import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import '../index.css';
import 'jquery-ui/themes/base/all.css'; // 匯入 jQuery UI 的 CSS 文件
import 'jquery-ui/ui/widgets/accordion'; // 匯入 jQuery UI 的 accordion 模組
import Background from '../components/Background';
import { Helmet } from 'react-helmet-async';

function FAQ() {
  useEffect(() => {
    $('#accordion').accordion();
  }, []);

  return (
    <>
      <Helmet>
        <title>FAQ | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <div
        className="fs-1 mb-3 text-center fw-bolder"
        style={{
          color: 'rgb(78, 78, 78)',
          marginTop: '10rem',
        }}
      >
        常見問題&nbsp;FAQ
      </div>
      <div
        className="container rounded-3 p-5"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          fontSize: '1.2rem',
          width: '100vw',
          height: '500px',
          overflow: 'hidden',
          marginBottom: '15rem',
        }}
      >
        <div id="accordion">
          <p>Q：產品購買數量有無限制？</p>
          <div>
            <p>
              官網單個商品可購買數量，上限為20個，如有更多需求，請洽客服電話提前預購。
            </p>
          </div>

          <p>Q：產品如何保存？</p>
          <div>
            <p>
              冷凍、冷藏商品收貨30分鐘內放入冰箱保存，冷凍保存期限印製於產品包裝上，冷藏兩日內食用完畢。常溫商品陰涼處存放即可。
            </p>
          </div>

          <p>Q：產品如何食用？</p>
          <div>
            <p>
              銅鑼燒室溫下退冰10-15分、大福室溫下退冰30分。口感近似冰淇淋，冷藏保存期限為兩天，請趁鮮享用。
            </p>
          </div>

          <p>Q：運費如何計算？</p>
          <div>
            <p>
              本島宅配運費計算方式：消費$1500元以下，運費$150、消費$1501-$3000元，運費$220、消費$3001元以上，免運費。
            </p>
          </div>

          <p>Q：商品包裝是紙盒還是保麗龍盒？</p>
          <div>
            <p>
              為提倡環保，皆以紙盒包裝出貨，若需加購保麗龍盒請於下單後來電，將由專人為您處理，謝謝。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FAQ;
