import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave, FaPalette } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const ContactEditor = ({
  contactContent,
  fallbackItems,
  onSaveContent,
  onClose,
}) => {
  const { adminToken } = useAdmin();
  const [editableContent, setEditableContent] = useState(contactContent || {
    pageTitle: {
      text: 'Get In Touch',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: false,
      text3d: false,
    },
    subTitle: {
      text: 'Have a project in mind or want to collaborate? Feel free to reach out!',
      color: 'text-gray-400',
      fontSize: 'text-base md:text-lg',
      textAlign: 'text-center',
    },
    sectionBackground: {
      className: 'bg-gradient-to-b from-black via-purple-900/10 to-black',
    },
    infoCard: {
      accentClass: 'hover-neon-purple',
      enable3d: false,
      labelColor: 'text-gray-500',
      valueColor: 'text-white',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    formCard: {
      accentClass: 'hover-neon-purple',
      enable3d: false,
    },
    button: {
      className: 'btn-send-green',
    },
    contactItems: [],
    formFields: [
      {
        id: 1,
        name: 'name',
        type: 'text',
        label: 'Your Name',
        placeholder: 'Your Name',
        required: true,
      },
      {
        id: 2,
        name: 'email',
        type: 'email',
        label: 'Your Email',
        placeholder: 'Your Email',
        required: true,
      },
      {
        id: 3,
        name: 'subject',
        type: 'text',
        label: 'Subject',
        placeholder: 'Subject',
        required: false,
      },
      {
        id: 4,
        name: 'message',
        type: 'textarea',
        label: 'Your Message',
        placeholder: 'Your Message',
        required: true,
        rows: 5,
      },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  const fontSizes = {
    pageTitle: [
      { name: 'Small', class: 'text-3xl md:text-4xl' },
      { name: 'Medium', class: 'text-4xl md:text-5xl' },
      { name: 'Large', class: 'text-5xl md:text-6xl' },
    ],
    subTitle: [
      { name: 'Small', class: 'text-sm md:text-base' },
      { name: 'Medium', class: 'text-base md:text-lg' },
      { name: 'Large', class: 'text-lg md:text-xl' },
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
    { name: 'Purple', className: 'hover-neon-purple' },
    { name: 'Blue', className: 'hover-neon-blue' },
    { name: 'Green', className: 'hover-neon-green' },
  ];

  const textColors = [
    'text-white',
    'text-gray-400',
    'text-gray-500',
    'text-purple-400',
    'text-blue-400',
    'text-cyan-400',
    'text-green-400',
    'text-pink-400',
    'text-orange-400',
  ];

  const iconBgColors = [
    'bg-purple-500/20',
    'bg-blue-500/20',
    'bg-green-500/20',
    'bg-pink-500/20',
    'bg-orange-500/20',
  ];

  const buttonStyles = [
    { name: 'Green Glow', className: 'btn-send-green' },
    { name: 'Primary', className: 'btn-primary' },
    { name: 'Secondary', className: 'btn-secondary' },
    { name: 'Glass', className: 'glass border border-white/10 text-white' },
    { name: 'Outline', className: 'border border-purple-500 text-purple-400 bg-transparent' },
  ];

  const textAlignments = [
    { name: 'Center', value: 'text-center' },
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

  useEffect(() => {
    if (hasBootstrapped) return;
    if ((!editableContent.contactItems || editableContent.contactItems.length === 0) && fallbackItems && fallbackItems.length > 0) {
      setEditableContent((prev) => ({
        ...prev,
        contactItems: fallbackItems,
      }));
      setHasBootstrapped(true);
    }
  }, [editableContent.contactItems, fallbackItems, hasBootstrapped]);

  const addContactItem = () => {
    setEditableContent({
      ...editableContent,
      contactItems: [
        ...(editableContent.contactItems || []),
        {
          id: Date.now(),
          label: '',
          value: '',
          type: 'email',
          href: '',
        },
      ],
    });
  };

  const updateContactItem = (id, field, value) => {
    setEditableContent({
      ...editableContent,
      contactItems: editableContent.contactItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const deleteContactItem = (id) => {
    setEditableContent({
      ...editableContent,
      contactItems: editableContent.contactItems.filter((item) => item.id !== id),
    });
  };

  const addFormField = () => {
    setEditableContent({
      ...editableContent,
      formFields: [
        ...(editableContent.formFields || []),
        {
          id: Date.now(),
          name: '',
          type: 'text',
          label: '',
          placeholder: '',
          required: false,
        },
      ],
    });
  };

  const updateFormField = (id, field, value) => {
    setEditableContent({
      ...editableContent,
      formFields: (editableContent.formFields || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const deleteFormField = (id) => {
    setEditableContent({
      ...editableContent,
      formFields: (editableContent.formFields || []).filter((item) => item.id !== id),
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'contact_content',
          data: editableContent,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        if (onSaveContent) {
          onSaveContent(editableContent);
        }
        alert('Contact updated successfully! Page will reload to show changes.');
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
              Edit Contact
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle Text
                </label>
                <input
                  type="text"
                  value={editableContent.subTitle.text}
                  onChange={(e) => updateContent('subTitle', 'text', e.target.value)}
                  className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.subTitle.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => updateContent('subTitle', 'fontSize', size.class)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.subTitle.fontSize === size.class
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
                    Subtitle Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('subTitle', 'color', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.subTitle.color === color
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtitle Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {textAlignments.map((align) => (
                    <button
                      key={align.value}
                      onClick={() => updateContent('subTitle', 'textAlign', align.value)}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        editableContent.subTitle.textAlign === align.value
                          ? 'bg-purple-500/30 border-purple-500 text-purple-300'
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                      }`}
                    >
                      {align.name}
                    </button>
                  ))}
                </div>
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
                    Contact Card Accent
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => updateContent('infoCard', 'accentClass', option.className)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.infoCard.accentClass === option.className
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
                      checked={editableContent.infoCard.enable3d || false}
                      onChange={(e) => updateContent('infoCard', 'enable3d', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Card 3D Hover
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Label Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('infoCard', 'labelColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.infoCard.labelColor === color
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
                    Value Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('infoCard', 'valueColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.infoCard.valueColor === color
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
                    Icon Colors
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {iconBgColors.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => updateContent('infoCard', 'iconBg', bg)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.infoCard.iconBg === bg
                            ? 'bg-blue-500/30 border-blue-500 text-blue-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                        }`}
                      >
                        Icon BG
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateContent('infoCard', 'iconColor', color)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          editableContent.infoCard.iconColor === color
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
                    Form Card Accent
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => updateContent('formCard', 'accentClass', option.className)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.formCard.accentClass === option.className
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
                      checked={editableContent.formCard.enable3d || false}
                      onChange={(e) => updateContent('formCard', 'enable3d', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    Form 3D Hover
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Submit Button Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {buttonStyles.map((style) => (
                      <button
                        key={style.name}
                        onClick={() => updateContent('button', 'className', style.className)}
                        className={`px-3 py-2 rounded-lg border transition-all text-xs ${
                          editableContent.button.className === style.className
                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Contact Fields
                </h3>
                <button
                  onClick={addContactItem}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaPlus /> Add Field
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="space-y-4">
                {(editableContent.contactItems || []).map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="glass rounded-xl p-4 border border-purple-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateContactItem(item.id, 'label', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Value
                        </label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updateContactItem(item.id, 'value', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => updateContactItem(item.id, 'type', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="location">Location</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Link (optional)
                        </label>
                        <input
                          type="text"
                          value={item.href || ''}
                          onChange={(e) => updateContactItem(item.id, 'href', e.target.value)}
                          placeholder="mailto:, tel:, https://"
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteContactItem(item.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass rounded-xl p-4 border border-blue-500/20 h-fit">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Preview List</h4>
                <div className="space-y-3">
                  {(editableContent.contactItems || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs uppercase">
                        {item.type?.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label || 'Label'}</p>
                        <p className="text-sm text-gray-200">{item.value || 'Value'}</p>
                      </div>
                    </div>
                  ))}
                  {(!editableContent.contactItems || editableContent.contactItems.length === 0) && (
                    <p className="text-sm text-gray-500">No fields added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Form Fields
                </h3>
                <button
                  onClick={addFormField}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaPlus /> Add Field
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="space-y-4">
                {(editableContent.formFields || []).map((fieldItem, index) => (
                  <motion.div
                    key={fieldItem.id}
                    className="glass rounded-xl p-4 border border-purple-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={fieldItem.label}
                          onChange={(e) => updateFormField(fieldItem.id, 'label', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name Key
                        </label>
                        <input
                          type="text"
                          value={fieldItem.name}
                          onChange={(e) => updateFormField(fieldItem.id, 'name', e.target.value)}
                          placeholder="e.g., company"
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Type
                        </label>
                        <select
                          value={fieldItem.type}
                          onChange={(e) => updateFormField(fieldItem.id, 'type', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="textarea">Textarea</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={fieldItem.placeholder}
                          onChange={(e) => updateFormField(fieldItem.id, 'placeholder', e.target.value)}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Rows (textarea)
                        </label>
                        <input
                          type="number"
                          value={fieldItem.rows || ''}
                          onChange={(e) => updateFormField(fieldItem.id, 'rows', parseInt(e.target.value, 10) || '')}
                          className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-8">
                        <input
                          type="checkbox"
                          checked={!!fieldItem.required}
                          onChange={(e) => updateFormField(fieldItem.id, 'required', e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-300">Required</span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteFormField(fieldItem.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="glass rounded-xl p-4 border border-blue-500/20 h-fit">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Form Preview</h4>
                <div className="space-y-3">
                  {(editableContent.formFields || []).map((fieldItem) => (
                    <div key={fieldItem.id} className="rounded-lg bg-black/20 border border-white/5 p-3">
                      <p className="text-xs text-gray-400">{fieldItem.label || 'Field'}</p>
                      <p className="text-sm text-gray-200">
                        {fieldItem.placeholder || fieldItem.name || 'placeholder'}
                      </p>
                    </div>
                  ))}
                  {(!editableContent.formFields || editableContent.formFields.length === 0) && (
                    <p className="text-sm text-gray-500">No fields added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
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

export default ContactEditor;
