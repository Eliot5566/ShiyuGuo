import React from 'react';

export default function Sub() {
  return (
    <>
      {/* <head>
  
    <title>訂閱通知</title>
    
</head> */}

      <link rel="stylesheet" href="./style.css"></link>
      <h5>追蹤我們</h5>
      <form id="subscribe-form" action="/subscribe" method="post">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="請輸入電子郵件"
        />
        <button className="subButton" type="submit">
          訂閱
        </button>
      </form>
      <div id="message"></div>

      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="./script.js"></script>
    </>
  );
}
