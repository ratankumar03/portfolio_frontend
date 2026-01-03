import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPalette, FaBriefcase, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const ExperienceContentEditor = ({ experienceData, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableData, setEditableData] = useState(experienceData || {
    pageTitle: {
      text: 'Professional Experience',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: false
    },
    experiences: []
  });
  const [saving, setSaving] = useState(false);

  // Helper function to convert "Mon YYYY" to "YYYY-MM" format for date input
  const convertToInputFormat = (dateStr) => {
    if (!dateStr || dateStr === 'Present') return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = dateStr.split(' ');
    if (parts.length !== 2) return '';
    const monthIndex = monthNames.indexOf(parts[0]);
    if (monthIndex === -1) return '';
    const month = String(monthIndex + 1).padStart(2, '0');
    return `${parts[1]}-${month}`;
  };

  // Helper function to convert "YYYY-MM" to "Mon YYYY" format for display
  const convertToDisplayFormat = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const updatePageTitle = (field, value) => {
    setEditableData({
      ...editableData,
      pageTitle: {
        ...editableData.pageTitle,
        [field]: value
      }
    });
  };

  const updateExperience = (index, field, value) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const updateStyling = (index, field, value) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      styling: {
        ...updatedExperiences[index].styling,
        [field]: value
      }
    };
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const addResponsibility = (expIndex) => {
    const updatedExperiences = [...editableData.experiences];
    if (!updatedExperiences[expIndex].responsibilities) {
      updatedExperiences[expIndex].responsibilities = [];
    }
    updatedExperiences[expIndex].responsibilities.push('New responsibility');
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const updateResponsibility = (expIndex, respIndex, value) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[expIndex].responsibilities[respIndex] = value;
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const deleteResponsibility = (expIndex, respIndex) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[expIndex].responsibilities.splice(respIndex, 1);
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const addTechnology = (expIndex) => {
    const updatedExperiences = [...editableData.experiences];
    if (!updatedExperiences[expIndex].technologies) {
      updatedExperiences[expIndex].technologies = [];
    }
    updatedExperiences[expIndex].technologies.push('New Tech');
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const updateTechnology = (expIndex, techIndex, value) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[expIndex].technologies[techIndex] = value;
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const deleteTechnology = (expIndex, techIndex) => {
    const updatedExperiences = [...editableData.experiences];
    updatedExperiences[expIndex].technologies.splice(techIndex, 1);
    setEditableData({
      ...editableData,
      experiences: updatedExperiences
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'experience_content',
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
        alert('Experience content updated successfully! Page will reload to show changes.');
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
    { name: 'Purple-Pink-Purple', value: 'from-purple-400 via-pink-400 to-purple-600' },
    { name: 'Blue-Cyan-Blue', value: 'from-blue-400 via-cyan-400 to-blue-500' },
    { name: 'Green-Teal', value: 'from-green-400 via-teal-400 to-cyan-500' },
    { name: 'Orange-Red', value: 'from-orange-400 via-red-400 to-pink-500' },
    { name: 'Purple-Indigo', value: 'from-purple-500 via-indigo-500 to-blue-600' },
    { name: 'Cyan-Blue', value: 'from-cyan-400 via-blue-500 to-indigo-600' }
  ];

  const textColors = [
    'text-purple-400',
    'text-blue-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
    'text-gray-300',
    'text-white'
  ];

  const fontSizes = {
    pageTitle: [
      { name: 'Medium', class: 'text-3xl md:text-4xl' },
      { name: 'Large', class: 'text-4xl md:text-5xl' },
      { name: 'Extra Large', class: 'text-5xl md:text-6xl' }
    ],
    heading: [
      { name: 'Small', class: 'text-lg' },
      { name: 'Medium', class: 'text-xl' },
      { name: 'Large', class: 'text-2xl' }
    ],
    text: [
      { name: 'Small', class: 'text-sm' },
      { name: 'Medium', class: 'text-base' },
      { name: 'Large', class: 'text-lg' }
    ]
  };

  const cardEffects = [
    { name: 'Purple Neon', value: 'hover-neon-purple' },
    { name: 'Blue Neon', value: 'hover-neon-blue' },
    { name: 'Green Neon', value: 'hover-neon-green' },
    { name: 'Pink Neon', value: 'neon-pink' }
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
          className="relative w-full max-w-6xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-purple">
              <FaPalette className="inline mr-2" />
              Edit Experience Section
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
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Page Title - "Professional Experience"</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title Text
                  </label>
                  <input
                    type="text"
                    value={editableData.pageTitle.text}
                    onChange={(e) => updatePageTitle('text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
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

                <div className="mt-4 p-4 glass rounded-lg border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h2 className={`${editableData.pageTitle.fontSize} font-bold text-center`}>
                    <span className={`bg-gradient-to-r ${editableData.pageTitle.gradient} bg-clip-text text-transparent ${editableData.pageTitle.glow ? 'text-glow-purple' : ''}`}>
                      {editableData.pageTitle.text}
                    </span>
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* Experience Items */}
            {editableData.experiences && editableData.experiences.map((exp, expIndex) => (
              <motion.div
                key={expIndex}
                className="glass rounded-xl p-6 border border-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (expIndex + 1) }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                    <FaBriefcase /> Experience #{expIndex + 1}
                  </h3>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this experience entry?')) {
                        const updatedExperiences = editableData.experiences.filter((_, i) => i !== expIndex);
                        setEditableData({ ...editableData, experiences: updatedExperiences });
                      }
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 flex items-center gap-1 text-xs transition-all"
                  >
                    <FaTrash size={10} /> Delete
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Position/Role</label>
                      <input
                        type="text"
                        value={exp.position || ''}
                        onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type</label>
                      <input
                        type="text"
                        value={exp.employment_type || ''}
                        onChange={(e) => updateExperience(expIndex, 'employment_type', e.target.value)}
                        placeholder="Full-time, Part-time, etc."
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <input
                        type="month"
                        value={convertToInputFormat(exp.start_date)}
                        onChange={(e) => {
                          if (e.target.value) {
                            updateExperience(expIndex, 'start_date', convertToDisplayFormat(e.target.value));
                          } else {
                            updateExperience(expIndex, 'start_date', '');
                          }
                        }}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">Pick month & year from calendar (Current: {exp.start_date || 'Not set'})</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`current-${expIndex}`}
                            checked={exp.end_date === 'Present'}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateExperience(expIndex, 'end_date', 'Present');
                              } else {
                                updateExperience(expIndex, 'end_date', '');
                              }
                            }}
                            className="w-4 h-4 rounded"
                          />
                          <label htmlFor={`current-${expIndex}`} className="text-sm text-gray-300">Currently working here</label>
                        </div>
                        {exp.end_date !== 'Present' && (
                          <>
                            <input
                              type="month"
                              value={convertToInputFormat(exp.end_date)}
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateExperience(expIndex, 'end_date', convertToDisplayFormat(e.target.value));
                                } else {
                                  updateExperience(expIndex, 'end_date', '');
                                }
                              }}
                              className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                            <p className="text-xs text-gray-400">Pick month & year from calendar (Current: {exp.end_date || 'Not set'})</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Styling Options */}
                  <div className="border-t border-purple-500/20 pt-4">
                    <h4 className="text-sm font-semibold text-purple-300 mb-3">Styling Options</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Position Color</label>
                        <div className="grid grid-cols-4 gap-2">
                          {textColors.slice(0, 4).map((color) => (
                            <button
                              key={color}
                              onClick={() => updateStyling(expIndex, 'positionColor', color)}
                              className={`px-2 py-2 rounded border ${
                                exp.styling?.positionColor === color
                                  ? 'bg-purple-500/30 border-purple-500'
                                  : 'bg-gray-800/50 border-gray-700'
                              }`}
                            >
                              <span className={`font-semibold ${color}`}>A</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Card Effect</label>
                        <select
                          value={exp.styling?.cardEffect || 'hover-neon-purple'}
                          onChange={(e) => updateStyling(expIndex, 'cardEffect', e.target.value)}
                          className="w-full px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                        >
                          {cardEffects.map((effect) => (
                            <option key={effect.value} value={effect.value}>{effect.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mt-6">
                          <input
                            type="checkbox"
                            checked={exp.is_current || false}
                            onChange={(e) => updateExperience(expIndex, 'is_current', e.target.checked)}
                            className="w-4 h-4 rounded"
                          />
                          Current Position
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-purple-300">Key Responsibilities</h4>
                      <button
                        onClick={() => addResponsibility(expIndex)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded hover:bg-green-500/30 flex items-center gap-1 text-xs transition-all"
                      >
                        <FaPlus size={10} /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {exp.responsibilities && exp.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={resp}
                            onChange={(e) => updateResponsibility(expIndex, respIndex, e.target.value)}
                            className="flex-1 px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                          />
                          <button
                            onClick={() => deleteResponsibility(expIndex, respIndex)}
                            className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition-all"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-purple-300">Technologies Used</h4>
                      <button
                        onClick={() => addTechnology(expIndex)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded hover:bg-green-500/30 flex items-center gap-1 text-xs transition-all"
                      >
                        <FaPlus size={10} /> Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies && exp.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => updateTechnology(expIndex, techIndex, e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-purple-300 w-20"
                          />
                          <button
                            onClick={() => deleteTechnology(expIndex, techIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.confirm('Reset all Experience section data to default?')) {
                  setEditableData(experienceData);
                }
              }}
              className="px-6 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaTrash /> Reset All
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

export default ExperienceContentEditor;
