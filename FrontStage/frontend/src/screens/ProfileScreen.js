  import React, { useContext, useReducer, useState } from 'react';
  import { Helmet } from 'react-helmet-async';
  import Form from 'react-bootstrap/Form';
  import Button from 'react-bootstrap/Button';
  import { Store } from '../Store';
  import { toast } from 'react-toastify';
  import axios from 'axios';
  import Skeleton from 'react-loading-skeleton';
  import swal from 'sweetalert';
  import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

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
    const [passwordMismatch, setPasswordMismatch] = useState(false); // 

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
      loadingUpdate: false,
    });

    const submitNameHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          '/api/users/update-name', // 假設後端提供了專門用於更新用戶名稱的API端點
          {
            name,
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
        swal('名稱更新成功', '', 'success');
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
        });
        swal('名稱更新失敗', '', 'error');
        // toast.error(err.response.data.message);
      }
    };

    const submitPasswordHandler = async (e) => {
      e.preventDefault();
    
    if (pwd !== confirmPassword) {
     swal('密碼不一致', '請重新輸入', 'error');
      setPasswordMismatch(true);
      
      return;
    }
      try {
        const { data } = await axios.put(
          '/api/users/update-password', // 假設後端提供了專門用於更新密碼的API端點
          {
            oldPwd,
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
        swal('密碼更新成功', '', 'success');
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
      <strong>用戶名稱:</strong> {userInfo ? userInfo.name : <Skeleton />}
    </p>
    <p>
      <strong>帳號:</strong> {userInfo ? userInfo.email : <Skeleton />}
    </p>
  </div>
    
        <hr />
        <br></br>
        <h1 className="my-3">變更會員資料</h1>

        <form onSubmit={submitNameHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>用戶名稱</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              更新名稱
            </Button>
          </div>
        </form>
<hr className=' mb-5'/>
        <h1 className="my-3">變更密碼</h1>

        <form onSubmit={submitPasswordHandler}>
          <Form.Group className="mb-3" controlId="oldPwd">
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
            {/* 如果還沒輸入密碼，密碼強度不會顯示 */}
            {pwd && <PasswordStrengthIndicator password={pwd} />}


            {/* <PasswordStrengthIndicator password={pwd} /> */}
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
              更新密碼
            </Button>
          </div>
        </form>
      </div>
    );
  }
