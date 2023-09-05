import React from "react";

const ProjectDescriptionModal = ({ description, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
      <div className="modal-content bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
        <p
          className="text-gray-600 py-3 bg-white"
          style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
        >
          {description}
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-white bg-gray-500 rounded-md px-4 py-2 hover:bg-gray-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescriptionModal;
