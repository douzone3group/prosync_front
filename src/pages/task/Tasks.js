import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import TasksList from "../../components/task/common/TasksList";
import TaskNavigation from "../../components/task/common/TaskNavigation";
import TaskSearchBar from "../../components/task/common/TaskSearchBar";
import { styled } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getTasks,
  taskListAction,
} from "../../redux/reducers/task/taskList-slice";
import { getTaskStatus } from "../../redux/reducers/task/taskStatus-slice";
import { BiExit } from "react-icons/bi";
import { deleteApi } from "../../util/api";
import { tryFunc } from "../../util/tryFunc";
import axiosInstance from "../../util/axiosInstances";
import { getCookie } from "../../util/cookies";

export default function Tasks() {
  const dispatch = useDispatch();
  const params = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const [keyword, setKeyword] = useState(null);

  const [checkStatus, setCheckStatus] = useState(false);
  const navigate = useNavigate();

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changeKeywordHandler = (value) => {
    setKeyword(value);
  };

  const [projectMember, setProjectMember] = useState();

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("search");
    setKeyword(search);
  }, [location.search]);

  useEffect(() => {
    dispatch(getTaskStatus(params.projectId));
    const memberId = getCookie("memberId");

    (async () => {
      try {
        const response = await axiosInstance.get(
          `/projects/${params.projectId}/members/${memberId}`
        );
        if (response.status === 200) {
          const projectMember = await response.data;
          setProjectMember(projectMember);
        }
      } catch (error) {
        console.log("GUEST");
      }
    })();
  }, [dispatch, params.projectId]);

  useEffect(() => {
    dispatch(taskListAction.setTaskList({ list: [], pageInfo: {} }));
    const boardParams =
      view === "board" || view === "roadmap"
        ? {
            size: 1000,
            view,
          }
        : null;
    dispatch(
      getTasks(params.projectId, {
        search: keyword,
        page: currentPage,
        ...boardParams,
        isActive: true,
      })
    );
  }, [dispatch, params.projectId, currentPage, view, checkStatus, keyword]);

  // TABLE VIEW 체크박스 로직
  const [checkbox, setCheckbox] = useState([]);

  const memberProjectExitHandler = () => {
    const proceed = window.confirm(
      "해당 프로젝트를 나갈 경우 복구가 불가합니다. 나가시겠습니까?"
    );

    if (proceed) {
      const text = window.prompt(
        "해당 프로젝트를 나가시려면 [나가기]를 입력하세요."
      );
      if (text === "나가기") {
        tryFunc(
          () => deleteApi(`/projects/${params.projectId}/members`),
          () => {
            alert("프로젝트 나가기가 완료되었습니다.");
            navigate("/");
          },
          dispatch
        )();
      }
    }
  };

  return (
    <>
      <TaskView>
        <Top>
          <TopDiv
            back="hsl(226, 100%, 65%)"
            color="white"
            onClick={() => navigate("..")}
          >
            프로젝트 상세페이지
          </TopDiv>
          <TopButton>
            <Authority>
              {projectMember && projectMember.status === "ACTIVE"
                ? projectMember.authority
                : "GUEST"}
            </Authority>
            {projectMember &&
              projectMember.status === "ACTIVE" &&
              projectMember.authority !== "ADMIN" && (
                <TopDiv onClick={memberProjectExitHandler}>
                  <BiExit size="20px" />
                  프로젝트 나가기
                </TopDiv>
              )}
          </TopButton>
        </Top>
        <TaskSearchBar
          updateSearch={changeKeywordHandler}
          onChangePage={(value) => handleCurrentPage(value)}
        />
        <TaskNavigation
          onCheck={() => setCheckStatus((prv) => !prv)}
          checkedTasks={checkbox}
          updateCheckbox={(value) => setCheckbox(value)}
          projectMember={projectMember}
        />
        <TasksList
          onChangePage={handleCurrentPage}
          currentPage={currentPage}
          updateCheckbox={(value) => setCheckbox(value)}
          checkbox={checkbox}
          projectMember={projectMember}
        />
      </TaskView>
    </>
  );
}

const TaskView = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem 0 10rem 0;
`;

const Authority = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0px 30px;
  border: 1px solid #333;
  border-radius: 2rem;
`;

const TopDiv = styled.div`
  display: flex;
  gap: 10px;
  padding: 1rem 1.5rem;
  color: ${({ color }) => color || "white"};
  font-size: 1rem;
  background-color: ${({ back }) => back || "#e71d36"};
  border-radius: 5px;
  font-weight: bold;
  height: 100%;
  align-items: center;
  font-weight: bold;

  &:hover {
    opacity: 0.7;
  }
`;

const Top = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
  height: 4rem;
`;

const TopButton = styled.div`
  display: flex;
  gap: 1rem;
`;
