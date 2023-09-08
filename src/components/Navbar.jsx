import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const Alert = () => {
    Swal.fire({
      icon: "info",
      title: "You are logged out!",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const signOut = () => {
    removeCookie("token");
    Alert();
    navigate("/login");
  };

  return (
    <nav className="p-3 rounded-xl bg-white ">
      <div className="flex justify-between items-center">
        <a
          className=" text-xl font-semibold text-slate-800 ps-[50px] flex items-center gap-3 "
          href="#"
        >
          <img src="/logo.png" width={50} className="ms-10" />
          My Organizer
        </a>

        <button
          className="lg:hidden text-black focus:outline-none"
          onClick={toggleMenu}
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div className="hidden lg:flex space-x-4  me-auto ms-auto gap-8 text-lg font-semibold text-[#292C6D]">
          {/* <Link className="font-semibold" to={"/"} href="#">
            Home
          </Link> */}
          <Link className="font-semibold" to={"/"}>
            Dashboard
          </Link>
          <Link className="font-semibold" to={"/#"}>
            About
          </Link>
          <Link className="font-semibold" to={"/#"}>
            Privacy Policy
          </Link>
          <Link className="font-semibold" to={"/#"}>
            Contact
          </Link>
        </div>
        <BiLogOut
          onClick={signOut}
          size={30}
          className="me-4 text-2xl cursor-pointer text-orange-500"
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden mt-4 ${
          menuOpen ? "block" : "hidden"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center">
          <a className="block py-2" href="#">
            Home
          </a>
          <a className="block py-2" href="#">
            Pages
          </a>
          <a className="block py-2" href="#">
            Services
          </a>
          <a className="block py-2" href="#">
            Project
          </a>
          <a className="block py-2" href="#">
            Blog
          </a>
          <a className="block py-2" href="#">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
