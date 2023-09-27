import React, { useState } from 'react';
import './SignTest.css';
import signimg from '../images/sign1.jpg';
import signimg2 from '../images/sign2.jpg';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

export default function SignTest() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPwdValid, setIsPwdValid] = useState(false);
  const [isConfirmPwdValid, setIsConfirmPwdValid] = useState(false);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);

    //當視窗為小畫面@media (max-width: 768px)時，點擊登入或註冊按鈕後，會自動跳轉到另一個表單
    if (window.innerWidth < 768) {
      window.scrollTo(0, 0);
    }

    //當視窗為小畫面@media (max-width: 768px)時，點擊登入或註冊按鈕後，會自動跳轉到另一個表單
    if (window.innerWidth < 768) {
      window.scrollTo(0, 0);
    }
  };
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmPwd] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  /* 當視窗為小畫面時，自動點擊一次切換按鈕 */
  useEffect(() => {
    if (window.innerWidth < 768) {
      toggleForm();
    }
  }, []);

  const validatePassword = (password) => {
    // 檢查密碼是否包含大小寫字母並且至少 6 個字符長
    return /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNameChange = (value) => {
    setName(value);
    setIsNameValid(value.length >= 3);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handlePwdChange = (value) => {
    setPwd(value);
    setIsPwdValid(validatePassword(value));
  };

  const handleConfirmPwdChange = (value) => {
    setConfirmPwd(value);
    setIsConfirmPwdValid(value === pwd);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let errorMessage = '';

    if (!isNameValid) {
      errorMessage = '用戶名稱必須至少3個字元';
    } else if (!isEmailValid) {
      errorMessage = '請輸入有效的帳號 (信箱)';
    } else if (!isPwdValid) {
      errorMessage = `密碼必須包含大小寫字母，
      至少一個數字，
        且長度至少為 8 個字符`;
    } else if (!isConfirmPwdValid) {
      errorMessage = '確認密碼與密碼不一致';
    } else if (pwd !== confirmpwd) {
      errorMessage = '密碼不一致';
    } else if (pwd !== confirmpwd) {
      errorMessage = '密碼不一致';
    }

    if (errorMessage) {
      // 如果有錯誤，顯示錯誤訊息
      swal('請檢查您的資料', errorMessage, 'error');
      return;
    }

    const submitHandler = async (e) => {
      e.preventDefault();
      if (pwd !== confirmpwd) {
        // swal('請檢查您的密碼', '密碼不一致', 'error');
        // toast.error('密碼不一致');
        return;
      }

      try {
        // 此處放置註冊的 Axios 請求
      } catch (err) {
        //
        console.error(err.response.data.message);
      }
    };

    // 驗證密碼是否符合要求

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const isPasswordValid = passwordRegex.test(pwd);

    if (!isPasswordValid) {
      toast.error(
        '密碼必須包含大小寫字母，至少一個數字，且長度至少為 8 個字符'
      );
      return;
    }

    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        pwd,
      });
      //註冊成功 跳出提示訊息

      //如果註冊成功 更新頁面為登入頁面
      //設置isSignIn為false 顯示登入表單
      // setIsSignIn(!isSignIn);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      swal('註冊成功', '歡迎加入拾月菓', 'success');

      navigate(redirect || '/');
      // 如果註冊成功，導向 redirect (redirect是一個字串)
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const submitHandlerSignIn = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        pwd,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      //登入成功 跳出提示訊息
      swal('登入成功', '歡迎回來', 'success');
      navigate(redirect || '/');
    } catch (err) {
      // 登入失敗 跳出提示訊息
      swal('登入失敗', '請檢查您的帳號密碼', 'error');

      console.log(err.response.data.message);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
      // 如果userInfo有值就導向redirect (redirect是一個字串)
    }
  }, [navigate, redirect, userInfo]);

  return (
    <>
      <Helmet>
        <title>註冊登入頁面 | 拾月菓</title>
        <meta name="description" content="拾月菓" />
      </Helmet>
      <div className="signcontainer ">
        <div className="welcome">
          <div
            className="pinkbox"
            style={{
              transform: isSignIn ? 'translateX(0%)' : 'translateX(80%)',
            }}
          >
            {isSignIn ? (
              <div className="signin">
                <h1 className="signh1">登入</h1>
                <form
                  className="more-padding signform"
                  autoComplete="off"
                  // onClick={submitHandlerSignIn}
                >
                  {/* 驗證符號 */}
                  <input
                    className="signinput"
                    type="email"
                    required
                    placeholder="帳號"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    className="signinput"
                    type="password"
                    required
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="密碼"
                  />

                  {/* <div className="checkbox">
                  <input className="signinput" type="checkbox" id="remember" />
                  <label htmlFor="remember">remember me</label>
                </div> */}
                  <button
                    className="signbutton "
                    onClick={submitHandlerSignIn}
                    type="submit"
                  >
                    確認
                  </button>
                </form>
              </div>
            ) : (
              <div className="signup">
                <h1 className="signh1">註冊</h1>
                <form
                  className="signform"
                  autoComplete="off"
                  onSubmit={submitHandler}
                >
                  <input
                    className="signinput placeholder-text"
                    type="text"
                    placeholder="用戶名稱 至少3個字元"
                    required
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  {isNameValid ? (
                    <span className="validation-check">&#10004;</span>
                  ) : (
                    <span className="validation-cross">&#10008;</span>
                  )}

                  <input
                    className="signinput placeholder-text"
                    type="email"
                    placeholder="帳號 (信箱)"
                    required
                    onChange={(e) => handleEmailChange(e.target.value)}
                  />
                  {isEmailValid ? (
                    <span className="validation-check">&#10004;</span>
                  ) : (
                    <span className="validation-cross">&#10008;</span>
                  )}

                  <input
                    className="signinput placeholder-text"
                    type="password"
                    placeholder="密碼至少8個字元 包含大小寫字母和數字"
                    required
                    onChange={(e) => handlePwdChange(e.target.value)}
                  />
                  {pwd && <PasswordStrengthIndicator password={pwd} />}
                  {isPwdValid ? (
                    <span className="validation-check">&#10004;</span>
                  ) : (
                    <span className="validation-cross">&#10008;</span>
                  )}

                  <input
                    className="signinput placeholder-text"
                    type="password"
                    placeholder="確認密碼"
                    required
                    onChange={(e) => handleConfirmPwdChange(e.target.value)}
                  />
                  {isConfirmPwdValid ? (
                    <span className="validation-check">&#10004;</span>
                  ) : (
                    <span className="validation-cross">&#10008;</span>
                  )}

                  <button className="signbutton signsubmit" type="submit">
                    確認
                  </button>
                </form>
              </div>
            )}
          </div>
          <div className="leftbox">
            <h2 className="signtitle">
              <span className="signspan">Japanes</span>&amp;
              <br />
              Sweets
            </h2>
            <p id="signp" className="signdesc">
              Satisfy your <span className="signspan">taste buds</span>
            </p>
            <img
              className="flower smaller"
              src={signimg}
              alt="兔兔"
              border={0}
            />
            <p id="signp" className="signaccount">
              已經有帳號了嗎?
            </p>
            <button className="signbutton" onClick={toggleForm}>
              {isSignIn ? '登入' : '登入'}
            </button>
          </div>
          <div className="rightbox">
            <h2 className="signtitle">
              <span className="signspan leftpart">Japanes</span>&amp;
              <br />
              Sweets
            </h2>
            <p id="signp" className="signdesc leftpart">
              {' '}
              Satisfy your <span className="signspan leftpart">taste buds</span>
            </p>
            <img className="flower" src={signimg2} alt="" />
            <p id="signp" className="signaccount">
              還沒有帳號嗎?
            </p>
            <button className="signbutton" onClick={toggleForm}>
              {isSignIn ? '註冊' : '註冊'}
            </button>
          </div>
        </div>
        {/* 當視窗為小畫面@media (max-width: 768px) 新增一個按鈕來切換登入註冊*/}
        {/* 當視窗為小畫面時，自動點擊一次切換按鈕 */}

        {window.innerWidth < 768 && (
          <div className="toggle-btn signbutton2">
            <button className="signbutton" onClick={toggleForm}>
              {isSignIn ? '註冊' : '註冊'}
            </button>
          </div>
        )}

        {window.innerWidth}
      </div>
    </>
  );
}
