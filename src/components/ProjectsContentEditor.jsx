import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPalette, FaPlus, FaTrash, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const ProjectsContentEditor = ({ projectsData, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableData, setEditableData] = useState(projectsData || {
    pageTitle: {
      text: 'My Projects',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: false
    },
    personalProjectsHeading: {
      text: 'Personal Projects',
      fontSize: 'text-3xl',
      color: 'text-purple-400'
    },
    groupProjectsHeading: {
      text: 'Group Projects',
      fontSize: 'text-3xl',
      color: 'text-blue-400'
    },
    cardTextAlign: 'text-left',
    personalProjects: [],
    groupProjects: []
  });
  const [saving, setSaving] = useState(false);

  // Font size options
  const fontSizes = {
    pageTitle: [
      { name: 'Small', class: 'text-3xl md:text-4xl' },
      { name: 'Medium', class: 'text-4xl md:text-5xl' },
      { name: 'Large', class: 'text-5xl md:text-6xl' }
    ],
    sectionHeading: [
      { name: 'Small', class: 'text-2xl' },
      { name: 'Medium', class: 'text-3xl' },
      { name: 'Large', class: 'text-4xl' }
    ]
  };

  // Gradient options
  const gradients = [
    'from-blue-400 via-cyan-400 to-blue-500',
    'from-purple-400 via-pink-400 to-purple-600',
    'from-green-400 via-emerald-400 to-green-600',
    'from-orange-400 via-red-400 to-pink-600',
    'from-indigo-400 via-purple-400 to-pink-600',
    'from-yellow-400 via-orange-400 to-red-600'
  ];

  // Text color options
  const textColors = [
    'text-blue-400',
    'text-purple-400',
    'text-pink-400',
    'text-green-400',
    'text-cyan-400',
    'text-orange-400',
    'text-red-400',
    'text-yellow-400'
  ];

  const textAlignments = [
    { name: 'Left', value: 'text-left' },
    { name: 'Justify', value: 'text-justify' }
  ];

  const updatePageTitle = (field, value) => {
    setEditableData({
      ...editableData,
      pageTitle: {
        ...editableData.pageTitle,
        [field]: value
      }
    });
  };

  const updatePersonalHeading = (field, value) => {
    setEditableData({
      ...editableData,
      personalProjectsHeading: {
        ...editableData.personalProjectsHeading,
        [field]: value
      }
    });
  };

  const updateGroupHeading = (field, value) => {
    setEditableData({
      ...editableData,
      groupProjectsHeading: {
        ...editableData.groupProjectsHeading,
        [field]: value
      }
    });
  };

  const updateCardTextAlign = (value) => {
    setEditableData({
      ...editableData,
      cardTextAlign: value
    });
  };

  const addPersonalProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      duration: '',
      description: '',
      technologies: [],
      features: [],
      github: '',
      icon: '🚀'
    };
    setEditableData({
      ...editableData,
      personalProjects: [...(editableData.personalProjects || []), newProject]
    });
  };

  const addGroupProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      duration: '',
      description: '',
      technologies: [],
      features: [],
      github: '',
      icon: '🚀'
    };
    setEditableData({
      ...editableData,
      groupProjects: [...(editableData.groupProjects || []), newProject]
    });
  };

  const updatePersonalProject = (index, field, value) => {
    const updated = [...editableData.personalProjects];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditableData({
      ...editableData,
      personalProjects: updated
    });
  };

  const updateGroupProject = (index, field, value) => {
    const updated = [...editableData.groupProjects];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditableData({
      ...editableData,
      groupProjects: updated
    });
  };

  const deletePersonalProject = (index) => {
    if (window.confirm('Are you sure you want to delete this personal project?')) {
      const updated = editableData.personalProjects.filter((_, i) => i !== index);
      setEditableData({
        ...editableData,
        personalProjects: updated
      });
    }
  };

  const deleteGroupProject = (index) => {
    if (window.confirm('Are you sure you want to delete this group project?')) {
      const updated = editableData.groupProjects.filter((_, i) => i !== index);
      setEditableData({
        ...editableData,
        groupProjects: updated
      });
    }
  };

  const addTechnology = (type, projectIndex, tech) => {
    if (!tech.trim()) return;

    if (type === 'personal') {
      const updated = [...editableData.personalProjects];
      updated[projectIndex].technologies = [...(updated[projectIndex].technologies || []), tech.trim()];
      setEditableData({
        ...editableData,
        personalProjects: updated
      });
    } else {
      const updated = [...editableData.groupProjects];
      updated[projectIndex].technologies = [...(updated[projectIndex].technologies || []), tech.trim()];
      setEditableData({
        ...editableData,
        groupProjects: updated
      });
    }
  };

  const removeTechnology = (type, projectIndex, techIndex) => {
    if (type === 'personal') {
      const updated = [...editableData.personalProjects];
      updated[projectIndex].technologies = updated[projectIndex].technologies.filter((_, i) => i !== techIndex);
      setEditableData({
        ...editableData,
        personalProjects: updated
      });
    } else {
      const updated = [...editableData.groupProjects];
      updated[projectIndex].technologies = updated[projectIndex].technologies.filter((_, i) => i !== techIndex);
      setEditableData({
        ...editableData,
        groupProjects: updated
      });
    }
  };

  const addFeature = (type, projectIndex, feature) => {
    if (!feature.trim()) return;

    if (type === 'personal') {
      const updated = [...editableData.personalProjects];
      updated[projectIndex].features = [...(updated[projectIndex].features || []), feature.trim()];
      setEditableData({
        ...editableData,
        personalProjects: updated
      });
    } else {
      const updated = [...editableData.groupProjects];
      updated[projectIndex].features = [...(updated[projectIndex].features || []), feature.trim()];
      setEditableData({
        ...editableData,
        groupProjects: updated
      });
    }
  };

  const removeFeature = (type, projectIndex, featureIndex) => {
    if (type === 'personal') {
      const updated = [...editableData.personalProjects];
      updated[projectIndex].features = updated[projectIndex].features.filter((_, i) => i !== featureIndex);
      setEditableData({
        ...editableData,
        personalProjects: updated
      });
    } else {
      const updated = [...editableData.groupProjects];
      updated[projectIndex].features = updated[projectIndex].features.filter((_, i) => i !== featureIndex);
      setEditableData({
        ...editableData,
        groupProjects: updated
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'projects_content',
          data: editableData
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onSave(editableData);
        alert('Projects section updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save projects content:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ProjectEditor = ({ project, index, type }) => {
    const [newTech, setNewTech] = useState('');
    const [newFeature, setNewFeature] = useState('');

    return (
      <div className="glass rounded-xl p-6 border border-blue-500/20 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-blue-400">
            {type === 'personal' ? 'Personal' : 'Group'} Project #{index + 1}
          </h4>
          <button
            onClick={() => type === 'personal' ? deletePersonalProject(index) : deleteGroupProject(index)}
            className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
          >
            <FaTrash /> Delete
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => type === 'personal' ? updatePersonalProject(index, 'name', e.target.value) : updateGroupProject(index, 'name', e.target.value)}
                placeholder="e.g., Stock Analysis Pro"
                className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                value={project.duration || ''}
                onChange={(e) => type === 'personal' ? updatePersonalProject(index, 'duration', e.target.value) : updateGroupProject(index, 'duration', e.target.value)}
                placeholder="e.g., Jan 2024 - Jun 2024"
                className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={project.description || ''}
              onChange={(e) => type === 'personal' ? updatePersonalProject(index, 'description', e.target.value) : updateGroupProject(index, 'description', e.target.value)}
              rows="3"
              placeholder="Describe your project..."
              className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
              <input
                type="url"
                value={project.github || ''}
                onChange={(e) => type === 'personal' ? updatePersonalProject(index, 'github', e.target.value) : updateGroupProject(index, 'github', e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Icon (Emoji)</label>
              <input
                type="text"
                value={project.icon || '🚀'}
                onChange={(e) => type === 'personal' ? updatePersonalProject(index, 'icon', e.target.value) : updateGroupProject(index, 'icon', e.target.value)}
                placeholder="🚀"
                className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-center text-2xl"
                maxLength="2"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTechnology(type, index, newTech);
                    setNewTech('');
                  }
                }}
                placeholder="Add technology (press Enter)"
                className="flex-1 px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                onClick={() => {
                  addTechnology(type, index, newTech);
                  setNewTech('');
                }}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(type, index, techIndex)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTimes size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addFeature(type, index, newFeature);
                    setNewFeature('');
                  }
                }}
                placeholder="Add feature (press Enter)"
                className="flex-1 px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
              <button
                onClick={() => {
                  addFeature(type, index, newFeature);
                  setNewFeature('');
                }}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <FaPlus />
              </button>
            </div>
            <ul className="space-y-2">
              {project.features?.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-start gap-2 text-gray-300 text-sm"
                >
                  <span className="text-purple-400 mt-1">▹</span>
                  <span className="flex-1">{feature}</span>
                  <button
                    onClick={() => removeFeature(type, index, featureIndex)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTimes size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8"
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
              Edit Projects Section
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Page Title */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Page Title - "My Projects"</h3>

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
                    Gradient Colors
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {gradients.map((gradient) => (
                      <button
                        key={gradient}
                        onClick={() => updatePageTitle('gradient', gradient)}
                        className={`h-10 rounded-lg border-2 transition-all ${
                          editableData.pageTitle.gradient === gradient
                            ? 'border-white scale-105'
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                        style={{
                          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                          backgroundImage: `linear-gradient(to right, ${gradient.split(' ').join(', ')})`
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Projects Heading */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-purple-400 mb-4">Personal Projects Heading</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.personalProjectsHeading.text}
                      onChange={(e) => updatePersonalHeading('text', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.sectionHeading.map((size) => (
                        <button
                          key={size.class}
                          onClick={() => updatePersonalHeading('fontSize', size.class)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.personalProjectsHeading.fontSize === size.class
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updatePersonalHeading('color', color)}
                        className={`px-3 py-2 rounded-lg border ${
                          editableData.personalProjectsHeading.color === color
                            ? 'bg-purple-500/30 border-purple-500'
                            : 'bg-gray-800/50 border-gray-700'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Group Projects Heading */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Group Projects Heading</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={editableData.groupProjectsHeading.text}
                      onChange={(e) => updateGroupHeading('text', e.target.value)}
                      className="w-full px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {fontSizes.sectionHeading.map((size) => (
                        <button
                          key={size.class}
                          onClick={() => updateGroupHeading('fontSize', size.class)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            editableData.groupProjectsHeading.fontSize === size.class
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Text Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateGroupHeading('color', color)}
                        className={`px-3 py-2 rounded-lg border ${
                          editableData.groupProjectsHeading.color === color
                            ? 'bg-blue-500/30 border-blue-500'
                            : 'bg-gray-800/50 border-gray-700'
                        }`}
                      >
                        <span className={`font-semibold ${color}`}>A</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card Text Alignment */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-blue-400 mb-4">Card Text Alignment</h3>
              <div className="grid grid-cols-2 gap-2">
                {textAlignments.map((align) => (
                  <button
                    key={align.value}
                    onClick={() => updateCardTextAlign(align.value)}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      editableData.cardTextAlign === align.value
                        ? 'bg-blue-500/30 border-blue-500 text-blue-300'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500/50'
                    }`}
                  >
                    {align.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Personal Projects */}
            <motion.div
              className="glass rounded-xl p-6 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-400">Personal Projects</h3>
                <button
                  onClick={addPersonalProject}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm transition-all"
                >
                  <FaPlus /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {editableData.personalProjects?.map((project, index) => (
                  <ProjectEditor key={project.id} project={project} index={index} type="personal" />
                ))}
                {(!editableData.personalProjects || editableData.personalProjects.length === 0) && (
                  <p className="text-gray-400 text-center py-4">No personal projects added yet. Click "Add Project" to create one.</p>
                )}
              </div>
            </motion.div>

            {/* Group Projects */}
            <motion.div
              className="glass rounded-xl p-6 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-400">Group Projects</h3>
                <button
                  onClick={addGroupProject}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-sm transition-all"
                >
                  <FaPlus /> Add Project
                </button>
              </div>

              <div className="space-y-4">
                {editableData.groupProjects?.map((project, index) => (
                  <ProjectEditor key={project.id} project={project} index={index} type="group" />
                ))}
                {(!editableData.groupProjects || editableData.groupProjects.length === 0) && (
                  <p className="text-gray-400 text-center py-4">No group projects added yet. Click "Add Project" to create one.</p>
                )}
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

export default ProjectsContentEditor;
