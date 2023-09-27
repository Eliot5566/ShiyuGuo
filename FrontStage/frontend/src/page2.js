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
              <h3>
                即日起和菓子
                滿百免運活動！
              </h3>
              <p>即日起，購買和菓子滿百免運活動！不要錯過這個絕佳的機會。獲得美味的和菓子，並享受免費送貨服務。快來品嘗各種美味！</p>
             
            </div>
          </div>
        </section>

        <section className="os">
          <div className="inner set-right">
            <div className="section-obj">
              <img className="border border-5" src={b} />
            </div>
            <div className="section-content">
              <h3 className="">禮盒服務快來製作自己喜歡禮盒組合吧～</h3>
                <p>打造獨一無二的禮盒，選擇您喜愛的組合！溫馨禮物，傳遞心意。立即選購吧！</p>
            </div>
          </div>
        </section>
        <section className="os">
          <div className="inner set-left">
            <div className="section-obj">
              <img className="border border-5" src={c} />
            </div>
            <div className="section-content">
              <h3 className="">最新門市開幕</h3>
              <p>
                我們的最新門市已經開幕啦！歡迎光臨，品味新鮮美味。期待與您相見！</p>
            
            </div>
          </div>

        
        </section>
      </div>
    </div>
  );
}

export default page2;