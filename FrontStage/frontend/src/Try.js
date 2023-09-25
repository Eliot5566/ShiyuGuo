import React from 'react';
import './Try.css';
function Try() {
  return (
    <>
      <div className="container ">
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
            <div className="section-obj">
              <img src="https://cl.ly/qPkG/section1.png" />
            </div>
            <div className="section-content">
              <h3 className="">
                即日起和菓子
                <br />
                滿百免運活動!!!
              </h3>
              <p>
                {/* Lorem Ipsum is not simply random text. It has roots in a piece of
            classical Latin literature from 45 BC, making it over 2000 years old.
            Richard McClintock, a Latin professor at Hampden-Sydney */}
              </p>
            </div>
          </div>
        </section>

        <section className="os">
          <div className="inner set-right">
            <div className="section-obj">
              <img src="https://cl.ly/qPWj/section2.png" />
            </div>
            <div className="section-content">
              <h3 className="">禮盒服務快來製作自己喜歡禮盒組合吧～</h3>
              <p>
                {/* Lorem Ipsum is not simply random text. It has roots in a piece of
            classical Latin literature from 45 BC, making it over 2000 years old.
            Richard McClintock, a Latin professor at Hampden-Sydney */}
              </p>
            </div>
          </div>
        </section>
        <section className="os">
          <div className="inner set-left">
            <div className="section-obj">
              <img src="https://cl.ly/qR5L/section3.png" />
            </div>
            <div className="section-content">
              <h3 className="">最新門市開幕喽</h3>
              <p>
                {/* Lorem Ipsum is not simply random text. It has roots in a piece of
            classical Latin literature from 45 BC, making it over 2000 years old.
            Richard McClintock, a Latin professor at Hampden-Sydney */}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Try;
