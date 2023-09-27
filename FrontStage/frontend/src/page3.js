import React from 'react';
import './page.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function Page3() {
  return (
    <div className="flex-container  bg-light bg-opacity-75">
      <div className="aaa">
        <h1 className="VerticalText fw-bold m-2">商品種類</h1>
      </div>
      <div className="spinner">
        <p>
          {/* <div className="cube1"></div>
            <div className="cube2"></div> */}
        </p>
      </div>
      <div className="flex-slide home  ">
        <div className="flex-title flex-title-home">饅頭</div>
        <div className="flex-about flex-about-home"></div>
      </div>
      <div className="flex-slide about m-3 ">
        <div className="flex-title">大福</div>
        <div className="flex-about"></div>
      </div>
      <div className="flex-slide work m-3 ">
        <div className="flex-title">水饅頭</div>
        <div className="flex-about"></div>
      </div>
      <div className="flex-slide contact m-3 ">
        <div className="flex-title">羊羹</div>
        <div className="flex-about"></div>
      </div>

      <div className="flex-slide work2 m-3 ">
        <div className="flex-title">銅鑼燒</div>
        <div className="flex-about"></div>
      </div>
    </div>
  );
}

export default Page3;
