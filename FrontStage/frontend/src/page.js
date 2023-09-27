import './page.css';
import main1 from './images/專題2/品牌2.png';

import React, { Component, useEffect } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'animate.css';

function Page() {
  // border border-dark
  return (
    <div>
      <div >
        <div>

      

<div className="container-fluid">
 <div className="row d-flex align-items-center">
  <div className="col-md-6">
    <div>
            <h1 className=" text-center fw-bold animate__animated animate__bounce  ">
              關於我們的故事
            </h1>

            <h2 className="text-center fw-bold ">「拾月菓」</h2>
            <br></br>
            <h4 className=" animate__fadeInDown  mx-5 fw-bold lh-3 ">
              日式菓子專賣店創辦於2023年資策會前端班，
              「十月」是我們學習了半年要結訓發表的月份，
              我們的團隊熱愛日本文化，於是決定創建日式點心為主題的網站，
              傳達品牌承襲日本文化、嚴選天然頂級原料的理念秉持著文化精髓中「不懈不怠、嚴謹專注」的職人精神。
            </h4>
          </div>
  </div>
  <div className="col-md-6">
        
          <img
            className="img-fluid shadow p-3 mb-5 handmade "
            src={main1}
            alt=""
          />
  </div>
 </div>
</div>


        </div> 
      </div>
    </div>
  );
}

export default Page;