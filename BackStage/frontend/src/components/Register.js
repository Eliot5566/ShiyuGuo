import { useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Transition from '../components/Transition';
import { Helmet } from 'react-helmet-async';

const NAME_REGEX = /^[A-z][A-z0-9]{7,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const PHONE_REGEX = /^(09\d{8})$/;
const REGISTER_URL = '/register';

const Register = () => {
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    useEffect(() => {
        setErrMsg('');
    }, [name, pwd, email, phone, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(name);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = PHONE_REGEX.test(phone);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("無效的輸入！");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name, pwd , email, phone}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            // console.log(response?.accessToken);
            // console.log(JSON.stringify(response))
            setSuccess(true);
            setName('');
            setPwd('');
            setEmail('');
            setPhone('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('伺服器沒有回應');
            } else if (err.response?.status === 409) {
                setErrMsg('這個帳號已經有人使用了');
            } else {
                setErrMsg('註冊失敗')
            }
        }
    }

    return (
        // 下面這個<>是 <React.Fragment> 的語法糖
        <>  
            <Helmet>
                <title>註冊</title>
            </Helmet>
            {success ? (
                <Transition>
                    <section className="container d-flex justify-content-center align-items-center vh-100 w-25 text-center">
                        <div className="row border rounded-5 p-3 bg-white shadow box-area">
                            <h1>成功！</h1>
                            <Link to="/">登入</Link>
                        </div>
                    </section>
                </Transition>
            ) : (
                <Transition>
                    <section className="container d-flex justify-content-center align-items-center vh-100">
                        <div className="row border rounded-5 p-3 bg-white shadow box-area w-screen">
                            <h1 className="text-center">註冊</h1>
                            <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="name" className="form-label">
                                    暱稱:
                                    <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    autoComplete="off"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    required
                                    onFocus={() => setNameFocus(true)}
                                    onBlur={() => setNameFocus(false)}
                                />
                                <p id="uidnote" className={nameFocus && !validName ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    8至24個字元、必須以字母開頭（不區分大小寫）、允許字母和數字
                                </p>

                                <label htmlFor="email">
                                    電子郵件:
                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    id="email"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(false)}
                                />
                                <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    必須包含用戶名、@ 符號和域名
                                </p>

                                <label htmlFor="password">
                                    密碼:
                                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    8至24個字元、必須包含至少一個小寫字母、大寫字母、一個數字、不允許特殊字符
                                </p>

                                <label htmlFor="phone">
                                    手機號碼:
                                    <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
                                </label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    id="phone"
                                    autoComplete="off"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    required
                                    onFocus={() => setPhoneFocus(true)}
                                    onBlur={() => setPhoneFocus(false)}
                                />
                                <p id="phonenote" className={phoneFocus && !validPhone ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    必須以09開頭、長度為10個數字
                                </p>

                                <label htmlFor="confirmPwd">
                                    確認密碼:
                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    id="confirmPwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    value={matchPwd}
                                    required
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                />
                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    密碼必須與一致
                                </p>
                                <button
                                    className="btn btn-primary w-100 fs-5 mt-3"
                                    disabled={!validName || !validPwd || !validMatch || !validEmail || !validPhone ? true : false}
                                    >註冊</button>
                            </form>
                            <p>已經註冊了？</p>
                            <Link to="/login">登入</Link>
                        </div>
                    </section>
                </Transition>
            )}
        </>
    )
}

export default  Register
