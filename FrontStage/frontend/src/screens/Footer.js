import React from 'react';
// import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import Sub from './Sub';
import logo from '../images/專題2/拾月菓logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLine } from '@fortawesome/free-brand-svg-icons'
import { faLine } from '@fortawesome/free-brands-svg-icons';
import { faSquareInstagram } from '@fortawesome/free-brands-svg-icons';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-12">
            <div className="footer-item">
              <ul>
                <h5 className="fs-5">關注我們</h5>
                <div className="icon">
                  <li className="icons">
                    <Link className="nav-link  " to="https://line.me/zh-hant/">
                      <FontAwesomeIcon
                        icon={faLine}
                        size="2xl"
                        style={{ color: '#e08685' }}
                      />
                    </Link>
                  </li>
                  <li className="icons">
                    <Link className="nav-link  " to="https://line.me/zh-hant/">
                      <FontAwesomeIcon
                        icon={faSquareInstagram}
                        size="2xl"
                        style={{ color: '#e08685' }}
                      />
                    </Link>
                  </li>
                  <li className="icons">
                    <Link className="nav-link  " to="https://www.facebook.com/">
                      <FontAwesomeIcon
                        icon={faSquareFacebook}
                        size="2xl"
                        style={{ color: '#e08685' }}
                      />
                    </Link>
                  </li>
                  <li className="icons">
                    <Link className="nav-link  " to="https://twitter.com/">
                      <FontAwesomeIcon
                        icon={faSquareTwitter}
                        size="2xl"
                        style={{ color: '#e08685' }}
                      />
                    </Link>
                  </li>
                </div>
              </ul>
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="footer-item">
              <ul>
                <h5 className="fs-5">門市據點</h5>
                <li>地址:宜蘭縣大同區菓子路10巷4號</li>
                <li>營業時間：每週四至週二11:00-18:00</li>
                <li>拾月菓股份有限公司 統編：55667788</li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 col-sm-12">
            <div className="footer-item">
              <ul>
                <h5 className="fs-5">聯絡我們</h5>
                <li>電話 : 03-2232-1010</li>
                <li>Email : octmoon@octmoon.com</li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 col-sm-12">
            <div className="footer-item footer-subs">
              <ul>
                {/* <h4>訂閱電子報</h4> */}
                <Sub />
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="conpyright">conpyright &copy;2023 拾月菓</div>
    </footer>
  );
}

export default Footer;
