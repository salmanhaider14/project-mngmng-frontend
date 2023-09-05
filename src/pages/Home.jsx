import React from "react";
import { useNavigate } from "react-router-dom";
import requireAuth from "../helper/HOC";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button className="bg-blue-600" onClick={() => navigate("/dashboard")}>
        {" "}
        Dashboard{" "}
      </button>
    </div>
  );
};

export default requireAuth(Home);
