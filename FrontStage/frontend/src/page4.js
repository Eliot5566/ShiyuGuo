import React from 'react';
import './gift.css';
import cakepackage from './images/專題2/包裝圖片.png'; // 导入图片
import step1 from './images/專題2/step1.png';
import step2 from './images/專題2/step2.png';
import step3 from './images/專題2/step3.png';
import arrow from './images/專題2/箭頭.png';
import step4 from './images/專題2/logo圖標.png';
// import { Link } from 'react-router-dom';
function page4() {
  return (
    <div>
    <div className='GiftBoxes main4'>
      <h1 className="card-title fw-bold">客製化禮物盒</h1>

      <div className="container-fluid ">
        <div className="row m-5">
          <div className="col-md-5">
            <img
              className="card-img-top shadow p-3 img4"
              src={cakepackage}
              alt="包裝圖片"
            />
          </div>
          <div className="col-md-7  d-flex justify-content-center ">
            <div className="row align-items-center">
              <div className="col ">
              
                <img
                  className=" m-2 img-fluid"
                  src={step1}
                  alt="客製化禮盒"
                  style={{ width: '120px' }}
                />
                
                <p>選擇禮物規格</p>
                <img
                  className="arrow"
                  src={arrow}
                  alt="方向"
                  style={{ width: '70px' }}
                />
              </div>

              <div className="col ">
                <img
                  className="m-2 img-fluid"
                  src={step2}
                  alt="客製化禮盒"
                  style={{ width: '130px' }}
                />

                <p>選擇商品</p>
                <img
                  className="arrow arrow2"
                  src={arrow}
                  alt="方向"
                  style={{ width: '70px' }}
                />
              </div>
              <div className="col ">
                <img
                  className="m-2 img-fluid"
                  src={step3}
                  alt="客製化禮盒"
                  style={{ width: '120px' }}
                />
                <br />
                <p>選擇貼心小卡</p>
                <img
                  className="arrow"
                  src={arrow}
                  alt="方向"
                  style={{ width: '70px' }}
                />
              </div>
              <div className="col ">
                <img
                  className="m-2 img-fluid"
                  src={step4}
                  alt="客製化禮盒"
                  style={{ width: '130px' }}
                />

                <h3>
                  完成
                  <br />
                  <br />
                  <br />
                </h3>
              </div>
            </div>
            
          </div>
          <div className="row">
          <div className="col-md-12">
            <a href="/giftbox" className="btn btn-danger bbb">
              開始製作禮物盒
            </a>
          </div>
        </div>
        </div>
        
      </div>
    </div>
    </div>
  );
}

export default page4;