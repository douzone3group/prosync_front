import { useRouteLoaderData } from "react-router-dom";
import ProjectForm from "../../components/project/ProjectForm";
import { getApi } from "../../util/api";

export default function EditProject() {
  const data = useRouteLoaderData("edit");
  const project = data?.data || {};

  return (
    <>
      <ProjectForm method="PATCH" project={project} />
    </>
  );
}

export async function loader({ params }) {
  const projectId = params.projectId;

  try {
    const data = await getApi(`/projects/${projectId}`);
    return data;
  } catch (error) {
    console.log(error);
    if (error === undefined) {
      console.error("An undefined error occured!");
      alert("알 수 없는 오류가 발생했습니다.");
    } else if (error.code === "ERR_NETWORK") {
      console.error("네트워크 에러 발생:", error);
      alert(
        "서버에서 네트워크 지연 에러가 발생하였습니다. 잠시만 기다려주세요."
      );
    } else if (error.response && error.response.status === 404) {
      alert("프로젝트를 찾을 수 없습니다.");
      window.location.href = "/";
    } else if (error.response && error.response.status === 403) {
      //TODO: 에러페이지 잠깐 보이는 문제 처리 필요
      alert("해당 프로젝트 멤버가 아닙니다.");
      window.location.href = "/";
    } else if (error.response && error.response.status === 401) {
      //TODO: 에러페이지 잠깐 보이는 문제 처리 필요
      alert("로그인 사용자만 이용가능합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/auth?mode=login";
    }
  }
}
