import React from "react";

const DeleteModal = ({ handleConfirmDeleteTask, cancelDeleteTask }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="bg-white p-4 rounded shadow-md text-center">
        <p className="text-lg font-semibold mb-4">Confirm Deletion</p>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleConfirmDeleteTask} // Confirm task deletion
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-4"
          >
            Confirm
          </button>
          <button
            onClick={cancelDeleteTask} // Cancel task deletion
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
