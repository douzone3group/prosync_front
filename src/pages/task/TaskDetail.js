import React from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";
import { deleteApi, getApi } from "../../util/api";
import Task from "../../components/task/Task";

export default function TaskDetail() {
  const data = useRouteLoaderData("task-details");
  const task = data.data.data;
  return (
    <>
      <Task task={task} />
    </>
  );
}

export async function loader({ params }) {
  const taskId = params.taskId;
  const response = await getApi(`/tasks/${taskId}`);
  return response;
}

export async function action({ params }) {
  const response = deleteApi(`/tasks/${params.taskId}`)
    .then((response) => {
      return response;
    })
    .catch((error) => console.error(error));

  if (response.status === 204) {
    alert("업무가 삭제되었습니다.");
  }
  return redirect("..");
}
