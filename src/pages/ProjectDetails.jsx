import React, { useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../helper/request";
import { FaClock, FaCheckCircle, FaPlus } from "react-icons/fa";
import { RiTodoLine } from "react-icons/ri";
import { BsFillGearFill, BsXLg } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import Spinner from "../components/Spinner";
import requireAuth from "../helper/HOC";
import TaskStats from "../components/TaskStats";
import AddUpdateModal from "../components/AddUpdateModal";
import DeleteModal from "../components/DeleteModal";
import ProjectDescriptionModal from "../components/ProjectDescriptionModal";
import {
  TaskCreationAlert,
  TaskUpdateAlert,
  TaskDeleteAlert,
} from "../components/Alerts";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [cookies] = useCookies("");
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = React.useState(false);
  const [showDescModal, setshowDescModal] = React.useState(false);
  const [updateTask, setUpdateTask] = useState(null);
  const [updateTaskError, setUpdateTaskError] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const openDescriptionModal = () => {
    setshowDescModal(true);
  };

  const closeDescriptionModal = () => {
    setshowDescModal(false);
  };

  const confirmDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
  };
  const cancelDeleteTask = () => {
    setDeleteTaskId(null);
  };

  const handleConfirmDeleteTask = async () => {
    try {
      if (deleteTaskId) {
        await API.delete(`tasks/${deleteTaskId}`, cookies.token);

        TaskDeleteAlert();
        queryClient.invalidateQueries(["tasks", projectId]);
      }
      setDeleteTaskId(null);
    } catch (error) {
      console.log(error.message);
      setDeleteTaskId(null);
    }
  };

  const {
    isLoading,
    isError,
    error: projectError,
    data: project,
  } = useQuery(["project", projectId], () =>
    API.get(`projects/${projectId}`, cookies.token).then((res) => {
      return res.data;
    })
  );

  const {
    isLoading: tasksLoading,
    isError: tasksError,
    error: taskError,
    data: tasks,
  } = useQuery(["tasks", projectId], () =>
    API.get(`tasks/?projectId=${projectId}`, cookies.token).then((res) => {
      return res.data;
    })
  );

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "to-do",
    project: projectId,
  });

  const mutation = useMutation(
    (newTask) => {
      return API.post("tasks", newTask, cookies.token);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["tasks", projectId]);
      },
    }
  );

  const handleAddTask = async () => {
    try {
      mutation.mutate(newTask);
      TaskCreationAlert();
      setNewTask(null);
      setShowModal(false);
    } catch (error) {
      setSubmitError(JSON.stringify(error.message));
    }
  };

  const handleUpdateTask = async () => {
    try {
      if (updateTask) {
        const updatedTask = await API.put(
          `tasks/${updateTask._id}`,
          updateTask,
          cookies.token
        );

        TaskUpdateAlert();
        setShowModal(false);
        queryClient.invalidateQueries(["tasks", projectId]); // Refetch tasks
      } else {
        setUpdateTaskError("Please select a task to update.");
      }
    } catch (error) {
      setUpdateTaskError(JSON.stringify(error.message));
    }
  };

  const getRemainingDays = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDifference = dueDateObj - currentDate;
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return remainingDays;
  };

  const getStats = useMemo(() => {
    const completedTasks = tasks?.filter((task) => task.status == "completed");
    const inProgress = tasks?.filter((task) => task.status == "in-progress");
    const toDo = tasks?.filter((task) => task.status == "to-do");

    return {
      completedTasks,
      inProgress,
      toDo,
    };
  }, [tasks]);

  function getStatusIcon(status) {
    switch (status) {
      case "to-do":
        return <RiTodoLine className="text-red-500" size={20} />;
      case "in-progress":
        return <FaClock className="text-yellow-500" size={20} />;
      case "completed":
        return <FaCheckCircle className="text-green-600" size={20} />;
      default:
        return null; // You can add a default icon or null if status is undefined
    }
  }
  function getTimePercentage(dueDate) {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDifference = dueDateObj - currentDate;
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    let percentage;

    // Use a switch statement to handle different cases based on comparisons
    switch (true) {
      case remainingDays <= 0:
        percentage = 100; // Due date has passed
        break;
      case remainingDays <= 1:
        percentage = 90; // 1 day or less left
        break;
      case remainingDays <= 3:
        percentage = 80; // 2-3 days left
        break;
      case remainingDays <= 7:
        percentage = 70; // 4-7 days left
        break;
      case remainingDays <= 14:
        percentage = 60; // 8-14 days left
        break;
      case remainingDays <= 30:
        percentage = 50; // 15-30 days left
        break;
      default:
        percentage = 0; // More than 30 days left
        break;
    }

    return percentage;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="relative w-[50%]">
        {isLoading ? (
          <p>Loading project details...</p>
        ) : isError ? (
          <p className="text-red-500">
            Error loading project: {projectError.message}
          </p>
        ) : (
          <div className="ms-7">
            <h2 className="text-3xl font-bold py-7 text-[#292C6D]">
              {project.name}
            </h2>
            <p className="text-gray-600 py-3 text-xl font-bold">Details :</p>

            {/* Button to open the project description modal */}
            <button
              className="bg-gray-500 text-white rounded-full p-2 uppercase font-semibold hover:bg-gray-700"
              onClick={openDescriptionModal}
            >
              View Description
            </button>

            {/* Project Description Modal */}
            {showDescModal && (
              <ProjectDescriptionModal
                description={project.description}
                onClose={closeDescriptionModal}
              />
            )}
          </div>
        )}
      </div>

      <h3 className="text-4xl pt-3 font-bold mb-2 text-center text-[#292C6D] text-6xl">
        Tasks
      </h3>

      <TaskStats getStats={getStats} />
      <div className="flex gap-3 ms-5">
        <button
          className="bg-white text-black shadow-lg  rounded-full p-4  uppercase font-semibold hover:bg-gray-200"
          onClick={() => {
            navigate("/");
          }}
        >
          <BiArrowBack />
        </button>
        <button
          className="bg-green-500 text-white rounded-full p-4   flex items-center gap-2 uppercase font-semibold hover:bg-green-700"
          onClick={() => {
            setUpdateTask(null); // Reset updateTask state
            setShowModal(true);
          }}
        >
          <FaPlus />
        </button>
      </div>

      {tasks?.length == 0 && (
        <div class="mt-4 flex justify-end flex-col items-center gap-3">
          <img src="/notfound.png" alt="" width={250} />
          <p class="text-gray-500 text-4xl font-medium">No task found!</p>
          {/* <button class="mt-2 bg-[#292C6D]  hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
            Add One
          </button> */}
        </div>
      )}

      <div className="mt-4 ">
        {tasksLoading ? (
          <Spinner />
        ) : tasksError ? (
          <p className="text-red-500">
            Error loading tasks: {taskError.message}
          </p>
        ) : (
          <div className="flex flex-row flex-wrap justify-start ms-5 gap-8">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="bg-white p-4 rounded shadow-lg mb-4 relative min-w-[300px] max-w-[500px] list-none hover:scale-105 transition-all cursor-pointer flex flex-col"
              >
                <div className="ml-4 flex items-center gap-2 absolute right-5">
                  <BsFillGearFill
                    size={25}
                    onClick={() => {
                      setUpdateTask(task);
                      setShowModal(true);
                    }}
                    className="text-slate-500 hover:text-slate-600 cursor-pointer"
                  />
                  <BsXLg
                    onClick={() => confirmDeleteTask(task._id)}
                    className="text-red-500 font-semibold hover:text-red-600 cursor-pointer"
                    size={25}
                  />
                </div>
                <div className="flex-grow">
                  <div>
                    <p className="text-xl font-semibold mb-2 text-slate-600">
                      {task.title}
                    </p>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 py-2">
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center ">
                    <div className="mr-2 ">{getStatusIcon(task.status)}</div>
                    <p className="text-lg text-gray-600">{task.status}</p>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-300 rounded-full">
                      <div
                        className={`h-full ${
                          getRemainingDays(task.dueDate) <= 0
                            ? "bg-red-500"
                            : getRemainingDays(task.dueDate) <= 1
                            ? "bg-yellow-500"
                            : getRemainingDays(task.dueDate) <= 3
                            ? "bg-yellow-500"
                            : getRemainingDays(task.dueDate) <= 7
                            ? "bg-green-600"
                            : getRemainingDays(task.dueDate) <= 14
                            ? "bg-green-600"
                            : "bg-blue-500"
                        } rounded-full`}
                        style={{
                          width: `${getTimePercentage(task.dueDate)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Time Remaining: {getRemainingDays(task.dueDate)} days
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </div>
        )}
      </div>

      {deleteTaskId && (
        <DeleteModal
          handleConfirmDeleteTask={handleConfirmDeleteTask}
          cancelDeleteTask={cancelDeleteTask}
        />
      )}

      {/* Add Task Modal */}
      {showModal ? (
        <AddUpdateModal
          setShowModal={setShowModal}
          updateTaskError={updateTaskError}
          setUpdateTaskError={setUpdateTaskError}
          updateTask={updateTask}
          handleAddTask={handleAddTask}
          handleUpdateTask={handleUpdateTask}
          newTask={newTask}
          setUpdateTask={setUpdateTask}
          setNewTask={setNewTask}
          submitError={submitError}
          setSubmitError={setSubmitError}
        />
      ) : null}
    </div>
  );
};

export default requireAuth(ProjectDetails);
