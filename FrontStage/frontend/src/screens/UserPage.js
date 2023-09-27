import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';

export default function UserProfile() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  return (
    <div className="container small-container">
      <Helmet>
        <title>會員資料</title>
      </Helmet>
      <h1>使用者資料</h1>
      <div>
        <p>
          <strong>用戶名稱:</strong> {userInfo.name}
        </p>
        <p>
          <strong>帳號:</strong> {userInfo.email}
        </p>
      </div>
    </div>
  );
}
