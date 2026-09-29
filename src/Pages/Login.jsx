import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiMessageCircle,
} from "react-icons/fi";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Utils/api";

const Login = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [navigate]);

  const toastOption = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleValidation = () => {
    const { username, password } = values;

    if (!username.trim()) {
      toast.error("Username is required", toastOption);
      return false;
    }

    if (!password) {
      toast.error("Password is required", toastOption);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setLoader(true);

    try {
      const { username, password } = values;

      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.message, toastOption);
        return;
      }

      if (data.status === true) {
        localStorage.setItem(
          "chat-app-user",
          JSON.stringify(data.user)
        );

        if (data.user.isAvatarImage) {
          navigate("/");
        } else {
          navigate("/avatar");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to connect to ZenChat. Please try again.",
        toastOption
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <Page>
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <div className="topbar">
        <div className="mini-brand">
          <img src={Logo} alt="ZenChat" />
          <span>ZenChat</span>
        </div>

        <span className="secure-text">● Secure messaging</span>
      </div>

      <Main>
        <section className="hero">
          <div className="hero-content">
            <div className="icon-box">
              <FiMessageCircle />
            </div>

            <p className="eyebrow">WELCOME TO ZENCHAT</p>

            <h1>
              Conversations
              <span> without limits.</span>
            </h1>

            <p className="description">
              Connect with your people, share your thoughts,
              and keep every conversation flowing in real time.
            </p>

            <div className="features">
              <div>
                <span>✓</span>
                Real-time messaging
              </div>

              <div>
                <span>✓</span>
                Simple and private
              </div>

              <div>
                <span>✓</span>
                Built for everyone
              </div>
            </div>
          </div>
        </section>

        <section className="login-section">
          <div className="login-card">
            <div className="card-heading">
              <p>WELCOME BACK</p>
              <h2>Sign in to ZenChat</h2>
              <span>Continue your conversations.</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Username</label>

              <div className="input-wrapper">
                <FiUser />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={values.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>

              <label>Password</label>

              <div className="input-wrapper">
                <FiLock />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button
                className="login-button"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span />
              <p>OR</p>
              <span />
            </div>

            <p className="register-text">
              Don't have an account?
              <Link to="/register"> Create one</Link>
            </p>
          </div>
        </section>
      </Main>

      <footer>© {new Date().getFullYear()} ZenChat</footer>

      <ToastContainer />
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 15% 20%, #30306b 0, transparent 28%),
    radial-gradient(circle at 85% 80%, #44245c 0, transparent 30%),
    #080914;

  .background-orb {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.25;
    pointer-events: none;
  }

  .orb-one {
    background: #6d5dfc;
    top: -100px;
    left: -80px;
  }

  .orb-two {
    background: #c855ff;
    right: -100px;
    bottom: -100px;
  }

  .topbar {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6%;
    position: relative;
    z-index: 2;
  }

  .mini-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;

    img {
      width: 36px;
      height: 36px;
    }
  }

  .secure-text {
    color: #9296aa;
    font-size: 13px;
  }

  footer {
    position: absolute;
    bottom: 20px;
    left: 6%;
    color: #696d82;
    font-size: 12px;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 76px);
  width: 88%;
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  align-items: center;
  gap: 70px;
  position: relative;
  z-index: 1;

  .hero {
    padding-bottom: 30px;
  }

  .hero-content {
    max-width: 550px;
  }

  .icon-box {
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    background: linear-gradient(135deg, #705cff, #a34cff);
    box-shadow: 0 15px 40px #6957ff30;
    font-size: 25px;
    margin-bottom: 30px;
  }

  .eyebrow {
    color: #9f8cff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    margin-bottom: 15px;
  }

  h1 {
    font-size: clamp(44px, 5vw, 72px);
    line-height: 1.02;
    letter-spacing: -3px;
    margin: 0;
  }

  h1 span {
    color: #9b8cff;
  }

  .description {
    color: #9699ad;
    font-size: 17px;
    line-height: 1.7;
    max-width: 500px;
    margin: 25px 0;
  }

  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    color: #bfc1ce;
    font-size: 13px;
  }

  .features div {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .features span {
    color: #8d7cff;
    font-weight: bold;
  }

  .login-section {
    display: flex;
    justify-content: center;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    padding: 38px;
    border: 1px solid #ffffff12;
    border-radius: 28px;
    background: #10121ee8;
    box-shadow:
      0 30px 80px #00000045,
      inset 0 1px 0 #ffffff0b;
    backdrop-filter: blur(20px);
  }

  .card-heading p {
    color: #9b8cff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .card-heading h2 {
    font-size: 30px;
    margin: 0 0 8px;
  }

  .card-heading span {
    color: #777b91;
    font-size: 14px;
  }

  form {
    margin-top: 30px;
  }

  label {
    display: block;
    color: #bfc2d1;
    font-size: 13px;
    font-weight: 600;
    margin: 18px 0 8px;
  }

  .input-wrapper {
    height: 54px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 15px;
    border: 1px solid #ffffff12;
    border-radius: 14px;
    background: #080a14;
    transition: 0.25s;
  }

  .input-wrapper:focus-within {
    border-color: #7868ff;
    box-shadow: 0 0 0 4px #7868ff12;
  }

  .input-wrapper > svg {
    color: #777c95;
    flex-shrink: 0;
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-size: 14px;
  }

  input::placeholder {
    color: #565a70;
  }

  .password-toggle {
    border: none;
    background: transparent;
    color: #777c95;
    cursor: pointer;
    display: flex;
    font-size: 18px;
  }

  .login-button {
    width: 100%;
    height: 54px;
    border: none;
    border-radius: 14px;
    margin-top: 28px;
    background: linear-gradient(135deg, #7564ff, #a450e8);
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: 0.25s;
    box-shadow: 0 15px 30px #715cff25;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 35px #715cff35;
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 17px;
    height: 17px;
    border: 2px solid #ffffff55;
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 20px;
  }

  .divider span {
    flex: 1;
    height: 1px;
    background: #ffffff0d;
  }

  .divider p {
    color: #55596d;
    font-size: 10px;
  }

  .register-text {
    text-align: center;
    color: #777b90;
    font-size: 13px;
  }

  .register-text a {
    color: #a091ff;
    text-decoration: none;
    font-weight: 700;
  }

  @media (max-width: 850px) {
    width: 92%;
    grid-template-columns: 1fr;
    padding: 30px 0 70px;

    .hero {
      display: none;
    }

    .login-section {
      width: 100%;
    }

    .login-card {
      max-width: 500px;
    }
  }

  @media (max-width: 500px) {
    .login-card {
      padding: 28px 22px;
      border-radius: 22px;
    }

    .topbar {
      padding: 0 5%;
    }

    .secure-text {
      display: none;
    }
  }
`;

export default Login;