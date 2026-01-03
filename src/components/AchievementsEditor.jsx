import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaPalette } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const AchievementsEditor = ({
  achievements,
  achievementsContent,
  onSave,
  onSaveContent,
  onClose,
}) => {
  const { adminToken } = useAdmin();
  const [editableAchievements, setEditableAchievements] = useState(achievements || []);
  const [editableContent, setEditableContent] = useState(achievementsContent || {
    pageTitle: {
      text: 'Achievements',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: false,
      text3d: false,
    },
    sectionBackground: {
      className: 'bg-gradient-to-b from-black via-blue-900/10 to-black',
    },
    cardStyle: {
      accentClass: 'border border-blue-500/30 hover-neon-blue',
      enable3d: false,
    },
    cardTitle: {
      fontSize: 'text-xl',
      color: 'text-white',
    },
    cardOrg: {
      color: 'text-blue-400',
    },
    cardYear: {
      color: 'text-gray-500',
    },
    descriptionAlign: 'text-left',
  });
  const [saving, setSaving] = useState(false);

  const fontSizes = {
    pageTitle: [
      { name: 'Small', class: 'text-3xl md:text-4xl' },
      { name: 'Medium', class: 'text-4xl md:text-5xl' },
      { name: 'Large', class: 'text-5xl md:text-6xl' },
    ],
    cardTitle: [
      { name: 'Small', class: 'text-lg' },
      { name: 'Medium', class: 'text-xl' },
      { name: 'Large', class: 'text-2xl' },
    ],
  };

  const gradients = [
    'from-blue-400 via-cyan-400 to-blue-500',
    'from-purple-400 via-pink-400 to-purple-600',
    'from-emerald-400 via-teal-400 to-emerald-600',
    'from-orange-400 via-red-400 to-pink-600',
    'from-indigo-400 via-purple-400 to-pink-600',
    'from-yellow-400 via-orange-400 to-red-600',
  ];

  const sectionBackgrounds = [
    'bg-gradient-to-b from-black via-blue-900/10 to-black',
    'bg-gradient-to-b from-black via-purple-900/10 to-black',
    'bg-gradient-to-b from-black via-emerald-900/10 to-black',
    'bg-gradient-to-b from-black via-pink-900/10 to-black',
    'bg-gradient-to-b from-black via-indigo-900/10 to-black',
  ];

  const accentOptions = [
    { name: 'Blue', className: 'border border-blue-500/30 hover-neon-blue' },
    { name: 'Purple', className: 'border border-purple-500/30 hover-neon-purple' },
    { name: 'Green', className: 'border border-green-500/30 hover-neon-green' },
    { name: 'Pink', className: 'border border-pink-500/30' },
    { name: 'Cyan', className: 'border border-cyan-500/30' },
  ];

  const textColors = [
    'text-white',
    'text-blue-400',
    'text-purple-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
  ];

  const textAlignments = [
    { name: 'Left', value: 'text-left' },
    { name: 'Justify', value: 'text-justify' }
  ];

  const updateContent = (section, field, value) => {
    setEditableContent({
      ...editableContent,
      [section]: {
        ...editableContent[section],
        [field]: value,
      },
    });
  };

  const updateDescriptionAlign = (value) => {
    setEditableContent({
      ...editableContent,
      descriptionAlign: value,
    });
  };

  const addNewAchievement = () => {
    setEditableAchievements([
      ...editableAchievements,
      {
        id: Date.now(),
        title: '',
        organization: '',
        description: '',
        year: '',
      },
    ]);
  };

  const updateAchievement = (id, field, value) => {
    setEditableAchievements(
      editableAchievements.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteAchievement = (id) => {
    setEditableAchievements(editableAchievements.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const [achievementsResponse, contentResponse] = await Promise.all([
        axios.post(
          '/api/update-portfolio/',
          {
            section: 'achievements',
            data: editableAchievements,
          },
          {
            headers: {
              Authorization: `Token ${adminToken}`,
            },
          }
        ),
        axios.post(
          '/api/update-portfolio/',
          {
            section: 'achievements_content',
            data: editableContent,
          },
          {
            headers: {
              Authorization: `Token ${adminToken}`,
            },
          }
        ),
      ]);

      if (achievementsResponse.data.success && contentResponse.data.success) {
        onSave(editableAchievements);
        if (onSaveContent) {
          onSaveContent(editableContent);
        }
        alert('Achievements updated successfully! Page will reload to show changes.');
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
          className="relative w-full max-w-5xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-blue">
              Edit Achievements
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">
                <FaPalette className="inline mr-2" />
                Title Style
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title Text
                  </label>
                  <input
                    type="text"
                    value={editableContent.pageTitle.text}
                    onChange={(e) => updateContent('pageTitle', 'text', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.pageTitle.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateContent('pageTitle', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.pageTitle.fontSize === size.class
                            ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gradient Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gradients.map((gradient) => (
                    <button
                      key={gradient}
                      onClick={() => updateContent('pageTitle', 'gradient', gradient)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        editableContent.pageTitle.gradient === gradient
                          ? 'bg-blue-500/30 border-blue-500'
                          : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50'
                      }`}
                    >
                      <span className={`font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent text-sm`}>
                        Gradient
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={editableContent.pageTitle.glow || false}
                    onChange={(e) => updateContent('pageTitle', 'glow', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Glow Effect
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={editableContent.pageTitle.text3d || false}
                    onChange={(e) => updateContent('pageTitle', 'text3d', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  3D Text
                </label>
              </div>
            </motion.div>

            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                Background and Cards
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Section Background
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sectionBackgrounds.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => updateContent('sectionBackground', 'className', bg)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.sectionBackground.className === bg
                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                        }`}
                      >
                        Background
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Accent
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => updateContent('cardStyle', 'accentClass', option.className)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.cardStyle.accentClass === option.className
                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mt-3">
                    <input
                      type="checkbox"
                      checked={editableContent.cardStyle.enable3d || false}
                      onChange={(e) => updateContent('cardStyle', 'enable3d', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Card 3D Hover
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Title Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.cardTitle.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateContent('cardTitle', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.cardTitle.fontSize === size.class
                            ? 'bg-blue-500/30 border-blue-500 text-blue-200'
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
                    Title Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardTitle', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardTitle.color === color
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
                    Organization Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardOrg', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardOrg.color === color
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
                    Year Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardYear', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardYear.color === color
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description Alignment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {textAlignments.map((align) => (
                    <button
                      key={align.value}
                      onClick={() => updateDescriptionAlign(align.value)}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        editableContent.descriptionAlign === align.value
                          ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                      }`}
                    >
                      {align.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Achievements List
              </h3>
            </div>

            <div className="space-y-4">
              {editableAchievements.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="glass rounded-xl p-4 border border-blue-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateAchievement(item.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={item.organization}
                        onChange={(e) => updateAchievement(item.id, 'organization', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => updateAchievement(item.id, 'year', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="3"
                        value={item.description}
                        onChange={(e) => updateAchievement(item.id, 'description', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => deleteAchievement(item.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={addNewAchievement}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaPlus /> Add Achievement
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

export default AchievementsEditor;
