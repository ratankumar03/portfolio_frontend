import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaPalette } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const CertificationsEditor = ({
  certifications,
  certificationsContent,
  onSave,
  onSaveContent,
  onClose,
}) => {
  const { adminToken } = useAdmin();
  const [editableCerts, setEditableCerts] = useState(certifications || []);
  const [editableContent, setEditableContent] = useState(certificationsContent || {
    pageTitle: {
      text: 'Certifications',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: false,
      text3d: false,
    },
    sectionBackground: {
      className: 'bg-gradient-to-b from-black via-purple-900/10 to-black',
    },
    cardStyle: {
      accentClass: 'border border-purple-500/30 hover-neon-purple',
      enable3d: false,
    },
    cardTitle: {
      fontSize: 'text-lg',
      color: 'text-white',
    },
    cardIssuer: {
      color: 'text-purple-400',
    },
    cardDate: {
      color: 'text-gray-500',
    },
    moduleChip: {
      className: 'bg-purple-500/20 text-purple-300',
    },
    descriptionAlign: 'text-left',
  });
  const [saving, setSaving] = useState(false);
  const [moduleInputs, setModuleInputs] = useState({});

  const fontSizes = {
    pageTitle: [
      { name: 'Small', class: 'text-3xl md:text-4xl' },
      { name: 'Medium', class: 'text-4xl md:text-5xl' },
      { name: 'Large', class: 'text-5xl md:text-6xl' },
    ],
    cardTitle: [
      { name: 'Small', class: 'text-base' },
      { name: 'Medium', class: 'text-lg' },
      { name: 'Large', class: 'text-xl' },
    ],
  };

  const gradients = [
    'from-purple-400 via-pink-400 to-purple-600',
    'from-blue-400 via-cyan-400 to-blue-600',
    'from-emerald-400 via-teal-400 to-emerald-600',
    'from-orange-400 via-red-400 to-pink-600',
    'from-indigo-400 via-purple-400 to-pink-600',
    'from-yellow-400 via-orange-400 to-red-600',
  ];

  const sectionBackgrounds = [
    'bg-gradient-to-b from-black via-purple-900/10 to-black',
    'bg-gradient-to-b from-black via-blue-900/10 to-black',
    'bg-gradient-to-b from-black via-emerald-900/10 to-black',
    'bg-gradient-to-b from-black via-pink-900/10 to-black',
    'bg-gradient-to-b from-black via-indigo-900/10 to-black',
  ];

  const accentOptions = [
    { name: 'Purple', className: 'border border-purple-500/30 hover-neon-purple' },
    { name: 'Blue', className: 'border border-blue-500/30 hover-neon-blue' },
    { name: 'Green', className: 'border border-green-500/30 hover-neon-green' },
    { name: 'Pink', className: 'border border-pink-500/30' },
    { name: 'Cyan', className: 'border border-cyan-500/30' },
  ];

  const textColors = [
    'text-white',
    'text-purple-400',
    'text-blue-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
  ];

  const chipStyles = [
    'bg-purple-500/20 text-purple-300',
    'bg-blue-500/20 text-blue-300',
    'bg-green-500/20 text-green-300',
    'bg-orange-500/20 text-orange-300',
    'bg-pink-500/20 text-pink-300',
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

  const addNewCertification = () => {
    setEditableCerts([
      ...editableCerts,
      {
        id: Date.now(),
        title: '',
        issuer: '',
        duration: '',
        description: '',
        modules: [],
      },
    ]);
  };

  const updateCertification = (id, field, value) => {
    setEditableCerts(
      editableCerts.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const deleteCertification = (id) => {
    setEditableCerts(editableCerts.filter((cert) => cert.id !== id));
  };

  const addModule = (id) => {
    const value = (moduleInputs[id] || '').trim();
    if (!value) return;
    setEditableCerts(
      editableCerts.map((cert) =>
        cert.id === id
          ? { ...cert, modules: [...(cert.modules || []), value] }
          : cert
      )
    );
    setModuleInputs({ ...moduleInputs, [id]: '' });
  };

  const removeModule = (id, index) => {
    setEditableCerts(
      editableCerts.map((cert) =>
        cert.id === id
          ? { ...cert, modules: cert.modules.filter((_, i) => i !== index) }
          : cert
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const [certsResponse, contentResponse] = await Promise.all([
        axios.post(
          '/api/update-portfolio/',
          {
            section: 'certifications',
            data: editableCerts,
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
            section: 'certifications_content',
            data: editableContent,
          },
          {
            headers: {
              Authorization: `Token ${adminToken}`,
            },
          }
        ),
      ]);

      if (certsResponse.data.success && contentResponse.data.success) {
        onSave(editableCerts);
        if (onSaveContent) {
          onSaveContent(editableContent);
        }
        alert('Certifications updated successfully! Page will reload to show changes.');
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
              Edit Certifications
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
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">
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
                    className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
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
                            ? 'bg-purple-500/30 border-purple-500 text-purple-300'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
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
                          ? 'bg-purple-500/30 border-purple-500'
                          : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
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
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">
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
                            ? 'bg-blue-500/30 border-blue-500 text-blue-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
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
                            ? 'bg-blue-500/30 border-blue-500 text-blue-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
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
                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
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
                    Title Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardTitle', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardTitle.color === color
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Issuer Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardIssuer', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardIssuer.color === color
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

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('cardDate', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.cardDate.color === color
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Module Chip Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {chipStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => updateContent('moduleChip', 'className', style)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.moduleChip.className === style
                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                        }`}
                      >
                        Chip
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
                          ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
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
                Certifications List
              </h3>
            </div>

            <div className="space-y-4">
              {editableCerts.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className="glass rounded-xl p-4 border border-purple-500/20"
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
                        value={cert.title}
                        onChange={(e) => updateCertification(cert.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={cert.duration}
                        onChange={(e) => updateCertification(cert.id, 'duration', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows="3"
                        value={cert.description}
                        onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                        className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Modules
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={moduleInputs[cert.id] || ''}
                        onChange={(e) => setModuleInputs({ ...moduleInputs, [cert.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addModule(cert.id);
                          }
                        }}
                        placeholder="Add module (e.g., HTML)"
                        className="flex-1 px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      />
                      <button
                        onClick={() => addModule(cert.id)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(cert.modules || []).map((module, moduleIndex) => (
                        <span
                          key={`${cert.id}-${moduleIndex}`}
                          className="px-2 py-1 bg-gray-800/60 text-gray-200 rounded text-xs flex items-center gap-2"
                        >
                          {module}
                          <button
                            onClick={() => removeModule(cert.id, moduleIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => deleteCertification(cert.id)}
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
              onClick={addNewCertification}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
            >
              <FaPlus /> Add Certification
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

export default CertificationsEditor;
