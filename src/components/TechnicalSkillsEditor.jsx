import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const TechnicalSkillsEditor = ({ skills, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableSkills, setEditableSkills] = useState(skills || []);
  const [saving, setSaving] = useState(false);

  const addNewSkill = () => {
    setEditableSkills([
      ...editableSkills,
      {
        id: Date.now(),
        name: '',
        icon: '',
        category: '',
        proficiency: 50,
        bgImage: '',
      },
    ]);
  };

  const updateSkill = (id, field, value) => {
    setEditableSkills(
      editableSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  const deleteSkill = (id) => {
    setEditableSkills(editableSkills.filter((skill) => skill.id !== id));
  };

  const handleImageUpload = async (id, file, type = 'icon') => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('skill_id', id);
    formData.append('image_type', type);

    try {
      const response = await axios.post('/api/upload-skill-image/', formData, {
        headers: {
          Authorization: `Token ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        if (type === 'icon') {
          updateSkill(id, 'icon', response.data.image_url);
        } else {
          updateSkill(id, 'bgImage', response.data.image_url);
        }
        alert(`${type === 'icon' ? 'Icon' : 'Background'} image uploaded successfully!`);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'technical_skills',
          data: editableSkills,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableSkills);
        alert('Technical Skills updated successfully! Page will reload to show changes.');
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
          className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-purple">
              Edit Technical Skills
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Skills List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {editableSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="glass rounded-xl p-4 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Skill Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      placeholder="e.g., Python, Django"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      placeholder="e.g., Programming, Framework"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon (Emoji or Image URL)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={skill.icon}
                        onChange={(e) => updateSkill(skill.id, 'icon', e.target.value)}
                        placeholder="🐍 or /assets/icons/python.png"
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(skill.id, e.target.files[0], 'icon')}
                          className="hidden"
                          id={`icon-${skill.id}`}
                        />
                        <label
                          htmlFor={`icon-${skill.id}`}
                          className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all text-sm"
                        >
                          <FaImage /> Upload Icon
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Proficiency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Proficiency (0-100)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.proficiency || 50}
                        onChange={(e) => updateSkill(skill.id, 'proficiency', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-white font-semibold w-12">{skill.proficiency || 50}%</span>
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Image (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(skill.id, e.target.files[0], 'background')}
                        className="hidden"
                        id={`bg-${skill.id}`}
                      />
                      <label
                        htmlFor={`bg-${skill.id}`}
                        className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all"
                      >
                        <FaImage /> Upload Background Image
                      </label>
                      {skill.bgImage && (
                        <span className="text-green-400 text-xs flex items-center">
                          ✓ Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={addNewSkill}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaPlus /> Add New Skill
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

export default TechnicalSkillsEditor;
