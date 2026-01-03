import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaArrowUp, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import { useAdmin } from '../context/AdminContext';
import FooterConnectEditor from './FooterConnectEditor';
import axios from 'axios';

const Footer = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const [clickCount, setClickCount] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showConnectEditor, setShowConnectEditor] = useState(false);
  const clickTimerRef = useRef(null);
  const clickTimestamps = useRef([]);
  const { isAdmin, isEditMode } = useAdmin();
  const [hasCustomLinks, setHasCustomLinks] = useState(false);

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  const iconMap = {
    github: FaGithub,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    instagram: FaInstagram,
    twitter: FaTwitter,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
  };

  const buildDefaultSocialLinks = () => ([
    {
      name: 'GitHub',
      url: data?.github || 'https://github.com/ratankumar03',
      iconKey: 'github',
      color: 'hover:text-gray-400',
      gradient: 'from-gray-600 to-gray-800',
    },
    {
      name: 'LinkedIn',
      url: data?.linkedin || 'https://www.linkedin.com/in/ratan-kumar-majhi-893521248/',
      iconKey: 'linkedin',
      color: 'hover:text-blue-400',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Facebook',
      url: data?.facebook || 'https://www.facebook.com/ratan.majhi.831180',
      iconKey: 'facebook',
      color: 'hover:text-blue-500',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Instagram',
      url: data?.instagram || 'https://instagram.com',
      iconKey: 'instagram',
      color: 'hover:text-pink-400',
      gradient: 'from-pink-500 via-purple-500 to-orange-500',
    },
    {
      name: 'Twitter',
      url: data?.twitter || 'https://twitter.com',
      iconKey: 'twitter',
      color: 'hover:text-sky-400',
      gradient: 'from-sky-400 to-sky-600',
    },
    {
      name: 'YouTube',
      url: data?.youtube || 'https://youtube.com',
      iconKey: 'youtube',
      color: 'hover:text-red-500',
      gradient: 'from-red-500 to-red-700',
    },
    {
      name: 'WhatsApp',
      url: data?.whatsapp || `https://wa.me/${data?.phone?.replace(/\D/g, '')}`,
      iconKey: 'whatsapp',
      color: 'hover:text-green-400',
      gradient: 'from-green-400 to-green-600',
    },
  ]);

  const normalizeLinks = (links) => links.map((link) => {
    if (link.iconKey) {
      return link;
    }
    const name = (link.name || '').toLowerCase();
    const iconKey = iconMap[name] ? name : 'github';
    return { ...link, iconKey };
  });

  const [socialLinks, setSocialLinks] = useState(buildDefaultSocialLinks());

  useEffect(() => {
    if (!hasCustomLinks) {
      setSocialLinks(buildDefaultSocialLinks());
    }
  }, [data, hasCustomLinks]);

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.footer_connect && response.data.footer_connect.length > 0) {
          setSocialLinks(normalizeLinks(response.data.footer_connect));
          setHasCustomLinks(true);
        }
      } catch (error) {
        console.error('Failed to fetch footer links:', error);
      }
    };
    fetchFooterLinks();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameClick = () => {
    const now = Date.now();

    // Add current timestamp
    clickTimestamps.current.push(now);

    // Remove timestamps older than 1 minute (60000ms)
    clickTimestamps.current = clickTimestamps.current.filter(
      timestamp => now - timestamp <= 60000
    );

    // Update click count
    const count = clickTimestamps.current.length;
    setClickCount(count);

    // If 5 clicks within 1 minute, show admin login
    if (count >= 5) {
      setShowAdminLogin(true);
      setClickCount(0);
      clickTimestamps.current = [];
    }
  };

  return (
    <>
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
      />
    <footer className="relative bg-gradient-to-b from-black via-purple-950/10 to-black border-t border-purple-500/20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ratan Kumar Majhi
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Python & Django Developer | Machine Learning Enthusiast
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Available for opportunities</span>
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-white relative inline-block">
                Connect
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
              </h4>
              {isAdmin && isEditMode && (
                <button
                  onClick={() => setShowConnectEditor(true)}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-xs font-semibold transition-all"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.iconKey] || FaGithub;
                return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-20 absolute inset-0 blur-md transition-opacity duration-300`}></div>
                  <div className={`w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <IconComponent size={20} className="relative z-10" />
                  </div>
                </motion.a>
              );
              })}
            </div>
          </motion.div>
        </div>

        {/* Divider with gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
        </div>

        {/* Copyright Section */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text font-semibold text-lg">
              {currentYear}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span
              className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text font-bold text-lg cursor-pointer hover:scale-105 transition-transform select-none"
              onClick={handleNameClick}
              title={clickCount > 0 ? `${clickCount}/5 clicks` : ''}
            >
              Ratan Kumar Majhi
            </span>
          </div>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="group px-4 py-2 rounded-full glass border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 flex items-center gap-2"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">Back to Top</span>
            <FaArrowUp className="text-purple-400 group-hover:text-purple-300 transition-colors" size={14} />
          </motion.button>
        </motion.div>
      </div>
    </footer>
    {showConnectEditor && (
      <FooterConnectEditor
        socialLinks={socialLinks}
        onSave={(updatedLinks) => {
          setSocialLinks(updatedLinks);
          setHasCustomLinks(true);
          setShowConnectEditor(false);
        }}
        onClose={() => setShowConnectEditor(false)}
      />
    )}
    </>
  );
};

export default Footer;
