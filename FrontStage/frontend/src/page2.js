import React from 'react';
import './Try.css';
import a from './images/最新消息1.png';
import b from './images/最新消息2.png';
import c from './images/最新消息3.png';
function page2() {
  return (
    <div className='background3'>
      <div className="container bg-light bg-opacity-75 ">
        {/* <header className="hero os">
      <hgroup>
        <h2 className="textTry vintage">VINTAGE</h2>
        <h2 className="textTry illustration">ILLUSTRATION</h2>
        <h2 className="textTry nature">NATURE</h2>
        <div className="flowerTry" />
        <div className="frame" />
      </hgroup>
    </header> */}
        <section className="os">
          <div className="inner set-left align-items-center">
            <br />
            <div>
              <h1 className="text-with-shadow fw-bold">最新活動</h1>
            </div>
            <br />
            <div className="section-obj ">
              <img className="border border-5 " src={a} />
            </div>
            <div className="section-content">
              <h4>🎉 滿百免運！即日起至12月底 🎉</h4>
              <p>
                自即日起直到今年12月底為止，我們將推出「滿百免運活動」，無論您是購買自己所需的商品，還是送給家人朋友，現在都是最佳時機！
              </p>
            </div>
          </div>
        </section>

        <section className="os">
          <div className="inner set-right">
            <div className="section-obj">
              <img className="border border-5" src={b} />
            </div>
            <div className="section-content">
              <h3>🎁 客製禮盒服務 🎁</h3>
              <p>
                快來打造獨一無二的禮盒，選擇您喜愛的產品組合，並將您的心意送給親朋好友。
              </p>
            </div>
          </div>
        </section>
        <section className="os">
          <div className="inner set-left">
            <div className="section-obj">
              <img className="border border-5" src={c} />
            </div>
            <div className="section-content">
              <h3>🎉 第一家門市盛大開幕！🎉</h3>
              <p>
                我們的第一家門市現已隆重開幕啦！誠摯地邀請您共同慶祝這個重要時刻。
              </p>
            </div>
          </div>


        </section>
      </div>
    </div>
  );
}

export default page2;