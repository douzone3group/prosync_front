import React from 'react'
import { styled } from 'styled-components';
import ListLoadingSpinner from "../../components/common/ListLoadingSpinner";

const StylePreview = styled.div`
    border: 1px solid gray;
    width: 60%;
    height: 50rem;
    margin-left: 2%;
    margin-right: 1%;
    border-radius: 20px;

    & > div:nth-child(1) {
      font-size: 2rem;
      text-align: center;
      padding-top: 10%;
      font-weight: 800;
    }
`;

const ProjectLogPreview = () => {
  return (
    <StylePreview>
      <div>프로젝트를 선택하시면 원하시는 로그를 보실 수 있습니다</div>
      <ListLoadingSpinner/>
    </StylePreview>
  )
}

export default ProjectLogPreview