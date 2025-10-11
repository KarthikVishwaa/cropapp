import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainLinks = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
  ];

  const toolsLinks = [
    { path: "/diary", name: "Digital Crop Diary" },
    { path: "/schemes", name: "Government Schemes" },
    { path: "/weather", name: "Weather Integration" },
    { path: "/crop", name: "Crop Recommendation" },
    { path: "/disease", name: "Pest Identification" },
    { path: "/weed", name: "Weed Detection & Soil Health" },
    { path: "/yield", name: "Yield Estimation Tool" },
  ];

  return (
    <nav className="bg-green-600 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-green-200 transition-colors"
          >
            Crop Sense
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {mainLinks.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-white font-semibold border-b-2 border-white transition-all"
                    : "text-white hover:text-green-200 transition-colors"
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="text-white font-medium hover:text-green-200 transition-colors flex items-center">
                Tools
                <span className="ml-1 text-sm">▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-green-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transform scale-y-0 group-hover:scale-y-100 origin-top transition-all duration-300">
                {toolsLinks.map((tool, idx) => (
                  <NavLink
                    key={idx}
                    to={tool.path}
                    className="block px-4 py-2 text-white hover:bg-green-600 transition-colors duration-200"
                  >
                    {tool.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-200[] focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-green-700 shadow-xl transform transition-transform duration-500 ease-in-out z-40 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-green-500">
          <span className="text-white font-bold text-lg">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-green-200"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-2 px-4">
          <p className="text-green-200 font-semibold uppercase text-sm mb-1 tracking-wider animate-pulse">
            Main
          </p>
          {mainLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className="text-white py-2 px-2 rounded hover:bg-green-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          <p className="text-green-200 font-semibold uppercase text-sm mt-4 mb-1 tracking-wider animate-pulse">
            Tools
          </p>
          {toolsLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className="text-white py-2 px-2 rounded hover:bg-green-600 transition-all duration-300 transform hover:translate-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Background overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
