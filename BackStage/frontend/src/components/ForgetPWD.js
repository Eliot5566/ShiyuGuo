import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios';
import { Helmet } from 'react-helmet-async';

const FORGETPWD_URL = '/forgetPWD';

const ForgetPWD = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(FORGETPWD_URL,
                JSON.stringify({ email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            setEmail('');
            navigate("/login", {replace:true});
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsg('伺服器沒有回應');
            } else if (err.response?.status === 400) {
                setErrMsg('查無此信箱');
            } else if (err.response?.status === 401) {
                setErrMsg('驗證信傳送失敗');
            } else {
                setErrMsg('登入失敗');
            }
        }
    }
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <Helmet>
                <title>忘記密碼</title>
            </Helmet>
            <section className='forgetScreen'>
                <h1 className='text-center'>忘記密碼</h1>
                <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className='form-label mt-2'>電子信箱:</label>
                    <input
                        className='form-control form-control-lg bg-light fs-6'
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <div className='d-flex justify-content-center'>
                        <button className="btn btn-primary fs-5 mt-3">傳送驗證信</button>
                        <Link to="/" className="btn btn-primary fs-5 mt-3 ms-2" replace>回到上一頁</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default ForgetPWD;
