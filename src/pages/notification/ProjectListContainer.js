import { React, useState, useEffect } from "react";
import { useParams, json, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Pagination from "./../../components/notification/Pagination";
import { getApi } from "../../util/api";
import ProjectLogList from "./../../components/notification/ProjectLogList";
import UpperBar from "./../../components/notification/UpperBar";
import { useLocation } from "react-router-dom";
import { setIsLoggedIn } from "../../redux/reducers/loginSlice";
import { tryFunc } from "../../util/tryFunc";

const codeInformation = [
  {
    id: 1,
    code: "TASK_REMOVE",
    value: "업무삭제",
  },
  {
    id: 2,
    code: "TASK_ASSIGNMENT",
    value: "업무지정",
  },
  {
    id: 3,
    code: "TASK_MODIFICATION",
    value: "업무수정",
  },
  {
    id: 4,
    code: "TASK_EXCLUDED",
    value: "업무제외",
  },
  {
    id: 5,
    code: "PROJECT_ASSIGNMENT",
    value: "프로젝트지정",
  },
  {
    id: 6,
    code: "PROJECT_EXCLUDED",
    value: "프로젝트제외",
  },
  {
    id: 7,
    code: "PROJECT_MODIFICATION",
    value: "프로젝트수정",
  },
  {
    id: 8,
    code: "PROJECT_REMOVE",
    value: "프로젝트삭제",
  },
  {
    id: 9,
    code: "PROJECT_EXIT",
    value: "프로젝트탈퇴",
  },
  {
    id: 10,
    code: "COMMENT_ADD",
    value: "댓글추가",
  },
  {
    id: 11,
    code: "COMMENT_REMOVE",
    value: "댓글삭제",
  },
  {
    id: 12,
    code: "COMMENT_MODIFICATION",
    value: "댓글수정",
  },
  {
    id: 13,
    code: "CHANGE_AUTHORITY",
    value: "권한변경",
  },
];

const Loading = styled.div`
  color: gray;
  font-weight: 900;
  width: 30rem;
  height: 10rem;
  margin-left: 40%;
  margin-top: 10%;
`;

const Container = styled.div`
  width: 60%;
  height: 100%;
  font-weight: 900;
  display: flex;
  flex-direction: column;
  margin-left: 2%;
  padding: 0%;
  margin-right: 1%;
`;

const ProjectListContainer = () => {
  const { projectId } = useParams();
  const [logList, setLogList] = useState([]);
  const [logPageInfo, setLogPageInfo] = useState({
    page: "",
    size: "",
    totalElements: "",
    totalPages: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLogList = async () => {
    const response = await getApi(
      `/projectlog/${projectId}?${queryParams.toString()}`
    );
    return response.data;
  };

  const onFetchLogListSuccess = (data) => {
    console.log('로그 리스트 들고오기 성공 : '+data)
    setLogList(data.data);
    setLogPageInfo(data.pageInfo);
    setIsLoading(false);
  }

  const onFetchLogListErrorHandler = {
    500: (error) => {
      console.error("Server Error:", error);
      alert("서버에서 오류가 발생했습니다.");
    },
    403: (error) => {
      console.log(error.response.status);
      alert("해당 메뉴에 접근 권한이 없습니다.");
    },
    401: (error) => {
      console.log(error.response.status);
      alert("로그인이 만료되었습니다. 다시 로그인 해주세요.");
      setIsLoggedIn(false);
      navigate(
        `/auth?mode=login&returnUrl=${location.pathname}${location.search}`
      );
    },
    default: (error) => {
      console.error("Unknown error:", error);
      alert("로그 목록을 가져오는 중 오류가 발생하였습니다.");
    },
  }

  useEffect(() => {
    setIsLoading(true);
    console.log("Log 정보를 위해 useEffect에서 데이터 요청함");
    tryFunc(fetchLogList, onFetchLogListSuccess, onFetchLogListErrorHandler)();    
  }, [location, projectId]);

  return (
    <Container>
      <UpperBar
        isPersonal={false}
        codeInformation={codeInformation}
        count={logPageInfo.totalElements}
      />
      {!isLoading && (
        <>
          {<ProjectLogList logList={logList} />}
          <Pagination pageInfo={logPageInfo} pageCount={5} isPersonal={false} />
        </>
      )}
      {isLoading && (
        <Loading>데이터를 로딩중입니다. 잠시만 기다려주세요.</Loading>
      )}
    </Container>
  );
};

export default ProjectListContainer;
