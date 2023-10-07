import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectInfo from "./ProjectInfo";
import { getProjectMembersApi } from "../../util/api";
import { tryFunc } from "../../util/tryFunc";

export default function Project() {
  const [projectMembers, setProjectMembers] = useState();
  const params = useParams();

  useEffect(() => {
    tryFunc(
      async () => await getProjectMembersApi(params.projectId, { size: 1000 }),
      (projectMembers) => setProjectMembers(projectMembers)
    )();
  }, [params.projectId]);

  return <ProjectInfo projectMembers={projectMembers} />;
}