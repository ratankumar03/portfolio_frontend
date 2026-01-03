import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPalette, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const HomeContentEditor = ({ homeData, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableData, setEditableData] = useState(homeData || {
    greeting: 'Hi, I\'m',
    name: 'Ratan Kumar Majhi',
    title: 'Python & Django Developer | ML Enthusiast',
    email: 'ratanmajhi1203@gmail.com',
    phone: '+91-7477431203',
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
      link: '',
      style: 'secondary', // 'primary', 'secondary', 'gradient', 'outline', 'glass'
      gradient: 'from-gray-700 to-gray-900',
      textColor: 'text-white',
      borderColor: 'border-gray-600',
      hoverEffect: 'hover:bg-gray-700',
      glow: false
    }
  });
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setEditableData({
      ...editableData,
      [field]: value
    });
  };

  const updateHeading = (field, value) => {
    setEditableData({
      ...editableData,
      coreExpertiseHeading: {
        ...editableData.coreExpertiseHeading,
        [field]: value
      }
    });
  };

  const updateGithubButton = (field, value) => {
    setEditableData({
      ...editableData,
      githubButton: {
        ...editableData.githubButton,
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'home_content',
          data: editableData,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableData);
        alert('Home content updated successfully! Page will reload to show changes.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const nameGradients = [
    { name: 'Purple-Pink-Blue', value: 'from-purple-500 via-pink-500 to-blue-500' },
    { name: 'Green-Cyan-Blue', value: 'from-green-400 via-cyan-500 to-blue-600' },
    { name: 'Yellow-Orange-Red', value: 'from-yellow-400 via-orange-500 to-red-600' },
    { name: 'Pink-Purple-Indigo', value: 'from-pink-500 via-purple-600 to-indigo-700' },
    { name: 'Teal-Blue-Purple', value: 'from-teal-400 via-blue-500 to-purple-600' },
    { name: 'Orange-Red-Pink', value: 'from-orange-400 via-red-500 to-pink-600' },
    { name: 'Cyan-Blue-Violet', value: 'from-cyan-400 via-blue-500 to-violet-600' },
    { name: 'Emerald-Green-Teal', value: 'from-emerald-400 via-green-500 to-teal-600' }
  ];

  const textColors = [
    'text-purple-400',
    'text-blue-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
    'text-red-400',
    'text-gray-300'
  ];

  const fontSizes = {
    greeting: [
      { name: 'Small', class: 'text-base md:text-lg' },
      { name: 'Medium', class: 'text-lg md:text-xl' },
      { name: 'Large', class: 'text-xl md:text-2xl' }
    ],
    name: [
      { name: 'Medium', class: 'text-4xl md:text-5xl' },
      { name: 'Large', class: 'text-5xl md:text-7xl' },
      { name: 'Extra Large', class: 'text-6xl md:text-8xl' }
    ],
    title: [
      { name: 'Small', class: 'text-lg md:text-xl' },
      { name: 'Medium', class: 'text-xl md:text-2xl' },
      { name: 'Large', class: 'text-2xl md:text-3xl' }
    ],
    heading: [
      { name: 'Medium', class: 'text-3xl md:text-4xl' },
      { name: 'Large', class: 'text-4xl md:text-5xl' },
      { name: 'Extra Large', class: 'text-5xl md:text-6xl' }
    ]
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-y-auto py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-5xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-purple">
              <FaPalette className="inline mr-2" />
              Edit Home Section
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            {/* Greeting Section */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Greeting Text</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Greeting Text
                  </label>
                  <input
                    type="text"
                    value={editableData.greeting}
                    onChange={(e) => updateField('greeting', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateField('greetingColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.greetingColor === color
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 glass rounded-lg border border-purple-500/20">
                <p className="text-xs text-gray-400 mb-2">Preview:</p>
                <p className={`${editableData.greetingSize} ${editableData.greetingColor}`}>
                  {editableData.greeting}
                </p>
              </div>
            </motion.div>

            {/* Name Section */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Your Name</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editableData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.name.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateField('nameSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.nameSize === size.class
                            ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name Gradient
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {nameGradients.map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => updateField('nameGradient', gradient.value)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableData.nameGradient === gradient.value
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-bold bg-gradient-to-r ${gradient.value} bg-clip-text text-transparent text-sm`}>
                          {gradient.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-blue-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h1 className={`${editableData.nameSize} font-bold`}>
                    <span className={`bg-gradient-to-r ${editableData.nameGradient} bg-clip-text text-transparent`}>
                      {editableData.name}
                    </span>
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Title/Subtitle Section */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Title / Tagline</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={editableData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Python & Django Developer | ML Enthusiast"
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.title.map((size) => (
                        <button
                          key={size.class}
                          onClick={() => updateField('titleSize', size.class)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.titleSize === size.class
                              ? 'bg-purple-500/30 border-purple-500 text-purple-300'
                              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Text Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateField('titleColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.titleColor === color
                              ? 'bg-purple-500/30 border-purple-500'
                              : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                          }`}
                        >
                          <span className={`font-semibold ${color}`}>A</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <p className={`${editableData.titleSize} ${editableData.titleColor}`}>
                    {editableData.title}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="glass rounded-xl p-6 border border-green-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4">
                <FaEnvelope className="inline mr-2" />
                Contact Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editableData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editableData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Core Expertise Heading */}
            <motion.div
              className="glass rounded-xl p-6 border border-pink-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-pink-400 mb-4">Core Expertise Heading</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableData.coreExpertiseHeading.text}
                    onChange={(e) => updateHeading('text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.heading.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateHeading('fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.coreExpertiseHeading.fontSize === size.class
                            ? 'bg-pink-500/30 border-pink-500 text-pink-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-pink-500/50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gradient Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {nameGradients.slice(0, 6).map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => updateHeading('gradient', gradient.value)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableData.coreExpertiseHeading.gradient === gradient.value
                            ? 'bg-pink-500/30 border-pink-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-pink-500/50'
                        }`}
                      >
                        <span className={`font-bold bg-gradient-to-r ${gradient.value} bg-clip-text text-transparent text-sm`}>
                          {gradient.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input
                      type="checkbox"
                      checked={editableData.coreExpertiseHeading.glow || false}
                      onChange={(e) => updateHeading('glow', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Enable Text Glow Effect
                  </label>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-pink-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h2 className={`${editableData.coreExpertiseHeading.fontSize} font-bold text-center`}>
                    <span className={`bg-gradient-to-r ${editableData.coreExpertiseHeading.gradient} bg-clip-text text-transparent ${editableData.coreExpertiseHeading.glow ? 'text-glow' : ''}`}>
                      {editableData.coreExpertiseHeading.text}
                    </span>
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* GitHub Button Styling */}
            <motion.div
              className="glass rounded-xl p-6 border border-gray-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-400 mb-4">
                GitHub Button Style
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editableData.githubButton.text}
                      onChange={(e) => updateGithubButton('text', e.target.value)}
                      placeholder="e.g., GitHub, View Projects, My Repos"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub Link URL
                    </label>
                    <input
                      type="url"
                      value={editableData.githubButton.link || ''}
                      onChange={(e) => updateGithubButton('link', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Button Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { name: 'Primary (Purple)', value: 'primary', preview: 'bg-gradient-to-r from-purple-600 to-blue-600' },
                      { name: 'Secondary (Gray)', value: 'secondary', preview: 'bg-gradient-to-r from-gray-700 to-gray-900' },
                      { name: 'Gradient', value: 'gradient', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
                      { name: 'Outline', value: 'outline', preview: 'border-2 border-white bg-transparent' },
                      { name: 'Glass', value: 'glass', preview: 'backdrop-blur-md bg-white/10' },
                      { name: 'Dark', value: 'dark', preview: 'bg-black border border-gray-700' }
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateGithubButton('style', style.value)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableData.githubButton.style === style.value
                            ? 'bg-gray-500/30 border-gray-400'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-500/50'
                        }`}
                      >
                        <div className={`${style.preview} h-6 rounded mb-1`}></div>
                        <span className="text-xs text-gray-300">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Gradient (for Gradient style)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Gray-Black', value: 'from-gray-700 to-gray-900' },
                      { name: 'Cyan-Blue', value: 'from-cyan-500 to-blue-600' },
                      { name: 'Purple-Blue', value: 'from-purple-600 to-blue-600' },
                      { name: 'Green-Teal', value: 'from-green-500 to-teal-600' },
                      { name: 'Orange-Red', value: 'from-orange-500 to-red-600' },
                      { name: 'Pink-Purple', value: 'from-pink-500 to-purple-600' }
                    ].map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => updateGithubButton('gradient', gradient.value)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          editableData.githubButton.gradient === gradient.value
                            ? 'bg-gray-500/30 border-gray-400'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-500/50'
                        }`}
                      >
                        <div className={`bg-gradient-to-r ${gradient.value} h-4 rounded mb-1`}></div>
                        <span className="text-xs text-gray-300">{gradient.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      'text-white',
                      'text-gray-300',
                      'text-gray-400',
                      'text-purple-400',
                      'text-blue-400',
                      'text-cyan-400',
                      'text-green-400',
                      'text-pink-400'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateGithubButton('textColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.githubButton.textColor === color
                            ? 'bg-gray-500/30 border-gray-400'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input
                      type="checkbox"
                      checked={editableData.githubButton.glow || false}
                      onChange={(e) => updateGithubButton('glow', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Enable Glow Effect
                  </label>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-gray-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <div className="flex justify-center">
                    <button
                      className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                        editableData.githubButton.style === 'primary'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          : editableData.githubButton.style === 'secondary'
                            ? `bg-gradient-to-r ${editableData.githubButton.gradient} hover:opacity-90`
                            : editableData.githubButton.style === 'gradient'
                              ? `bg-gradient-to-r ${editableData.githubButton.gradient} hover:opacity-90`
                              : editableData.githubButton.style === 'outline'
                                ? 'border-2 border-gray-400 bg-transparent hover:bg-gray-800/30'
                                : editableData.githubButton.style === 'glass'
                                  ? 'backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20'
                                  : 'bg-black border border-gray-700 hover:bg-gray-900'
                      } ${editableData.githubButton.textColor} ${
                        editableData.githubButton.glow ? 'shadow-lg shadow-gray-500/50' : ''
                      }`}
                    >
                      {editableData.githubButton.text}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500/20 text-gray-400 border border-gray-500/50 rounded-lg hover:bg-gray-500/30 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500/30 flex items-center gap-2 font-medium transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="spinner border-2 border-green-400/20 border-t-green-400 w-5 h-5"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeContentEditor;
