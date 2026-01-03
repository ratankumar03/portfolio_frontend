import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPalette, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFilePdf, FaUpload, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const AboutContentEditor = ({ aboutData, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableData, setEditableData] = useState(aboutData || {
    pageTitle: {
      text: 'About Me',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: false
    },
    profileSummary: {
      heading: 'Profile Summary',
      headingColor: 'text-blue-400',
      headingSize: 'text-2xl',
      content: '',
      textColor: 'text-gray-300',
      textSize: 'text-base',
      cardEffect: 'hover-neon-blue',
      textAlign: 'text-left'
    },
    location: {
      heading: 'Location',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      cardEffect: 'hover-neon-purple',
      data: {
        village: '',
        post: '',
        police_station: '',
        district: '',
        state: '',
        country: '',
        pin: ''
      }
    },
    getInTouch: {
      heading: 'Get In Touch',
      headingColor: 'text-blue-400',
      headingSize: 'text-2xl',
      cardEffect: 'hover-neon-blue',
      data: {
        emailLabel: 'Email',
        email: '',
        phoneLabel: 'Phone',
        phone: '',
        locationLabel: 'Location',
        location: '',
      }
    },
    resume: {
      heading: 'My Resume',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      description: 'Download my professional resume to learn more about my skills, experience, and achievements.',
      downloadButtonText: 'Download Resume',
      viewButtonText: 'View Resume',
      resumeUrl: '/assets/resume_cv/Ratan Kumar Majhi(Resume).pdf',
      cardEffect: 'hover-neon-purple'
    },
    findMeHere: {
      heading: 'Find Me Here',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      mapUrl: '',
      cardEffect: 'hover-neon-purple'
    }
  });
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const updatePageTitle = (field, value) => {
    setEditableData({
      ...editableData,
      pageTitle: {
        ...editableData.pageTitle,
        [field]: value
      }
    });
  };

  const updateProfileSummary = (field, value) => {
    setEditableData({
      ...editableData,
      profileSummary: {
        ...editableData.profileSummary,
        [field]: value
      }
    });
  };

  const updateLocation = (field, value) => {
    setEditableData({
      ...editableData,
      location: {
        ...editableData.location,
        [field]: value
      }
    });
  };

  const updateLocationData = (field, value) => {
    setEditableData({
      ...editableData,
      location: {
        ...editableData.location,
        data: {
          ...editableData.location.data,
          [field]: value
        }
      }
    });
  };

  const updateGetInTouch = (field, value) => {
    setEditableData({
      ...editableData,
      getInTouch: {
        ...editableData.getInTouch,
        [field]: value
      }
    });
  };

  const updateGetInTouchData = (field, value) => {
    setEditableData({
      ...editableData,
      getInTouch: {
        ...editableData.getInTouch,
        data: {
          ...editableData.getInTouch.data,
          [field]: value
        }
      }
    });
  };

  const updateResume = (field, value) => {
    setEditableData({
      ...editableData,
      resume: {
        ...editableData.resume,
        [field]: value
      }
    });
  };

  const updateFindMeHere = (field, value) => {
    setEditableData({
      ...editableData,
      findMeHere: {
        ...editableData.findMeHere,
        [field]: value
      }
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, JPG, or PNG files');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(
        '/api/upload-resume/',
        formData,
        {
          headers: {
            Authorization: `Token ${adminToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        updateResume('resumeUrl', response.data.resume_url);
        alert('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Resume upload failed:', error);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'about_content',
          data: editableData
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`
          }
        }
      );

      if (response.data.success) {
        onSave(editableData);
        alert('About content updated successfully! Page will reload to show changes.');
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

  const gradients = [
    { name: 'Blue-Cyan-Blue', value: 'from-blue-400 via-cyan-400 to-blue-500' },
    { name: 'Purple-Pink-Blue', value: 'from-purple-400 via-pink-400 to-blue-400' },
    { name: 'Green-Teal', value: 'from-green-400 via-teal-400 to-cyan-500' },
    { name: 'Orange-Red', value: 'from-orange-400 via-red-400 to-pink-500' },
    { name: 'Purple-Indigo', value: 'from-purple-500 via-indigo-500 to-blue-600' },
    { name: 'Cyan-Blue', value: 'from-cyan-400 via-blue-500 to-indigo-600' }
  ];

  const textColors = [
    'text-blue-400',
    'text-purple-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
    'text-gray-300',
    'text-white'
  ];

  const fontSizes = {
    heading: [
      { name: 'Small', class: 'text-xl' },
      { name: 'Medium', class: 'text-2xl' },
      { name: 'Large', class: 'text-3xl' }
    ],
    pageTitle: [
      { name: 'Medium', class: 'text-3xl md:text-4xl' },
      { name: 'Large', class: 'text-4xl md:text-5xl' },
      { name: 'Extra Large', class: 'text-5xl md:text-6xl' }
    ],
    text: [
      { name: 'Small', class: 'text-sm' },
      { name: 'Medium', class: 'text-base' },
      { name: 'Large', class: 'text-lg' }
    ]
  };

  const cardEffects = [
    { name: 'Blue Neon', value: 'hover-neon-blue' },
    { name: 'Purple Neon', value: 'hover-neon-purple' },
    { name: 'Green Neon', value: 'hover-neon-green' },
    { name: 'Pink Neon', value: 'neon-pink' }
  ];

  const textAlignments = [
    { name: 'Left', value: 'text-left' },
    { name: 'Justify', value: 'text-justify' }
  ];

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
          className="relative w-full max-w-6xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-blue">
              <FaPalette className="inline mr-2" />
              Edit About Section
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
            {/* Page Title */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Page Title - "About Me"</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title Text
                  </label>
                  <input
                    type="text"
                    value={editableData.pageTitle.text}
                    onChange={(e) => updatePageTitle('text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.pageTitle.map((size) => (
                        <button
                          key={size.class}
                          onClick={() => updatePageTitle('fontSize', size.class)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.pageTitle.fontSize === size.class
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
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <input
                        type="checkbox"
                        checked={editableData.pageTitle.glow || false}
                        onChange={(e) => updatePageTitle('glow', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      Enable Text Glow Effect
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gradient Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {gradients.map((gradient) => (
                      <button
                        key={gradient.value}
                        onClick={() => updatePageTitle('gradient', gradient.value)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableData.pageTitle.gradient === gradient.value
                            ? 'bg-blue-500/30 border-blue-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
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
                  <h2 className={`${editableData.pageTitle.fontSize} font-bold text-center`}>
                    <span className={`bg-gradient-to-r ${editableData.pageTitle.gradient} bg-clip-text text-transparent ${editableData.pageTitle.glow ? 'text-glow-blue' : ''}`}>
                      {editableData.pageTitle.text}
                    </span>
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Profile Summary</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.profileSummary.heading}
                      onChange={(e) => updateProfileSummary('heading', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateProfileSummary('headingColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.profileSummary.headingColor === color
                              ? 'bg-blue-500/30 border-blue-500'
                              : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                          }`}
                        >
                          <span className={`font-semibold ${color}`}>A</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Summary Content
                    </label>
                    {editableData.profileSummary.content && (
                      <button
                        onClick={() => updateProfileSummary('content', '')}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 flex items-center gap-1 text-xs transition-all"
                        title="Clear content"
                      >
                        <FaTrash size={10} /> Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    value={editableData.profileSummary.content}
                    onChange={(e) => updateProfileSummary('content', e.target.value)}
                    rows="4"
                    placeholder="Write your profile summary here..."
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Text Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateProfileSummary('textColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.profileSummary.textColor === color
                              ? 'bg-blue-500/30 border-blue-500'
                              : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                          }`}
                        >
                          <span className={`font-semibold ${color}`}>A</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Effect
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {cardEffects.map((effect) => (
                        <button
                          key={effect.value}
                          onClick={() => updateProfileSummary('cardEffect', effect.value)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.profileSummary.cardEffect === effect.value
                              ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                          }`}
                        >
                          {effect.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Alignment
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {textAlignments.map((align) => (
                      <button
                        key={align.value}
                        onClick={() => updateProfileSummary('textAlign', align.value)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.profileSummary.textAlign === align.value
                            ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                        }`}
                      >
                        {align.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                <FaMapMarkerAlt className="inline mr-2" />
                Location Details
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.location.heading}
                      onChange={(e) => updateLocation('heading', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateLocation('headingColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.location.headingColor === color
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

                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => {
                      updateLocationData('village', '');
                      updateLocationData('post', '');
                      updateLocationData('police_station', '');
                      updateLocationData('district', '');
                      updateLocationData('state', '');
                      updateLocationData('country', '');
                      updateLocationData('pin', '');
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 flex items-center gap-1 text-xs transition-all"
                    title="Clear all location data"
                  >
                    <FaTrash size={10} /> Clear All
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Village</label>
                    <input
                      type="text"
                      value={editableData.location.data.village}
                      onChange={(e) => updateLocationData('village', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Post</label>
                    <input
                      type="text"
                      value={editableData.location.data.post}
                      onChange={(e) => updateLocationData('post', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Police Station</label>
                    <input
                      type="text"
                      value={editableData.location.data.police_station}
                      onChange={(e) => updateLocationData('police_station', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
                    <input
                      type="text"
                      value={editableData.location.data.district}
                      onChange={(e) => updateLocationData('district', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      value={editableData.location.data.state}
                      onChange={(e) => updateLocationData('state', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      value={editableData.location.data.country}
                      onChange={(e) => updateLocationData('country', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={editableData.location.data.pin}
                      onChange={(e) => updateLocationData('pin', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Get In Touch */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Get In Touch Section</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.heading}
                    onChange={(e) => updateGetInTouch('heading', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateGetInTouch('headingColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableData.getInTouch.headingColor === color
                            ? 'bg-blue-500/30 border-blue-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Label
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.emailLabel}
                    onChange={(e) => updateGetInTouchData('emailLabel', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Value
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.email}
                    onChange={(e) => updateGetInTouchData('email', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Label
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.phoneLabel}
                    onChange={(e) => updateGetInTouchData('phoneLabel', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Value
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.phone}
                    onChange={(e) => updateGetInTouchData('phone', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Label
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.locationLabel}
                    onChange={(e) => updateGetInTouchData('locationLabel', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Value
                  </label>
                  <input
                    type="text"
                    value={editableData.getInTouch.data.location}
                    onChange={(e) => updateGetInTouchData('location', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* My Resume */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                <FaFilePdf className="inline mr-2" />
                My Resume Section
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.resume.heading}
                      onChange={(e) => updateResume('heading', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateResume('headingColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.resume.headingColor === color
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Description Text
                    </label>
                    {editableData.resume.description && (
                      <button
                        onClick={() => updateResume('description', '')}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 flex items-center gap-1 text-xs transition-all"
                        title="Clear description"
                      >
                        <FaTrash size={10} /> Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    value={editableData.resume.description}
                    onChange={(e) => updateResume('description', e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Download Button Text
                    </label>
                    <input
                      type="text"
                      value={editableData.resume.downloadButtonText}
                      onChange={(e) => updateResume('downloadButtonText', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      View Button Text
                    </label>
                    <input
                      type="text"
                      value={editableData.resume.viewButtonText}
                      onChange={(e) => updateResume('viewButtonText', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-purple-500/20 pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaUpload className="inline mr-2" />
                    Upload New Resume (PDF, JPG, PNG - Max 10MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                      className="flex-1 px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                    />
                    {uploadingResume && (
                      <div className="spinner border-2 border-purple-400/20 border-t-purple-400 w-6 h-6"></div>
                    )}
                  </div>
                  {editableData.resume.resumeUrl && (
                    <p className="text-xs text-gray-400 mt-2">
                      Current: {editableData.resume.resumeUrl}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Find Me Here */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                <FaMapMarkerAlt className="inline mr-2" />
                Find Me Here (Map) Section
              </h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.findMeHere.heading}
                      onChange={(e) => updateFindMeHere('heading', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateFindMeHere('headingColor', color)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.findMeHere.headingColor === color
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Google Maps Embed URL (Optional - leave empty to use default)
                    </label>
                    {editableData.findMeHere.mapUrl && (
                      <button
                        onClick={() => updateFindMeHere('mapUrl', '')}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 flex items-center gap-1 text-xs transition-all"
                        title="Clear map URL"
                      >
                        <FaTrash size={10} /> Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={editableData.findMeHere.mapUrl}
                    onChange={(e) => updateFindMeHere('mapUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Get embed URL from Google Maps → Share → Embed a map
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all About section data to default? This will clear all your customizations.')) {
                  setEditableData(aboutData);
                }
              }}
              className="px-6 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaTrash /> Reset All to Default
            </button>

            <div className="flex gap-4">
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AboutContentEditor;
