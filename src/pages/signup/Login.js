import React, { useState } from "react";
import CustomButton from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../../components/signup/loginForm";
import { LoginButtonContainer } from "../../css/LoginStyle";
import {
  setIsLoggedIn,
  setLoginFormData,
} from "../../redux/reducers/member/loginSlice";
import { getCookie, setCookie } from "../../util/cookies";
import { getApi, postApi } from "../../util/api";
import { tryFunc } from "../../util/tryFunc";
import LoginImg from '../../assets/images/login_image.jpeg'
import { Page, SideContent, SideImage, Image } from "../../css/SignupStyle";
import styled, { keyframes } from 'styled-components'

export default function Login() {

  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  const navigate = useNavigate();
  const signup = useSelector((state) => state.signup);
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const handleInputChange = (name, value) => {
    if (name === 'email') {
      handleEmailChange(value);
    } else if (name === 'password') {
      handlePasswordChange(value);
    }
  };

  const handleEmailChange = (value) => {
    dispatch(
      setLoginFormData({
        ...login.loginFormData,
        email: value,
      })
    );
  };

  const handlePasswordChange = (value) => {
    dispatch(
      setLoginFormData({
        ...login.loginFormData,
        password: value,
      })
    );
  };

  const loginFunc = async () => {
    const response = await postApi('/login', login.loginFormData);


    const header = response.headers;
    const access = await header.authorization;
    const refresh = await header.refresh;

    if (access && refresh) {
      setCookie("accessToken", access, { path: "/" });
      setCookie("refreshToken", refresh, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  };

  const fetchMemberInfo = async () => {
    const res = await getApi("/members");
    setCookie("memberId", res.data.memberId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    setCookie("profile", res.data.profileImage, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    setCookie("name", res.data.name, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    setCookie("email", res.data.email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const handleLogin = async () => {
    const errorHandlers = {
      401: (error) => {
        console.log(error.response.status);
        alert("일치하는 계정 정보가 없습니다. 이메일 혹은 비밀번호를 다시 입력하세요.");
      },
      404: (error) => {
        console.log(error.response.status);
        alert("회원 정보를 찾지 못하였습니다.");
      },
      422: (error) => {
        console.log(error.response.status);
        alert("이메일 형식이 잘못되었습니다.")
      },

      default: (error) => {
        console.error("Unknown error:", error);
        alert("Unknown Error");
      },
    };
    

    const onLoginSuccess = async () => {
      try {
        await fetchMemberInfo();
        console.log("fetchMemberInfo 완료");
        const returnUrl = params.get("returnUrl");
        dispatch(setIsLoggedIn(true));
        navigate(returnUrl || "/");
      } catch (error) {
        console.log("member 데이터 정보 읽어오기 실패");
      }
    };

    tryFunc(loginFunc, onLoginSuccess, dispatch)();


  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Page>
      <SideImage>
        <Image src={LoginImg}></Image>
      </SideImage>
      <LoginContainer>
        <div>
          <LoginForm
            onChange={handleInputChange}
            onEnter={handleLogin}
          ></LoginForm>
        </div>
        <LoginButtonContainer>
          <CustomButton
            width="40%"
            backgroundColor="#9BC1BC"
            label="로그인"
            fontSize="18px"
            onClick={handleLogin}
          />
          <SignupButton
            onClick={handleSignup}
          >
            회원가입 하러가기
          </SignupButton>
        </LoginButtonContainer>
      </LoginContainer>
    </Page>
  );
}


const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
  justify-content: center;
  margin-right: 80px;
`

const SignupButton = styled.div`
  font-weight: 700;
  cursor: pointer;
`