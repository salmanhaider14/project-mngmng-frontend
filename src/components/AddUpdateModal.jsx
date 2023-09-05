import React from "react";

const AddUpdateModal = ({
  setShowModal,
  updateTaskError,
  setUpdateTaskError,
  updateTask,
  handleAddTask,
  handleUpdateTask,
  newTask,
  setUpdateTask,
  setNewTask,
  submitError,
}) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md">
        <div className="relative w-auto min-w-[300px] my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                {updateTask ? "Update Task" : "Add Task"}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setShowModal(false);
                  setUpdateTaskError(""); // Reset updateTaskError
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
              <form onSubmit={updateTask ? handleUpdateTask : handleAddTask}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter task title"
                    value={updateTask ? updateTask.title : newTask.title}
                    onChange={(e) =>
                      updateTask
                        ? setUpdateTask({
                            ...updateTask,
                            title: e.target.value,
                          })
                        : setNewTask({
                            ...newTask,
                            title: e.target.value,
                          })
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
                      updateTask ? updateTask.description : newTask.description
                    }
                    onChange={(e) =>
                      updateTask
                        ? setUpdateTask({
                            ...updateTask,
                            description: e.target.value,
                          })
                        : setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={updateTask ? updateTask.dueDate : newTask.dueDate}
                    onChange={(e) =>
                      updateTask
                        ? setUpdateTask({
                            ...updateTask,
                            dueDate: e.target.value,
                          })
                        : setNewTask({
                            ...newTask,
                            dueDate: e.target.value,
                          })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={updateTask ? updateTask.status : newTask.status}
                    onChange={(e) =>
                      updateTask
                        ? setUpdateTask({
                            ...updateTask,
                            status: e.target.value,
                          })
                        : setNewTask({
                            ...newTask,
                            status: e.target.value,
                          })
                    }
                    required
                  >
                    <option value="to-do">To-Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {updateTaskError && (
                  <p className="bg-red-500 text-white p-3 my-2 text-center">
                    {updateTaskError}
                  </p>
                )}
                {submitError && (
                  <p className="bg-red-500 text-white p-3 my-2 text-center">
                    {submitError}
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
                  setUpdateTaskError(""); // Reset updateTaskError
                }}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={updateTask ? handleUpdateTask : handleAddTask}
              >
                {updateTask ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default AddUpdateModal;
