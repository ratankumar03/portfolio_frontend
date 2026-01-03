import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaIcons } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const iconOptions = [
  { name: 'GitHub', key: 'github' },
  { name: 'LinkedIn', key: 'linkedin' },
  { name: 'Facebook', key: 'facebook' },
  { name: 'Instagram', key: 'instagram' },
  { name: 'Twitter', key: 'twitter' },
  { name: 'YouTube', key: 'youtube' },
  { name: 'WhatsApp', key: 'whatsapp' },
];

const FooterConnectEditor = ({ socialLinks, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableLinks, setEditableLinks] = useState(socialLinks || []);
  const [saving, setSaving] = useState(false);

  const addLink = () => {
    setEditableLinks([
      ...editableLinks,
      {
        name: '',
        url: '',
        iconKey: 'github',
        color: 'hover:text-gray-400',
        gradient: 'from-gray-600 to-gray-800',
      },
    ]);
  };

  const updateLink = (index, field, value) => {
    const updated = [...editableLinks];
    updated[index] = { ...updated[index], [field]: value };
    setEditableLinks(updated);
  };

  const deleteLink = (index) => {
    setEditableLinks(editableLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'footer_connect',
          data: editableLinks,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableLinks);
        alert('Connect links updated successfully! Page will reload to show changes.');
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-blue">
              Edit Connect Links
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {editableLinks.map((link, index) => (
              <motion.div
                key={`${link.name}-${index}`}
                className="glass rounded-xl p-4 border border-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateLink(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      placeholder="https://"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Icon
                    </label>
                    <select
                      value={link.iconKey || 'github'}
                      onChange={(e) => updateLink(index, 'iconKey', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white select-dark"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gradient
                    </label>
                    <input
                      type="text"
                      value={link.gradient}
                      onChange={(e) => updateLink(index, 'gradient', e.target.value)}
                      placeholder="from-blue-500 to-blue-700"
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => deleteLink(index)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={addLink}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaPlus /> Add Link
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

export default FooterConnectEditor;
