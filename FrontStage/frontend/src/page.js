import './page.css';
import main1 from './images/專題2/品牌2.png';

import React, { Component, useEffect } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'animate.css';

function Page() {
  // border border-dark
  return (
    <div>
      <div className="pagesContainer text background  ">
        <div>
          <img
            className="img-fluid shadow p-3 mb-5 handmade "
            src={main1}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
