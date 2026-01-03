import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaEdit, FaSave, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import ThemeToggleNav from './ThemeToggleNav';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from './AdminLogin';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const location = useLocation();
  const { isAdmin, isEditMode, toggleEditMode, logout } = useAdmin();

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'experience', label: 'Experience', path: '/experience' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'education', label: 'Education', path: '/education' },
    { id: 'skills', label: 'Skills', path: '/skills' },
    { id: 'certifications', label: 'Certifications', path: '/certifications' },
    { id: 'achievements', label: 'Achievements', path: '/achievements' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-purple-500/20'
          : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent'
      } navbar-root`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
          >
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
              <span className="text-white text-sm font-extrabold">RK</span>
            </span>
            <span className="gradient-text-purple tracking-wide">RKM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`group relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-purple-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-400 to-blue-400 opacity-100'
                      : 'bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-80'
                  }`}
                ></span>
              </Link>
            ))}

            {/* Admin Controls - Desktop */}
            {isAdmin ? (
              <>
                <button
                  onClick={toggleEditMode}
                  className={`ml-2 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                    isEditMode
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30'
                  }`}
                >
                  {isEditMode ? (
                    <>
                      <FaSave /> Save Mode
                    </>
                  ) : (
                    <>
                      <FaEdit /> Edit Mode
                    </>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="ml-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all duration-300"
              >
                <FaUserShield /> Admin
              </button>
            )}

            {/* Theme Toggle for Desktop */}
            <ThemeToggleNav />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggleNav />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-lg">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={closeMenu}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Admin Controls - Mobile */}
          {isAdmin ? (
            <div className="px-2 pt-2 border-t border-purple-500/20 space-y-2">
              <button
                onClick={() => {
                  toggleEditMode();
                  closeMenu();
                }}
                className={`w-full px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                  isEditMode
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                }`}
              >
                {isEditMode ? (
                  <>
                    <FaSave /> Save Mode
                  </>
                ) : (
                  <>
                    <FaEdit /> Edit Mode
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-md hover:bg-red-500/30 flex items-center gap-2 text-sm font-medium transition-all duration-300"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <div className="px-2 pt-2 border-t border-purple-500/20">
              <button
                onClick={() => {
                  setShowAdminLogin(true);
                  closeMenu();
                }}
                className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-md hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all duration-300"
              >
                <FaUserShield /> Admin Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
    </nav>
  );
};

export default Navbar;
