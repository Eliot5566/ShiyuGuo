import React, { useState } from 'react';
import { validateEmail } from '../utils';
import swal from 'sweetalert';
import Axios from 'axios';

const ForgotPassword = () => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordEmailValid, setIsForgotPasswordEmailValid] =
    useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleForgotPasswordEmailChange = (value) => {
    setForgotPasswordEmail(value);
    setIsForgotPasswordEmailValid(validateEmail(value));
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!isForgotPasswordEmailValid) {
      swal('請輸入有效的電子郵件地址', '確認是否正確', 'error');
      return;
    }

    try {
      // 發送重置密碼郵件
      await Axios.post('/api/users/forgot-password', {
        email: forgotPasswordEmail,
      });

      setIsEmailSent(true); // 更新狀態以顯示成功消息
    } catch (error) {
      console.error(error.response.data.message);
      swal('發生錯誤', '請稍後再試', 'error');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>忘記密碼</h1>
      {isEmailSent ? (
        <p className="success-message">
          重置密碼郵件已發送到您的電子郵件地址。請檢查您的收件箱。
        </p>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit}>
          <div className="form-group">
            <label htmlFor="email">電子郵件地址</label>
            <input
              type="email"
              id="email"
              name="email"
              value={forgotPasswordEmail}
              onChange={(e) => handleForgotPasswordEmailChange(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            重置密碼
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
