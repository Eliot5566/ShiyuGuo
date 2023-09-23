import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function SignupScreen() {
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
  const submitHandler = async (e) => {
    e.preventDefault();
    if (pwd !== confirmpwd) {
      toast.error('密碼不一致');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        pwd,
      });

      // 在注册成功后，将用户令牌存储在本地存储中
      localStorage.setItem('userInfo', JSON.stringify(data));

      // ctxDispatch 是 Store.js 中的 dispatch 函数
      // 用来更新 Store.js 中的 state userInfo
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });

      //ctxDispatch是Store.js裡的dispatch function
      //用來更新Store.js裡的state userInfo
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>註冊新帳號</title>
      </Helmet>
      <h1 className="my-3">註冊新帳號</h1>

      <Form onSubmit={submitHandler}>
        {/* //新增name */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>姓名</Form.Label>

          <Form.Control
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        {/* //新增name */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>信箱</Form.Label>

          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>密碼</Form.Label>

          <Form.Control
            type="password"
            required
            onChange={(e) => setPwd(e.target.value)}
          />
        </Form.Group>
        {/* //新增confirmpassword */}
        <Form.Group className="mb-3" controlId="confirmpwd">
          <Form.Label>再輸入一次密碼</Form.Label>

          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">送出</Button>
        </div>
        <div className="mb-3">
          已經有帳號了嗎?{' '}
          <Link to={`/signin?redirect=${redirect}`}>前往登入</Link>
        </div>
      </Form>
    </Container>
  );
}
