import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const ToolsEditor = ({ tools, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableTools, setEditableTools] = useState(tools || []);
  const [saving, setSaving] = useState(false);

  const addNewTool = () => {
    setEditableTools([
      ...editableTools,
      {
        id: Date.now(),
        name: '',
        icon: '',
        category: '',
        bgImage: '',
      },
    ]);
  };

  const updateTool = (id, field, value) => {
    setEditableTools(
      editableTools.map((tool) =>
        tool.id === id ? { ...tool, [field]: value } : tool
      )
    );
  };

  const deleteTool = (id) => {
    setEditableTools(editableTools.filter((tool) => tool.id !== id));
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
          updateTool(id, 'icon', response.data.image_url);
        } else {
          updateTool(id, 'bgImage', response.data.image_url);
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
          section: 'tools',
          data: editableTools,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableTools);
        alert('Tools & Software updated successfully! Page will reload to show changes.');
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
          className="relative w-full max-w-4xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-blue">
              Edit Tools & Software
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Tools List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {editableTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                className="glass rounded-xl p-4 border border-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Tool Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tool Name
                    </label>
                    <input
                      type="text"
                      value={tool.name}
                      onChange={(e) => updateTool(tool.id, 'name', e.target.value)}
                      placeholder="e.g., Power BI, Excel"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={tool.category}
                      onChange={(e) => updateTool(tool.id, 'category', e.target.value)}
                      placeholder="e.g., Analytics, Design"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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
                        value={tool.icon}
                        onChange={(e) => updateTool(tool.id, 'icon', e.target.value)}
                        placeholder="📊 or /assets/icons/powerbi.png"
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(tool.id, e.target.files[0], 'icon')}
                          className="hidden"
                          id={`icon-${tool.id}`}
                        />
                        <label
                          htmlFor={`icon-${tool.id}`}
                          className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all text-sm"
                        >
                          <FaImage /> Upload Icon
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Image (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(tool.id, e.target.files[0], 'background')}
                        className="hidden"
                        id={`bg-${tool.id}`}
                      />
                      <label
                        htmlFor={`bg-${tool.id}`}
                        className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 cursor-pointer flex items-center justify-center gap-2 transition-all"
                      >
                        <FaImage /> Upload Background
                      </label>
                      {tool.bgImage && (
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
                    onClick={() => deleteTool(tool.id)}
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
              onClick={addNewTool}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaPlus /> Add New Tool
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

export default ToolsEditor;
