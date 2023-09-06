import React from "react";
import { FaClock, FaCheckCircle, FaPlus } from "react-icons/fa";
import { RiTodoLine } from "react-icons/ri";

const TaskStats = ({ getStats }) => {
  const stats = getStats;
  return (
    <div className="flex justify-center flex-wrap items-center gap-3 my-5">
      <div className="max-w-[500px] min-w-[300px] h-[150px]  rounded  flex  justify-center items-center gap-4 text-3xl font-bold hover: cursor-pointer">
        <div>
          {" "}
          <RiTodoLine className="text-red-600" size={40} />
        </div>
        {stats.toDo?.length}
      </div>
      <div className="max-w-[500px] min-w-[300px] h-[150px]  rounded flex  justify-center items-center gap-4 text-3xl font-bold hover:drop-shadow cursor-pointer">
        <div>
          {" "}
          <FaClock className="text-orange-600" size={40} />
        </div>
        {stats.inProgress?.length}
      </div>
      <div className="max-w-[500px] min-w-[300px] h-[150px]  rounded flex  justify-center items-center gap-4 text-3xl font-bold hover: cursor-pointer">
        <div>
          {" "}
          <FaCheckCircle className="text-green-600" size={40} />
        </div>
        {stats.completedTasks?.length}
      </div>
    </div>
  );
};

export default TaskStats;
