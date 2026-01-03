import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPalette } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const SectionHeadingsEditor = ({ headings, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableHeadings, setEditableHeadings] = useState(headings || {
    mainTitle: {
      text: 'Skills & Expertise',
      gradient: 'gradient-text-blue',
      fontSize: 'text-4xl md:text-5xl',
      customGradient: 'from-blue-400 via-cyan-400 to-blue-600'
    },
    technicalSkills: {
      text: 'Technical Skills',
      color: 'text-purple-400',
      fontSize: 'text-3xl'
    },
    toolsSoftware: {
      text: 'Tools & Software',
      color: 'text-blue-400',
      fontSize: 'text-3xl'
    },
    keyConcepts: {
      text: 'Key Concepts',
      gradient: 'gradient-text-purple',
      fontSize: 'text-4xl',
      customGradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: true
    }
  });
  const [saving, setSaving] = useState(false);

  const updateHeading = (section, field, value) => {
    setEditableHeadings({
      ...editableHeadings,
      [section]: {
        ...editableHeadings[section],
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
          section: 'skills_headings',
          data: editableHeadings,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableHeadings);
        alert('Section Headings updated successfully! Page will reload to show changes.');
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

  const presetGradients = [
    { name: 'Blue', class: 'gradient-text-blue', custom: 'from-blue-400 via-cyan-400 to-blue-600' },
    { name: 'Purple', class: 'gradient-text-purple', custom: 'from-purple-400 via-pink-400 to-purple-600' },
    { name: 'Green', class: 'gradient-text-green', custom: 'from-green-400 via-emerald-400 to-green-600' },
    { name: 'Orange', class: 'gradient-text-orange', custom: 'from-orange-400 via-red-400 to-orange-600' },
    { name: 'Pink', class: 'gradient-text-pink', custom: 'from-pink-400 via-rose-400 to-pink-600' },
    { name: 'Cyan', class: 'gradient-text-cyan', custom: 'from-cyan-400 via-blue-400 to-cyan-600' }
  ];

  const presetColors = [
    'text-purple-400',
    'text-blue-400',
    'text-green-400',
    'text-orange-400',
    'text-pink-400',
    'text-cyan-400',
    'text-red-400',
    'text-yellow-400'
  ];

  const fontSizes = [
    { name: 'Small', class: 'text-2xl' },
    { name: 'Medium', class: 'text-3xl' },
    { name: 'Large', class: 'text-4xl' },
    { name: 'Extra Large', class: 'text-4xl md:text-5xl' },
    { name: 'Huge', class: 'text-5xl md:text-6xl' }
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
              Edit Section Headings
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Headings List */}
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            {/* Main Title */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Main Title (H1)</h3>

              <div className="space-y-4">
                {/* Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableHeadings.mainTitle.text}
                    onChange={(e) => updateHeading('mainTitle', 'text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateHeading('mainTitle', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.mainTitle.fontSize === size.class
                            ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gradient Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gradient Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {presetGradients.map((gradient) => (
                      <button
                        key={gradient.class}
                        onClick={() => {
                          updateHeading('mainTitle', 'gradient', gradient.class);
                          updateHeading('mainTitle', 'customGradient', gradient.custom);
                        }}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableHeadings.mainTitle.gradient === gradient.class
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-bold bg-gradient-to-r ${gradient.custom} bg-clip-text text-transparent`}>
                          {gradient.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 glass rounded-lg border border-blue-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h1 className={`${editableHeadings.mainTitle.fontSize} font-bold text-center`}>
                    <span className={`bg-gradient-to-r ${editableHeadings.mainTitle.customGradient} bg-clip-text text-transparent`}>
                      {editableHeadings.mainTitle.text}
                    </span>
                  </h1>
                </div>
              </div>
            </motion.div>

            {/* Technical Skills */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Technical Skills (H3)</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableHeadings.technicalSkills.text}
                    onChange={(e) => updateHeading('technicalSkills', 'text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateHeading('technicalSkills', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.technicalSkills.fontSize === size.class
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
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateHeading('technicalSkills', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.technicalSkills.color === color
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h3 className={`${editableHeadings.technicalSkills.fontSize} font-bold ${editableHeadings.technicalSkills.color} text-center`}>
                    {editableHeadings.technicalSkills.text}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Tools & Software */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Tools & Software (H3)</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableHeadings.toolsSoftware.text}
                    onChange={(e) => updateHeading('toolsSoftware', 'text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateHeading('toolsSoftware', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.toolsSoftware.fontSize === size.class
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
                    Text Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateHeading('toolsSoftware', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.toolsSoftware.color === color
                            ? 'bg-blue-500/30 border-blue-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-blue-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h3 className={`${editableHeadings.toolsSoftware.fontSize} font-bold ${editableHeadings.toolsSoftware.color} text-center`}>
                    {editableHeadings.toolsSoftware.text}
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Key Concepts */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Key Concepts (H3)</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Heading Text
                  </label>
                  <input
                    type="text"
                    value={editableHeadings.keyConcepts.text}
                    onChange={(e) => updateHeading('keyConcepts', 'text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateHeading('keyConcepts', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableHeadings.keyConcepts.fontSize === size.class
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
                    Gradient Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {presetGradients.map((gradient) => (
                      <button
                        key={gradient.class}
                        onClick={() => {
                          updateHeading('keyConcepts', 'gradient', gradient.class);
                          updateHeading('keyConcepts', 'customGradient', gradient.custom);
                        }}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          editableHeadings.keyConcepts.gradient === gradient.class
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-bold bg-gradient-to-r ${gradient.custom} bg-clip-text text-transparent`}>
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
                      checked={editableHeadings.keyConcepts.glow || false}
                      onChange={(e) => updateHeading('keyConcepts', 'glow', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Enable Text Glow Effect
                  </label>
                </div>

                <div className="mt-4 p-4 glass rounded-lg border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <h3 className={`${editableHeadings.keyConcepts.fontSize} font-bold text-center`}>
                    <span className={`bg-gradient-to-r ${editableHeadings.keyConcepts.customGradient} bg-clip-text text-transparent ${editableHeadings.keyConcepts.glow ? 'text-glow' : ''}`}>
                      {editableHeadings.keyConcepts.text}
                    </span>
                  </h3>
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

export default SectionHeadingsEditor;
