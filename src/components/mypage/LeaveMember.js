import React, { useState } from 'react'
import Button from '../button/Button'
import styled from 'styled-components'
import { InputText } from '../../css/MyPageStyle'
import { deleteApi } from '../../util/api'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import DeleteImg from '../../assets/icon/mypage_icon5.png'
import { setIsLoggedIn } from '../../redux/reducers/member/loginSlice'
import { removeUserCookie } from './../../util/cookies';



const CustomStyle = {
  border: "3px blue solid",
  width: "30vw",
  height: "3vw",
  fontSize: "20px",
  fontStyle: "italic",
};

export default function LeaveMember() {
  const [inputMessage, setInputMessage] = useState("");
  const navi = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputMessage(e.target.value);
    console.log(inputMessage);
  };

  console.log(inputMessage);

  const handleLeaveMember = () => {
    if (inputMessage === "탈퇴합니다") {
      deleteApi("/members")
      .then(() => {
          removeUserCookie();
          alert("탈퇴되었습니다.");
          navi("/");
          dispatch(setIsLoggedIn(false));
          
        }).catch((res) => {
          if (res.response.status === 403) {
            alert(
              "관리 중인 프로젝트가 있습니다. ADMIN 권한을 위임하고 진행해주세요."
            );
          }
        })
    } else {
      alert("정확하게 입력해주세요.");
    }
  };

  return (
    <>
      <ImageContainer>
        <ImgDiv src={DeleteImg}></ImgDiv>
        <BannerElement>
          <Banner>회원 탈퇴</Banner>
          <DesciptionContent>
            프로젝트의 관리자라면 관리자 위임을 하고 진행해주세요.
          </DesciptionContent>
        </BannerElement>
      </ImageContainer>

      <Div>
        <InputText
          style={CustomStyle}
          placeholder="탈퇴합니다"
          onChange={handleChange}
        />
        <Button
          onClick={handleLeaveMember}
          label="탈퇴"
          width="100px"
          fontSize="20px"
          height="3vw"
        ></Button>
      </Div>
    </>
  );
}

const Div = styled.div`
  grid-column: 2/6;
  grid-row: 4/4;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ImageContainer = styled.div`
  grid-row: 2/3;
  grid-column: 1/6;
  margin-top: 80px;
  margin-left: 100px;
  display: flex;
  flex-direction: row;
`;
const ImgDiv = styled.img`
  width: 200px;
  height: 200px;
`;

const BannerElement = styled.div`
  display: flex;
  flex-direction: column;
`;

const Banner = styled.h1`
  text-align: left;
  margin-left: 30px;
  margin-top: 50px;
`;
const DesciptionContent = styled.div`
  font-size: 22px;
  font-weight: 320;
  margin-left: 20px;
`;
