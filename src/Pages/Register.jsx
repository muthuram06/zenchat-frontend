import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Utils/api";

const Register = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
    const {
      username,
      email,
      password,
      confirmPassword,
    } = values;

    if (username.trim().length < 3) {
      toast.error(
        "Username must contain at least 3 characters",
        toastOption
      );
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required", toastOption);
      return false;
    }

    if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters",
        toastOption
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOption);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setLoader(true);

    try {
      const { username, email, password } = values;

      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.message, toastOption);
        return;
      }

      if (data.status === true) {
        toast.success(
          "Account created successfully!",
          toastOption
        );

        setTimeout(() => navigate("/login"), 900);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create your account.",
        toastOption
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <Page>
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header>
        <Link to="/" className="brand">
          <img src={Logo} alt="ZenChat" />
          <span>ZenChat</span>
        </Link>

        <Link to="/login" className="back">
          Already a member? <strong>Sign in</strong>
        </Link>
      </header>

      <main>
        <div className="register-card">
          <div className="heading">
            <span className="badge">CREATE YOUR ACCOUNT</span>
            <h1>Join the conversation.</h1>
            <p>
              Create your ZenChat account and start connecting
              with people instantly.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <div className="input-box">
              <FiUser />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={values.username}
                onChange={handleChange}
              />
            </div>

            <label>Email</label>
            <div className="input-box">
              <FiMail />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
              />
            </div>

            <label>Password</label>
            <div className="input-box">
              <FiLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                value={values.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <label>Confirm password</label>
            <div className="input-box">
              <FiLock />
              <input
                type={
                  showConfirmPassword ? "text" : "password"
                }
                name="confirmPassword"
                placeholder="Repeat your password"
                value={values.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            <button className="submit" type="submit">
              {loader ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="login-link">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </p>
        </div>
      </main>

      <ToastContainer />
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: white;
  background:
    radial-gradient(circle at 20% 10%, #302c69 0, transparent 30%),
    radial-gradient(circle at 90% 90%, #492052 0, transparent 30%),
    #080914;

  .orb {
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.2;
  }

  .orb-one {
    background: #7663ff;
    left: -120px;
    top: 20%;
  }

  .orb-two {
    background: #d14cff;
    right: -120px;
    bottom: -80px;
  }

  header {
    height: 76px;
    padding: 0 6%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    text-decoration: none;
    font-size: 20px;
    font-weight: 700;

    img {
      width: 36px;
    }
  }

  .back {
    color: #85899e;
    font-size: 13px;
    text-decoration: none;
  }

  .back strong {
    color: #a093ff;
  }

  main {
    min-height: calc(100vh - 76px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 20px 70px;
    position: relative;
    z-index: 1;
  }

  .register-card {
    width: 100%;
    max-width: 500px;
    padding: 40px;
    border-radius: 28px;
    border: 1px solid #ffffff12;
    background: #10121eea;
    backdrop-filter: blur(20px);
    box-shadow: 0 30px 80px #00000045;
  }

  .badge {
    color: #a294ff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
  }

  h1 {
    margin: 10px 0;
    font-size: 38px;
    letter-spacing: -1.5px;
  }

  .heading p {
    color: #7f8399;
    line-height: 1.6;
    font-size: 14px;
  }

  form {
    margin-top: 28px;
  }

  label {
    display: block;
    color: #bfc2d1;
    font-size: 12px;
    font-weight: 600;
    margin: 15px 0 7px;
  }

  .input-box {
    height: 52px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 15px;
    border-radius: 13px;
    border: 1px solid #ffffff12;
    background: #080a14;
    transition: 0.25s;
  }

  .input-box:focus-within {
    border-color: #7968ff;
    box-shadow: 0 0 0 4px #7968ff12;
  }

  .input-box > svg {
    color: #74798f;
  }

  input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: white;
    background: transparent;
    font-size: 14px;
  }

  input::placeholder {
    color: #55596e;
  }

  .input-box button {
    display: flex;
    border: none;
    background: transparent;
    color: #777c95;
    cursor: pointer;
    font-size: 17px;
  }

  .submit {
    width: 100%;
    height: 54px;
    border: none;
    border-radius: 14px;
    margin-top: 25px;
    background: linear-gradient(135deg, #7564ff, #a450e8);
    color: white;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.25s;
  }

  .submit:hover {
    transform: translateY(-2px);
  }

  .spinner {
    width: 16px;
    height: 16px;
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

  .login-link {
    text-align: center;
    color: #73778b;
    font-size: 13px;
    margin-top: 25px;
  }

  .login-link a {
    color: #a092ff;
    text-decoration: none;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    header {
      padding: 0 5%;
    }

    .back {
      display: none;
    }

    .register-card {
      padding: 28px 22px;
      border-radius: 22px;
    }

    h1 {
      font-size: 31px;
    }
  }
`;

export default Register;