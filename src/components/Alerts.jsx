import Swal from "sweetalert2";

const ProjectCreationAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Project Created!",
    showConfirmButton: false,
    timer: 3000,
  });
};
const ProjectUpdatedAlert = () => {
  Swal.fire({
    icon: "info",
    title: "Project Updated!",
    showConfirmButton: false,
    timer: 3000,
  });
};
const ProjectDeleteAlert = () => {
  Swal.fire({
    icon: "warning",
    title: "Project Deleted!",
    showConfirmButton: false,
    timer: 3000,
  });
};

const TaskCreationAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Task Created!",
    showConfirmButton: false,
    timer: 3000,
  });
};
const TaskUpdateAlert = () => {
  Swal.fire({
    icon: "info",
    title: "Task Updated!",
    showConfirmButton: false,
    timer: 3000,
  });
};
const TaskDeleteAlert = () => {
  Swal.fire({
    icon: "warning",
    title: "Task Deleted!",
    showConfirmButton: false,
    timer: 3000,
  });
};

export default {
  ProjectCreationAlert,
  ProjectDeleteAlert,
  ProjectUpdatedAlert,
  TaskCreationAlert,
  TaskUpdateAlert,
  TaskDeleteAlert,
};
export {
  ProjectCreationAlert,
  ProjectUpdatedAlert,
  ProjectDeleteAlert,
  TaskCreationAlert,
  TaskDeleteAlert,
  TaskUpdateAlert,
};
