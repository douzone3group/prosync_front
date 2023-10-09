import React, { useState } from "react";
import { InputContent, LabelContent } from "../../css/LoginStyle";
import {
  DivContainer,
  Page,
  SideContent,
  SideImage,
  Image,
  VerifyCodeContainer,
  VerifyCodeButton
} from "../../css/SignupStyle";
import Button from "../button/Button";
import signupImage from '../../util/signup.png';
import DoubleCheck from "./DoubleCheck";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setFormData, setIsConfirmModalOpen, setIsEmailValid, setIsPasswordMatch, setIsVerfied, setModalButtons, setModalMessage, setVerifiedPassword } from "../../redux/reducers/member/signupSlice";
import ConfrimButton from './ConfirmButton'
import { axiosInstance } from '../../util/axiosInstances'
import { postApi } from "../../util/api";
import { emailValidate, nameValidate, passwordValidate } from "../../util/regex";
import { useEffect } from "react";
import EmailCheck from "./EmailCheck";
import VerifyCheck from "./VerifyCheck";
import NameCheck from "./NameCheck";
import PasswordCheck from "./PasswordCheck";






export default function SignupForm() {
  const dispatch = useDispatch();
  const signup = useSelector((state) => state.signup);
  const navi = useNavigate();

  const [isVerifyCodeVisible, setIsVerifyCodeVisible] = useState(false);
  const [isVerifyCodeButtonVisible, setIsVerifyCodeButtonVisible] = useState(false);
  const location = useLocation();
  const [isNameNotCorrect, setIsNameNotCorrect] = useState(false);
  const [isPasswordNotCorrect, setIsPasswordNotCorrect] = useState(false);

  useEffect(() => {
    dispatch(setFormData({
      email: "",
      password: "",
      name: "",
      certificationNumber : "",
  }));
    dispatch(setVerifiedPassword( {
      verifypassword: "",
  },));
    dispatch(setIsEmailValid(false));
    dispatch(setIsPasswordMatch(false));
  }, [location]);

  const handleInputChange = (event) => {

    if (event.target.name === "email") {
      dispatch(
        setFormData({
          ...signup.formData,
          email: event.target.value,
        })
      );
    } else if (event.target.name === 'name') {
      dispatch(
        setFormData({
          ...signup.formData,
          name: event.target.value,
        })
      );
    } else if (event.target.name === 'password') {
      dispatch(
        setFormData({
          ...signup.formData,
          password: event.target.value,
        })
      );
    } else if (event.target.name === 'verifypassword') {
      dispatch(
        setVerifiedPassword({
          ...signup.verifiedPassword,
          verifypassword: event.target.value,
        })
      );
    }
    else if (event.target.name === "certificationNumber") {
      dispatch(
        setFormData({
          ...signup.formData,
          certificationNumber: event.target.value,
        })
      )
    }

  };

  const handleCreateButtonClick = () => {
    console.log('signup.formData');
    console.log(signup.formData);

     if (!nameValidate(signup.formData.name)) {

      if (passwordValidate(signup.formData.password)) {
        setIsPasswordNotCorrect(false);
      } else {
        setIsPasswordNotCorrect(true);
      }
        alert("이름의 형식이 잘못되었습니다. 실명을 적어주시고 7글자 이하로 입력하세요.");
      return;
      
      
    } 
    
    setIsNameNotCorrect(false);
    
    if (!passwordValidate(signup.formData.password)) {
      
        alert("비밀번호 형식이 잘못되었습니다. 특수문자를 포함한 8~15 글자로 입력하세요.");

      return;
    }

    setIsPasswordNotCorrect(false);


    postApi('/signup', signup.formData)
      .then(() => {
        alert("회원가입에 성공하셨습니다!");
        navi("/login");
      }).catch((error) => {

        if (error.response.status===422 && error.response.data.resultCode==="INCORRECT_FORMAT_EMAIL") {
          alert("잘 못된 이메일 형식입니다.")
          return;

        }

        if (error.response.status===422 && error.response.data.resultCode==="INCORRECT_FORMAT_PASSWORD") {
          alert("비밀번호 형식이 잘못되었습니다. 특수문자를 포함한 8~15 글자로 입력하세요.")
          return;
        }

        if (error.response.status===422 && error.response.data.resultCode==="INCORRECT_FORMAT_NAME") {
          alert("이름의 형식이 잘못되었습니다. 실명을 적어주시고 7글자 이하로 입력하세요.")
        }
        
        alert("빈칸 없이 입력해주세요.");
      });

  }

  const handleIdCheckButtonClick = async () => {

   
      if (!emailValidate(signup.formData.email)) {
        alert("이메일 형식이 잘못되었습니다. 다시 입력해주세요.")
      return;
      }
      
    

    
      postApi('/idcheck', signup.formData)
        .then((res) => {
          console.log(res.data);
            alert('사용하실 수 있는 이메일입니다.');
            dispatch(setIsEmailValid(true));
        }).catch((error) => {
          console.log(error);
          if (error.response.status===422 && error.response.data.resultCode==="INCORRECT_FORMAT_EMAIL") {
            alert('잘못된 이메일 형식입니다.');
            return;
          }

          if (error.response.status===409 && error.response.data.resultCode==="DUPLICATED_USER_ID") {
            alert("중복된 이메일입니다.")
          }
        })
    
  }

  const handleVerifiedEmail = async () => {

    if (!signup.isEmailValid) {
      alert("이메일 입력을 먼저 하세요.");
        return;
    }

    axiosInstance.post("/send_verification", signup.formData)
      .then(async (res) => {
        alert("전송되었습니다.")
        setIsVerifyCodeVisible(!isVerifyCodeVisible);

      }).catch(error => {
        alert("인증번호가 잘못되었습니다.")
        console.log(error);
      })

  }

  const handleVerifiedCodeSendToServer = () => {
    axiosInstance.post("/verify_code", signup.formData)
      .then(async (res) => {
        alert('인증 번호가 일치합니다');
        setIsVerifyCodeButtonVisible(true);

      })
      .catch(error => {
        console.log(error);
        alert("인증번호가 일치하지 않습니다.");
        
      })
  }

  return (
    <>
      <Page>
        <SideImage>
          <Image src={signupImage}></Image>
        </SideImage>

        <SideContent>
          <LabelContent>E-mail</LabelContent>
          <DivContainer>
            <InputContent
              onChange={handleInputChange}
              readOnly={signup.isEmailValid}
              type="email"
              name="email"
              id="email"
            />
            <ConfrimButton
              onClick={handleIdCheckButtonClick}
              disabled={signup.isEmailValid}
            >중복확인</ConfrimButton>
            <EmailCheck/>
          </DivContainer>


          <DivContainer>
            <LabelContent>Verify Code</LabelContent>
            <Button
              backgroundColor={isVerifyCodeButtonVisible ? "gray" :"#7B69B7"}
              label="전송"
              width="18%"
              height="2.2rem"
              onClick={handleVerifiedEmail}
              disabled={isVerifyCodeButtonVisible}
            />
          </DivContainer>

          <VerifyCodeContainer isVisible={isVerifyCodeVisible}>
            <DivContainer>
              <InputContent
                onChange={handleInputChange}
                type="text"
                name="certificationNumber"
                id="certificationNumber"
                readOnly={isVerifyCodeButtonVisible}
              />
              <VerifyCodeButton
                backgroundColor={isVerifyCodeButtonVisible ? "gray" : "#7B69B7"}
                label="인증번호 확인"
                width="18%"
                height="2.2rem"
                onClick={handleVerifiedCodeSendToServer}
                disabled={isVerifyCodeButtonVisible}
              />
              <VerifyCheck isVerifyCodeButtonVisible={isVerifyCodeButtonVisible}/>
            </DivContainer>
          </VerifyCodeContainer>


          <LabelContent>Name</LabelContent>
          <InputContent
            onChange={handleInputChange}
            type="text"
            name="name"
            id="name"
          />
          <NameCheck isNameNotCorrect={isNameNotCorrect}/>

          <LabelContent>Password</LabelContent>
          <InputContent
            onChange={handleInputChange}
            type="password"
            name="password"
            id="password"
          />
          <PasswordCheck isPasswordNotCorrect={isPasswordNotCorrect}/>

          <LabelContent>Confirm Password</LabelContent>
          <DivContainer>
            <InputContent
              onChange={handleInputChange}
              type="password"
              name="verifypassword"
              id="verifypassword"
            />
            <DoubleCheck
              First={signup.formData.password}
              Second={signup.verifiedPassword.verifypassword}
            ></DoubleCheck>
          </DivContainer>
          <Button
            backgroundColor={signup.isEmailValid && signup.isPasswordMatch && isVerifyCodeButtonVisible ? "#7B69B7" : "gray"}
            label="생성"
            onClick={handleCreateButtonClick}
            disabled={!(signup.isEmailValid && signup.isPasswordMatch && isVerifyCodeButtonVisible)}
            modalCheck='생성'
          ></Button>
        </SideContent>
      </Page>
    </>
  );
}