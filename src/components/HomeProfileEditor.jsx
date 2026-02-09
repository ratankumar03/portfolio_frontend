import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const HomeProfileEditor = ({ homeData, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableHome, setEditableHome] = useState(homeData || {});
  const [saving, setSaving] = useState(false);

  const profile = editableHome.profile || {};
  const orbitIcons = profile.orbitIcons || [];

  const updateProfile = (field, value) => {
    setEditableHome({
      ...editableHome,
      profile: {
        ...profile,
        [field]: value,
      },
    });
  };

  const updateOrbitIcon = (id, field, value) => {
    setEditableHome({
      ...editableHome,
      profile: {
        ...profile,
        orbitIcons: orbitIcons.map((icon) =>
          icon.id === id ? { ...icon, [field]: value } : icon
        ),
      },
    });
  };

  const addOrbitIcon = () => {
    setEditableHome({
      ...editableHome,
      profile: {
        ...profile,
        orbitIcons: [
          ...orbitIcons,
          {
            id: Date.now(),
            src: '',
            ring: 1,
            speed: 'medium',
            delay: 0,
            size: 24,
          },
        ],
      },
    });
  };

  const deleteOrbitIcon = (id) => {
    setEditableHome({
      ...editableHome,
      profile: {
        ...profile,
        orbitIcons: orbitIcons.filter((icon) => icon.id !== id),
      },
    });
  };

  const handleProfileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload-profile-image/', formData, {
        headers: {
          Authorization: `Token ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        updateProfile('image', response.data.image_url);
        alert('Profile image uploaded successfully!');
      }
    } catch (error) {
      console.error('Profile upload failed:', error);
      alert('Failed to upload profile image');
    }
  };

  const handleOrbitIconUpload = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload-orbit-icon/', formData, {
        headers: {
          Authorization: `Token ${adminToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        updateOrbitIcon(id, 'src', response.data.image_url);
        alert('Icon uploaded successfully!');
      }
    } catch (error) {
      console.error('Icon upload failed:', error);
      alert('Failed to upload icon');
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'home_content',
          data: editableHome,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableHome);
        alert('Profile updated successfully! Page will reload to show changes.');
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
          className="relative w-full max-w-5xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-purple">
              Edit Home Profile
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="glass rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Profile Image</h3>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div
                  className="w-40 h-40 overflow-hidden border border-purple-500/40 bg-black/30"
                  style={{ borderRadius: `${profile.borderRadius || 9999}px` }}
                >
                  <img
                    src={profile.image || '/assets/{images,icons}/1000287235.jpg'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Profile Image (.jpg/.png)
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleProfileUpload(e.target.files[0])}
                      className="block w-full text-sm text-gray-300"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Size (px)
                      </label>
                      <input
                        type="number"
                        value={profile.size || 320}
                        onChange={(e) => updateProfile('size', parseInt(e.target.value, 10) || 320)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Border Radius (px)
                      </label>
                      <input
                        type="number"
                        value={profile.borderRadius || 160}
                        onChange={(e) => updateProfile('borderRadius', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Border Width (px)
                      </label>
                      <input
                        type="number"
                        value={profile.borderWidth || 4}
                        onChange={(e) => updateProfile('borderWidth', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Border Color
                      </label>
                      <input
                        type="color"
                        value={profile.borderColor || '#8b5cf6'}
                        onChange={(e) => updateProfile('borderColor', e.target.value)}
                        className="w-14 h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <input
                        type="checkbox"
                        checked={!!profile.glow}
                        onChange={(e) => updateProfile('glow', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      Enable Glow
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-400">Orbit Icons</h3>
                <button
                  onClick={addOrbitIcon}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaPlus /> Add Icon
                </button>
              </div>

              <div className="space-y-4">
                {orbitIcons.map((icon, index) => (
                  <motion.div
                    key={icon.id}
                    className="glass rounded-xl p-4 border border-blue-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Icon Image
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={icon.src}
                            onChange={(e) => updateOrbitIcon(icon.id, 'src', e.target.value)}
                            placeholder="/assets/icons/..."
                            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                          <label className="px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 cursor-pointer flex items-center gap-2 transition-all text-sm">
                            <FaImage /> Upload
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={(e) => handleOrbitIconUpload(icon.id, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ring
                          </label>
                          <select
                            value={icon.ring || 1}
                            onChange={(e) => updateOrbitIcon(icon.id, 'ring', parseInt(e.target.value, 10))}
                            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          >
                            <option value={1}>Ring 1</option>
                            <option value={2}>Ring 2</option>
                            <option value={3}>Ring 3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Speed
                          </label>
                          <select
                            value={icon.speed || 'medium'}
                            onChange={(e) => updateOrbitIcon(icon.id, 'speed', e.target.value)}
                            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          >
                            <option value="slow">Slow</option>
                            <option value="medium">Medium</option>
                            <option value="fast">Fast</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Delay (s)
                          </label>
                          <input
                            type="number"
                            value={icon.delay || 0}
                            onChange={(e) => updateOrbitIcon(icon.id, 'delay', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Size (px)
                          </label>
                          <input
                            type="number"
                            value={icon.size || 24}
                            onChange={(e) => updateOrbitIcon(icon.id, 'size', parseInt(e.target.value, 10) || 24)}
                            className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteOrbitIcon(icon.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

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

export default HomeProfileEditor;
