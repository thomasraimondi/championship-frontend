import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Chiudi il menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex items-center gap-4">
          <li>
            <NavLink className="hover:text-gray-500" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className="hover:text-gray-500" to="/championship">
              Championship
            </NavLink>
          </li>
          <li>
            <NavLink className="hover:text-gray-500" to="/teams">
              Teams
            </NavLink>
          </li>
          <li>
            <NavLink className="hover:text-gray-500" to="/players">
              Players
            </NavLink>
          </li>
          <li>
            <NavLink className="hover:text-gray-500" to="/matches">
              Matches
            </NavLink>
          </li>
          <li>
            <NavLink className="hover:text-gray-500" to="/standings">
              Standings
            </NavLink>
          </li>
        </ul>
      </nav>
      <nav className="block md:hidden relative" ref={menuRef}>
        <button onClick={toggleMenu} className="p-2 hover:text-gray-500 transition-colors" aria-label="Toggle menu">
          <FontAwesomeIcon icon={faBars} />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 min-w-48 z-50">
            <ul className="py-2">
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/championship" onClick={() => setIsMenuOpen(false)}>
                  Championship
                </NavLink>
              </li>
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/teams" onClick={() => setIsMenuOpen(false)}>
                  Teams
                </NavLink>
              </li>
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/players" onClick={() => setIsMenuOpen(false)}>
                  Players
                </NavLink>
              </li>
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/matches" onClick={() => setIsMenuOpen(false)}>
                  Matches
                </NavLink>
              </li>
              <li>
                <NavLink className="block px-4 py-2 hover:bg-gray-100 transition-colors" to="/standings" onClick={() => setIsMenuOpen(false)}>
                  Standings
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
