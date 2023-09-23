import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  // useLocation用來取得網址列的query string (search)
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  // new URLSearchParams(search)會回傳一個URLSearchParams物件
  // get('redirect')會回傳query string裡redirect的值
  const redirect = redirectInUrl ? redirectInUrl : '/';
  // 如果redirectInUrl有值就用redirectInUrl，沒有就用'/'

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        pwd,
      });
      //ctxDispatch是Store.js裡的dispatch function
      //用來更新Store.js裡的state userInfo
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      //為甚麼要存放在localStorage? 因為如果不存放在localStorage userInfo會消失
      //每次重新整理頁面都會導致userInfo消失，因為重新整理頁面會導致 Store.js裡的state重置
      //data 是一個物件，裡面有name、email、isAdmin、token四個屬性 (來自於api/users/signin)

      navigate(redirect || '/');
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
      // 如果userInfo有值就導向redirect (redirect是一個字串)
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>登入</title>
      </Helmet>
      <h1 className="my-3">登入</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>帳號</Form.Label>

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
        <div className="mb-3">
          <Button type="submit">登入</Button>
        </div>
        <div className="mb-3">
          還沒有帳號嗎?{' '}
          <Link to={`/signup?redirect=${redirect}`}>創建新帳號</Link>
        </div>
      </Form>
    </Container>
  );
}
