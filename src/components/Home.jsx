import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhoneAlt, FaEdit, FaPalette } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import CoreExpertiseEditor from './CoreExpertiseEditor';
import HomeContentEditor from './HomeContentEditor';
import HomeProfileEditor from './HomeProfileEditor';
import axios from 'axios';

const Home = ({ data, coreExpertise }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [colorScheme, setColorScheme] = useState(0);
  const [activeSkill, setActiveSkill] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Home content state
  const defaultHomeContent = {
    greeting: 'Hi, I\'m',
    name: 'Ratan Kumar Majhi',
    title: data?.title || 'Python & Django Developer | ML Enthusiast',
    email: data?.email || 'ratanmajhi1203@gmail.com',
    phone: data?.phone || '+91-7477431203',
    nameGradient: 'from-purple-500 via-pink-500 to-blue-500',
    greetingColor: 'text-purple-400',
    greetingSize: 'text-lg md:text-xl',
    nameSize: 'text-5xl md:text-7xl',
    titleColor: 'text-gray-300',
    titleSize: 'text-xl md:text-2xl',
    coreExpertiseHeading: {
      text: 'Core Expertise',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-blue-400',
      glow: false
    },
    githubButton: {
      text: 'GitHub',
      link: data?.github || '',
      style: 'secondary',
      gradient: 'from-gray-700 to-gray-900',
      textColor: 'text-white',
      borderColor: 'border-gray-600',
      hoverEffect: 'hover:bg-gray-700',
      glow: false
    },
    profile: {
      image: '/assets/{images,icons}/ratan_old.jpg',
      size: 320,
      borderRadius: 9999,
      borderWidth: 4,
      borderColor: '#8b5cf6',
      glow: true,
      orbitIcons: [
        { id: 1, src: '/assets/icons/Python.png', ring: 1, speed: 'medium', delay: -4, size: 26 },
        { id: 2, src: '/assets/icons/Django.png', ring: 1, speed: 'fast', delay: -8, size: 26 },
        { id: 3, src: '/assets/icons/Machine_Learning.png', ring: 1, speed: 'slow', delay: -12, size: 26 },
        { id: 4, src: '/assets/icons/Deep_Learning.png', ring: 2, speed: 'fast', delay: -2, size: 26 },
        { id: 5, src: '/assets/icons/sql.png', ring: 2, speed: 'medium', delay: -6, size: 26 },
        { id: 6, src: '/assets/icons/Java.png', ring: 2, speed: 'slow', delay: -10, size: 26 },
        { id: 7, src: '/assets/icons/css.png', ring: 2, speed: 'fast', delay: -14, size: 26 },
        { id: 8, src: '/assets/icons/Power BI.png', ring: 3, speed: 'medium', delay: -3, size: 26 },
        { id: 9, src: '/assets/icons/Excel.png', ring: 3, speed: 'fast', delay: -7, size: 26 },
        { id: 10, src: '/assets/icons/Cisco_Packet_Tracer.png', ring: 3, speed: 'slow', delay: -11, size: 26 },
      ],
    },
  };

  const [homeContent, setHomeContent] = useState(defaultHomeContent);

  // Fetch custom home content from backend
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.home_content) {
          const incoming = response.data.home_content;
          setHomeContent({
            ...defaultHomeContent,
            ...incoming,
            coreExpertiseHeading: {
              ...defaultHomeContent.coreExpertiseHeading,
              ...(incoming.coreExpertiseHeading || {}),
            },
            githubButton: {
              ...defaultHomeContent.githubButton,
              ...(incoming.githubButton || {}),
            },
            profile: {
              ...defaultHomeContent.profile,
              ...(incoming.profile || {}),
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch home content:', error);
      }
    };
    fetchHomeContent();
  }, []);

  // Default skills if no custom data
  const defaultSkills = [
    { id: 1, name: 'Python', icon: '🐍', color: '#3776ab' },
    { id: 2, name: 'Machine Learning', icon: '🤖', color: '#ff6f00' },
    { id: 3, name: 'Deep Learning', icon: '🧠', color: '#e91e63' },
    { id: 4, name: 'Django', icon: '🎯', color: '#092e20' },
    { id: 5, name: 'SQL', icon: '💾', color: '#4479a1' },
    { id: 6, name: 'Cisco Packet Tracer', icon: '🌐', color: '#1ba0d7' },
  ];

  const [coreSkills, setCoreSkills] = useState(coreExpertise || defaultSkills);

  // Update when coreExpertise prop changes
  useEffect(() => {
    if (coreExpertise) {
      setCoreSkills(coreExpertise);
    }
  }, [coreExpertise]);

  // Attractive 3D color gradients for the name
  const nameColorSchemes = [
    'from-purple-500 via-pink-500 to-blue-500', // Purple-Pink-Blue
    'from-green-400 via-cyan-500 to-blue-600', // Green-Cyan-Blue
    'from-yellow-400 via-orange-500 to-red-600', // Yellow-Orange-Red
    'from-pink-500 via-purple-600 to-indigo-700', // Pink-Purple-Indigo
    'from-teal-400 via-blue-500 to-purple-600', // Teal-Blue-Purple
    'from-orange-400 via-red-500 to-pink-600', // Orange-Red-Pink
  ];

  // Change color every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setColorScheme((prev) => (prev + 1) % nameColorSchemes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Color hues for skills
  const hueColors = ['amber', 'rose', 'sky', 'emerald', 'orange', 'cyan', 'purple', 'pink', 'indigo', 'teal'];

  // Convert coreSkills to display format with hue and bg
  const skills = coreSkills.map((skill, index) => ({
    name: skill.name,
    icon: skill.icon,
    hue: hueColors[index % hueColors.length],
    bg: skill.bgImage || '',
    color: skill.color
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const profile = homeContent.profile || defaultHomeContent.profile;
  const orbitIcons = profile.orbitIcons || [];

  return (
    <section className="section-container bg-gradient-to-b from-black via-purple-900/10 to-black pt-36 lg:pt-32">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left relative"
            variants={itemVariants}
          >
            {isAdmin && isEditMode && (
              <button
                onClick={() => setShowContentEditor(true)}
                className="absolute -top-12 right-0 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 flex items-center gap-2 text-sm font-medium transition-all z-10"
                title="Edit Home Content"
              >
                <FaPalette /> Edit Content
              </button>
            )}

            <motion.p
              className={`${homeContent.greetingSize} ${homeContent.greetingColor} mb-4`}
              variants={itemVariants}
            >
              {homeContent.greeting}
            </motion.p>

            <motion.h1
              className={`${homeContent.nameSize} font-bold mb-6`}
              variants={itemVariants}
            >
              <span
                className={`bg-gradient-to-r ${nameColorSchemes[colorScheme]} bg-clip-text text-transparent font-extrabold transition-all duration-1000`}
              >
                {homeContent.name}
              </span>
            </motion.h1>

            <motion.p
              className={`${homeContent.titleSize} ${homeContent.titleColor} mb-8`}
              variants={itemVariants}
            >
              {homeContent.title}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12"
              variants={itemVariants}
            >
              <a
                href={`mailto:${homeContent.email}`}
                className="btn-primary flex items-center gap-2"
              >
                <FaEnvelope /> Contact Me
              </a>
              <a
                href={homeContent.githubButton.link || data?.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  homeContent.githubButton.style === 'primary'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    : homeContent.githubButton.style === 'secondary'
                      ? `bg-gradient-to-r ${homeContent.githubButton.gradient} hover:opacity-90 ${homeContent.githubButton.textColor}`
                      : homeContent.githubButton.style === 'gradient'
                        ? `bg-gradient-to-r ${homeContent.githubButton.gradient} hover:opacity-90 ${homeContent.githubButton.textColor}`
                        : homeContent.githubButton.style === 'outline'
                          ? `border-2 border-gray-400 bg-transparent hover:bg-gray-800/30 ${homeContent.githubButton.textColor}`
                          : homeContent.githubButton.style === 'glass'
                            ? `backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 ${homeContent.githubButton.textColor}`
                            : `bg-black border border-gray-700 hover:bg-gray-900 ${homeContent.githubButton.textColor}`
                } ${homeContent.githubButton.glow ? 'shadow-lg shadow-gray-500/50' : ''}`}
              >
                <FaGithub /> {homeContent.githubButton.text}
              </a>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400"
              variants={itemVariants}
            >
              <a
                href={`mailto:${homeContent.email}`}
                className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              >
                <FaEnvelope /> {homeContent.email}
              </a>
              <a
                href={`tel:${homeContent.phone}`}
                className="flex items-center gap-2 hover:text-purple-400 transition-colors"
              >
                <FaPhoneAlt /> {homeContent.phone}
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            className="flex-1 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-spin-slow opacity-20 blur-xl" style={{animation: 'spin 20s linear infinite'}}></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-spin-slow opacity-20 blur-lg" style={{animation: 'spin 15s linear infinite reverse'}}></div>

              {/* Orbiting Icons */}
              {[1, 2, 3].map((ring) => {
                const ringClass = ring === 1 ? 'orbit-ring-1' : ring === 2 ? 'orbit-ring-2' : 'orbit-ring-3';
                return (
                  <div key={ring} className={`profile-orbit ${ringClass}`}>
                    {orbitIcons
                      .filter((icon) => (icon.ring || 1) === ring)
                      .map((icon) => (
                        <div
                          key={icon.id}
                          className={`orbit-item orbit-${icon.speed || 'medium'}`}
                          style={{ animationDelay: `${icon.delay || 0}s` }}
                        >
                          <div
                            className="orbit-icon"
                            style={{
                              width: icon.size || 26,
                              height: icon.size || 26,
                            }}
                          >
                            <img src={icon.src} alt="Orbit icon" />
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}

              {/* Profile Circle */}
              <div
                className={`relative overflow-hidden shadow-2xl ${profile.glow ? 'neon-purple' : ''}`}
                style={{
                  width: profile.size || 320,
                  height: profile.size || 320,
                  borderRadius: `${profile.borderRadius ?? 9999}px`,
                  borderWidth: profile.borderWidth || 4,
                  borderColor: profile.borderColor || '#8b5cf6',
                  borderStyle: 'solid',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=Ratan+Kumar+Majhi&size=400&background=8b5cf6&color=fff&bold=true';
                  }}
                />
                {isAdmin && isEditMode && (
                  <button
                    onClick={() => setShowProfileEditor(true)}
                    className="absolute top-3 right-3 px-3 py-2 bg-purple-500/30 text-purple-100 border border-purple-500/50 rounded-lg hover:bg-purple-500/40 text-xs font-semibold transition-all"
                  >
                    Edit Photo
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Pills */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <h3 className={`text-center ${homeContent.coreExpertiseHeading.fontSize} font-semibold`}>
              <span className={`bg-gradient-to-r ${homeContent.coreExpertiseHeading.gradient} bg-clip-text text-transparent ${homeContent.coreExpertiseHeading.glow ? 'text-glow' : ''}`}>
                {homeContent.coreExpertiseHeading.text}
              </span>
            </h3>
            {isAdmin && isEditMode && (
              <button
                onClick={() => setShowEditor(true)}
                className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all"
              >
                <FaEdit /> Edit Skills
              </button>
            )}
          </div>
          <div className="core-expertise-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className={`core-chip core-chip-${skill.hue} ${activeSkill === skill.name ? 'core-chip-active' : ''} relative overflow-hidden cursor-pointer`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveSkill(activeSkill === skill.name ? null : skill.name)}
              >
                {/* Background Image on Click */}
                {activeSkill === skill.name && (
                  <>
                    <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${skill.bg})`
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-full opacity-35 pointer-events-none z-0">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${skill.bg})`
                        }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                    </div>
                  </>
                )}

                <span className="core-chip-icon relative z-10">
                  <img src={skill.icon} alt={`${skill.name} icon`} />
                </span>
                <span className="core-chip-text relative z-10">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Core Expertise Editor Modal */}
      {showEditor && (
        <CoreExpertiseEditor
          skills={coreSkills}
          onSave={(updatedSkills) => {
            setCoreSkills(updatedSkills);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* Home Content Editor Modal */}
      {showContentEditor && (
        <HomeContentEditor
          homeData={homeContent}
          onSave={(updatedContent) => {
            setHomeContent(updatedContent);
            setShowContentEditor(false);
          }}
          onClose={() => setShowContentEditor(false)}
        />
      )}

      {/* Home Profile Editor Modal */}
      {showProfileEditor && (
        <HomeProfileEditor
          homeData={homeContent}
          onSave={(updatedContent) => {
            setHomeContent(updatedContent);
            setShowProfileEditor(false);
          }}
          onClose={() => setShowProfileEditor(false)}
        />
      )}
    </section>
  );
};

export default Home;
