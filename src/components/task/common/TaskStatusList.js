import TaskStatus from "./TaskStatus";
import { styled } from "styled-components";
import { useState } from "react";
import { deleteTaskStatusApi } from "../../../util/api";
import { useDispatch, useSelector } from "react-redux";
import { taskStatusActions } from "../../../redux/reducers/task/taskStatus-slice";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import NewTaskStatus from "../../../pages/task/NewTaskStatus";
import { tryFunc } from "../../../util/tryFunc";

export default function TaskStatusList({
  showStatusModal,
  updateTaskStatus,
  currentStatusId,
}) {
  const [editStatus, setEditState] = useState(false);
  const editStatusHandler = () => {
    setEditState((prv) => !prv);
  };

  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.taskStatus.list);

  const deleteTaskStatus = (statusId) => {
    if (currentStatusId === statusId) {
      alert("현재 업무에 선택된 업무상태는 삭제할 수 없습니다.");
      return;
    }
    const proceed = window.confirm("정말 삭제하시겠습니까?");

    if (proceed) {
      tryFunc(
        () => deleteTaskStatusApi(statusId),
        () => {
          dispatch(taskStatusActions.removeStatus(statusId));
          alert("삭제가 완료되었습니다.");
        },
        dispatch
      )();
    }
  };

  const statusClickHandler = (taskStatus) => {
    updateTaskStatus({
      taskStatusId: taskStatus.taskStatusId,
      taskStatus: taskStatus.taskStatus,
      color: taskStatus.color,
    });
  };

  const [editTaskStatus, setEditTaskStatus] = useState({ show: false });

  const patchTaskStatusHandler = (taskStatusId, taskStatus, color) => {
    setEditTaskStatus({ taskStatusId, taskStatus, color, show: true });
  };

  return (
    <>
      {editTaskStatus.show && (
        <NewTaskStatus
          onClose={() => setEditTaskStatus({ show: false })}
          editTask={editTaskStatus}
          currentStatusId={currentStatusId}
          updateStatusForForm={updateTaskStatus}
        />
      )}
      <StatusBox>
        <p>Apply status to this task!</p>
        <StatusItems>
          {statusList.map((taskStatus) => (
            <OneBox key={taskStatus.taskStatusId}>
              <div onClick={() => statusClickHandler(taskStatus)}>
                <TaskStatus
                  color={taskStatus.color}
                  name={taskStatus.taskStatus}
                />
              </div>
              {editStatus ? (
                <>
                  {/* 삭제 */}
                  <RiDeleteBin6Line
                    onClick={() => deleteTaskStatus(taskStatus.taskStatusId)}
                    size="20px"
                  />
                  {/* 수정 */}
                  <RiEditLine
                    size="20px"
                    onClick={() =>
                      patchTaskStatusHandler(
                        taskStatus.taskStatusId,
                        taskStatus.taskStatus,
                        taskStatus.color
                      )
                    }
                  />
                </>
              ) : (
                ""
              )}
            </OneBox>
          ))}
        </StatusItems>
        <Buttons>
          <button type="button" onClick={editStatusHandler}>
            {editStatus ? (
              "done"
            ) : (
              <span>
                <FiEdit2 />
                edit
              </span>
            )}
          </button>
          {editStatus && (
            <button type="button" onClick={showStatusModal}>
              add
            </button>
          )}
        </Buttons>
      </StatusBox>
    </>
  );
}

const Buttons = styled.div`
  display: flex;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  button {
    height: 100%;
    font-size: 1rem;
    padding: 5px;
    overflow: hidden;
    background-color: white;
    border: none;
    width: 100%;
    font-weight: bold;
  }

  button:nth-child(2) {
    border-left: 1px solid gray;
  }
`;

const StatusBox = styled.div`
  width: 400px;
  max-height: 500px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid #c0c0c0;
  margin-top: 3px;
  overflow: hidden;
  background-color: white;

  p {
    font-weight: bold;
    text-align: center;
    margin-bottom: 0;
    border-bottom: 1px solid #c0c0c0;
    padding-bottom: 1rem;
  }
`;

const StatusItems = styled.div`
  height: 100%;
  padding: 2rem;
  overflow: auto;
  border-bottom: 1px solid gray;

  div {
    margin-bottom: 5px;
  }

  div:hover {
    transform: scale(1.05);
  }
`;

const OneBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  div:nth-child(1) {
    flex: 10;
  }

  div:nth-child(2) {
    flex: 1;
  }
`;
