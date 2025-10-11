import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTools = () => setIsToolsOpen(!isToolsOpen);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-700 font-semibold"
      : "text-gray-700 hover:text-green-700 transition-colors duration-300";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              Crop Sense
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center space-x-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleTools}
                className="flex items-center text-gray-700 hover:text-green-700 font-medium transition-colors duration-300"
              >
                Tools
                <span className="ml-1 text-sm">{isToolsOpen ? "▲" : "▼"}</span>
              </button>

              <div
                className={`absolute bg-white shadow-lg mt-2 rounded-md w-56 overflow-hidden transition-all duration-300 transform origin-top ${
                  isToolsOpen
                    ? "scale-y-100 opacity-100"
                    : "scale-y-0 opacity-0 pointer-events-none"
                }`}
              >
                <NavLink
                  to="/diary"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Digital Crop Diary
                </NavLink>
                <NavLink
                  to="/schemes"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Government Schemes
                </NavLink>
                <NavLink
                  to="/weather"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Weather Integration
                </NavLink>
                <NavLink
                  to="/crop"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Crop Recommendation
                </NavLink>
                <NavLink
                  to="/disease"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Pest Identification
                </NavLink>
                <NavLink
                  to="/weed"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Weed Detection & Soil Health
                </NavLink>
                <NavLink
                  to="/yield"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Yield Estimation Tool
                </NavLink>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-700 focus:outline-none transition-colors duration-300"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <NavLink to="/" className="block px-4 py-2" onClick={toggleMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className="block px-4 py-2" onClick={toggleMenu}>
            About
          </NavLink>
          <NavLink to="/contact" className="block px-4 py-2" onClick={toggleMenu}>
            Contact
          </NavLink>

          {/* Mobile Tools Dropdown */}
          <div className="border-t border-gray-200">
            <button
              onClick={toggleTools}
              className="w-full text-left px-4 py-2 font-medium text-gray-700 flex justify-between items-center transition-colors duration-300"
            >
              Tools
              <span>{isToolsOpen ? "▲" : "▼"}</span>
            </button>
            <div
              className={`pl-4 overflow-hidden transition-all duration-300 ${
                isToolsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <NavLink to="/diary" className="block px-4 py-2" onClick={toggleMenu}>
                Digital Crop Diary
              </NavLink>
              <NavLink to="/schemes" className="block px-4 py-2" onClick={toggleMenu}>
                Government Schemes
              </NavLink>
              <NavLink to="/weather" className="block px-4 py-2" onClick={toggleMenu}>
                Weather Integration
              </NavLink>
              <NavLink to="/crop" className="block px-4 py-2" onClick={toggleMenu}>
                Crop Recommendation
              </NavLink>
              <NavLink to="/disease" className="block px-4 py-2" onClick={toggleMenu}>
                Pest Identification
              </NavLink>
              <NavLink to="/weed" className="block px-4 py-2" onClick={toggleMenu}>
                Weed Detection & Soil Health
              </NavLink>
              <NavLink to="/yield" className="block px-4 py-2" onClick={toggleMenu}>
                Yield Estimation Tool
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
