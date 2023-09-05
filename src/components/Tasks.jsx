import { useQuery } from "@tanstack/react-query";
import React from "react";
import API from "../helper/request";
import { useCookies } from "react-cookie";
const Tasks = ({ id }) => {
  const [coockies] = useCookies("");
  const {
    isLoading,
    isError,
    error,
    data: tasks,
  } = useQuery(["tasks"], () =>
    API.get(`tasks?projectId=${id}`, coockies.token).then((res) => {
      return res.data;
    })
  );
  return (
    <div className="mt-3">
      {isError ? (
        <p>{error.message}</p>
      ) : isLoading ? (
        <p>Loading....</p>
      ) : (
        tasks?.map((task) => (
          <div key={task._id}>
            <h1 className="bg-white shadow-lg my-2 rounded p-1 font-medium">
              {task.title}
            </h1>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
