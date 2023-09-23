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
      <h1 className="my-3">使用者資料</h1>
      <div>
        <p>
          <strong>用戶名稱:</strong> {userInfo.name}
        </p>
        <p>
          <strong>帳號:</strong> {userInfo.email}
        </p>
        <p>
          {/* <strong>註冊日期:</strong>{' '}
          {new Date(userInfo.createdAt).toLocaleDateString()} */}
        </p>
        {/* 在這裡顯示其他使用者相關的資訊 */}
      </div>
    </div>
  );
}
