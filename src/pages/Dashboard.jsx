import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";
import API from "../helper/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Tasks from "../components/Tasks";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AiFillEye } from "react-icons/ai";
import { FaPlus, FaClock, FaCheckCircle } from "react-icons/fa";
import { BsFillGearFill, BsXLg } from "react-icons/bs";
import { RiTodoLine } from "react-icons/ri";
import requireAuth from "../helper/HOC";
import DeleteModal from "../components/DeleteModal";
import {
  ProjectCreationAlert,
  ProjectDeleteAlert,
  ProjectUpdatedAlert,
} from "../components/Alerts";
import Footer from "../components/Footer";

const Home = () => {
  const [coockies] = useCookies("");
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [projectError, setError] = useState("");
  const [deleteProjectId, setdeleteProjectId] = useState(null);
  const [updateProject, setUpdateProject] = useState(null); // To store task data for updating
  const [updateProjectError, setUpdateProjectError] = useState("");
  const [updateprojectId, setUpdateProjecId] = useState("");
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    error,
    data: projects,
  } = useQuery(["projects"], () =>
    API.get("projects", coockies.token).then((res) => {
      return res.data;
    })
  );

  const mutation = useMutation(
    (newProject) => {
      return API.post("projects", newProject, coockies.token);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      mutation.mutate({ name, description: desc });
      ProjectCreationAlert();
      setName("");
      setDesc("");
    } catch (error) {
      setError(JSON.stringify(error.message));
    }
  };

  const handleConfirmDeleteProject = async () => {
    try {
      if (deleteProjectId) {
        const res = await API.delete(
          `projects/${deleteProjectId}`,
          coockies.token
        );
        console.log(res.data);
        ProjectDeleteAlert();
      }
      setdeleteProjectId(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(
        `tasks/?projectId=${projectId}`,
        coockies.token
      );
      const tasks = res.data;
      const completedTasks = tasks.filter(
        (task) => task.status === "completed"
      );
      const inProgressTasks = tasks.filter(
        (task) => task.status === "in-progress"
      );
      const todoTasks = tasks.filter((task) => task.status === "to-do");
      let completionPercentage;
      if (tasks.length == 0) completionPercentage = 0;
      else {
        completionPercentage = (completedTasks.length / tasks.length) * 100;
      }

      return {
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        todo: todoTasks.length,
        completionPercentage,
      };
    } catch (error) {
      console.error(error.message);
    }
  };

  const [tasksCountsMap, setTasksCountsMap] = useState({});
  // ... (other state and variables)

  useEffect(() => {
    const fetchTasksCounts = async () => {
      const tasksCountsMap = {};
      for (const project of projects || []) {
        try {
          const res = await fetchTasks(project._id);
          const tasksCounts = res; // Assuming res is the tasksCounts object
          tasksCountsMap[project._id] = tasksCounts;
        } catch (error) {
          console.error(error);
        }
      }
      setTasksCountsMap(tasksCountsMap);
    };

    fetchTasksCounts();
  }, [projects]);

  const confirmDeleteProject = (projectId) => {
    setdeleteProjectId(projectId); // Set the task ID to be deleted
  };
  const cancelDeleteProject = () => {
    setdeleteProjectId(null); // Reset the task ID for deletion
  };

  const handleUpdateProject = async (projectId) => {
    try {
      if (updateProject) {
        // Send a PUT request to update the task
        const updatedProject = API.put(
          `projects/${updateprojectId}`,
          updateProject,
          coockies.token
        );

        // Handle success
        ProjectUpdatedAlert();
        setUpdateProject(null);
        setShowModal(false);
        queryClient.invalidateQueries(["projects", updateProject._id]); // Refetch tasks
      } else {
        setUpdateProjectError("Please select a Project to update.");
      }
    } catch (error) {
      setUpdateProjectError(JSON.stringify(error.message));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F5]">
        <Navbar />
        <h1 className="text-center text-[#292C6D] text-6xl pt-8 font-bold">
          Dashboard
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#292C6D] p-4 flex items-center gap-2 ms-5 rounded-full text-white text-lg my-7 hover:bg-indigo-700"
        >
          <FaPlus />
        </button>
        {projects?.length == 0 && (
          <div class="mt-4 flex justify-end flex-col items-center gap-3">
            <img src="/notfound.png" alt="" width={250} />
            <p class="text-gray-500 text-4xl font-medium">No project found!</p>
            {/* <button class="mt-2 bg-[#292C6D]  hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
            Add One
          </button> */}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-7 my-7">
          {isError ? (
            <p>{error.message}</p>
          ) : isLoading ? (
            <Spinner />
          ) : (
            projects?.map((project) => {
              const tasksCounts = tasksCountsMap[project._id];
              console.log(tasksCounts);
              return (
                <div
                  className="relative min-w-[350px] bg-[#E3F4F4] h-[270px] shadow-xl p-2 rounded hover:transition-all overflow-hidden hover:scale-105 transition-all cursor-pointer"
                  style={{ flexDirection: "column", display: "flex" }}
                >
                  <div className="ml-4 flex items-center gap-2 absolute right-5">
                    <BsFillGearFill
                      size={25}
                      onClick={() => {
                        setUpdateProject(project);
                        setUpdateProjecId(project._id);
                        setShowModal(true);
                      }}
                      className="text-slate-500 hover:text-slate-600 cursor-pointer"
                    />
                    <BsXLg
                      onClick={() => confirmDeleteProject(project._id)}
                      className="text-red-500 font-semibold hover:text-red-600 cursor-pointer"
                      size={25}
                    />
                  </div>
                  <h1 className="text-2xl font-semibold text-slate-700">
                    {project.name}
                  </h1>
                  <div className="mt-5 flex flex-col gap-3  ">
                    <p className="flex gap-3 items-center">
                      <FaCheckCircle className="text-green-600" size={25} />
                      Completed Tasks: {tasksCounts?.completed}
                    </p>
                    <p className="flex gap-3 items-center">
                      {" "}
                      <FaClock className="text-yellow-600" size={25} /> In
                      Progress Tasks: {tasksCounts?.inProgress}
                    </p>
                    <p className="flex gap-3 items-center">
                      {" "}
                      <RiTodoLine className="text-red-600" size={25} />
                      To-Do Tasks: {tasksCounts?.todo}
                    </p>
                    <Link to={`/projects/details/${project._id}`}>
                      <AiFillEye
                        size={40}
                        color="white"
                        className="hover:drop-shadow"
                      />
                    </Link>
                  </div>

                  {/* <Tasks id={project._id} /> */}
                  <div className="mt-auto">
                    <p> Completed:</p>
                    <div className="h-2 bg-gray-300 rounded-full">
                      <div
                        className={`h-full bg-green-600  rounded-full relative`}
                        style={{
                          width: `${tasksCounts?.completionPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Add Task Modal */}
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md">
              <div className="relative w-auto min-w-[300px] my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      {" "}
                      {updateProject ? "Update Project" : "Add Project"}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => {
                        setShowModal(false);
                        setUpdateProjectError("");
                        setError("");
                        setUpdateProject(null);
                      }}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  <div
                    className="p-4"
                    aria-hidden="true"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                  >
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Enter task title"
                          value={updateProject ? updateProject.name : name}
                          onChange={(e) =>
                            updateProject
                              ? setUpdateProject({
                                  ...updateProject,
                                  name: e.target.value,
                                })
                              : setName(e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Description
                        </label>
                        <textarea
                          className="w-full p-2 border rounded"
                          rows="3"
                          placeholder="Enter task description"
                          value={
                            updateProject ? updateProject.description : desc
                          }
                          onChange={(e) =>
                            updateProject
                              ? setUpdateProject({
                                  ...updateProject,
                                  description: e.target.value,
                                })
                              : setDesc(e.target.value)
                          }
                          required
                        />
                      </div>

                      {projectError && (
                        <p className="bg-red-500 text-white p-3 my-2 text-center">
                          {projectError}
                        </p>
                      )}
                      {updateProjectError && (
                        <p className="bg-red-500 text-white p-3 my-2 text-center">
                          {updateProjectError}
                        </p>
                      )}
                    </form>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setUpdateProjectError("");
                        setError("");
                        setUpdateProject(null);
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={
                        updateProject ? handleUpdateProject : handleSubmit
                      }
                    >
                      {updateProject ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {deleteProjectId && (
          <DeleteModal
            handleConfirmDeleteTask={handleConfirmDeleteProject}
            cancelDeleteTask={cancelDeleteProject}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default requireAuth(Home);
