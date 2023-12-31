import React from 'react'
import { styled } from 'styled-components';


const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: -0.5%;
  position: relative;
  box-shadow: 2px 2px 2px gray;
  font-weight: 900;
  border: #707070;
  font-size: larger;
  text-align: center;
  height: 6rem;


  & > div:nth-child(1) {
    position: absolute;
    left: -3%;
    top: 40%;
    width: 20%;
  }

  & > div:nth-child(2) {
    position: absolute;
    left: 35%;
    top: 40%;
    width: 20%;
  }

  & > div:nth-child(3) {
    position: absolute;
    left: 77%;
    top: 40%;
    width: 20%;
  }

 
`;




const LogTitle = () => {
    return (
        <TitleContainer>
          <div>코드</div>
          <div>로그내용</div>
          <div>생성날짜</div>
        </TitleContainer>
      );
}

export default LogTitle