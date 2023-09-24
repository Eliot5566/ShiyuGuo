import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [oldPwd, setOldPwd] = useState(''); // 新增 oldPwd 狀態
  const [pwd, setPwd] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          oldPwd, // 傳遞 oldPwd 到後端
          pwd,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('使用者資料，更新成功');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="container small-container  mb-5">
      <Helmet>
        <title>會員資料 | 拾月菓</title>
      </Helmet>

      <h1 className="my-3">會員資料</h1>
      <div>
        <p>
          <strong>用戶名稱:</strong> {userInfo.name}
        </p>
        <p>
          <strong>帳號:</strong> {userInfo.email}
        </p>
      </div>
      <hr />
      <br></br>
      <h1 className="my-3">變更會員資料</h1>

      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>用戶名稱</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="email">
          <Form.Label>帳號</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group> */}
        <Form.Group className="mb-3" controlId="oldPwd">
          {' '}
          {/* 新增 oldPwd 的表單字段 */}
          <Form.Label>輸入舊密碼</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>輸入新密碼</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPwd(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>再次確認密碼</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3 ">
          <Button
            type="submit"
            style={{ background: '#9a2540' }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#b33f5a';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#9a2540';
            }}
            className="btn-color"
          >
            提交更新
          </Button>
        </div>
      </form>
    </div>
  );
}
