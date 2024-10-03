"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";
import Login from "../../app/(auth)/login/page"; // Adjust path as necessary
import SignUp from "../../app/(auth)/register/page"; // Adjust path as necessary

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign up
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDialogToggle = () => {
    setDialogOpen((prev) => !prev);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
    handleDialogToggle();
  };

  const handleLoginClick = () => {
    setIsSignUp(false);
    handleDialogToggle();
  };

  return (
    <>
      <nav className="bg-[#ff7781] sticky top-0 z-10">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <Link href="#" className="flex items-center space-x-3">
            <Image src="/logo_brain.png" width={45} height={45} alt="logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              TradeTron
            </span>
          </Link>
          <div className="hidden w-full md:block md:w-auto flex justify-center flex-grow">
            <ul className="flex justify-center space-x-8 font-medium p-4 md:p-0 text-white">
              <li>
                <Link
                  href="/strategy-builder"
                  className="block py-2 px-3 rounded hover:bg-gray-100 hover:text-slate-800 transition-colors duration-300"
                  aria-current="page"
                >
                  opstra
                </Link>
              </li>
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-white hover:text-slate-800 focus:outline-none"
                >
                  Strategy <FaCaretDown />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-1">
                    <ul className="py-2 text-sm grid justify-items-stretch">
                      <li className="hover:bg-gray-100 justify-self-start ">
                        <Link
                          href="/option-wizard"
                          className="block px-4 py-2 text-slate-800 transition-colors duration-300"
                          onClick={toggleDropdown}
                        >
                          Option Wizard
                        </Link>
                      </li>
                      <li className="hover:bg-gray-100 justify-self-start ">
                        <Link
                          href="/deployed"
                          className="block px-4 py-2 text-slate-800 transition-colors duration-300"
                          onClick={toggleDropdown}
                        >
                          Deployed
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/positions"
                  className="block py-2 px-3 rounded hover:bg-gray-100 hover:text-slate-800 transition-colors duration-300"
                >
                  Positions
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLoginClick}
                  className="py-2 px-4 rounded bg-white text-[#ff7781] hover:bg-gray-100 transition-colors duration-300"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={handleSignUpClick}
                  className="py-2 px-4 rounded bg-white text-[#ff7781] hover:bg-gray-100 transition-colors duration-300"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </nav>

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          {isSignUp ? (
            <SignUp onClose={handleDialogToggle} />
          ) : (
            <Login onClose={handleDialogToggle} />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
