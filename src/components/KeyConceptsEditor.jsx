import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

const KeyConceptsEditor = ({ concepts, onSave, onClose }) => {
  const { adminToken } = useAdmin();
  const [editableConcepts, setEditableConcepts] = useState(concepts || []);
  const [saving, setSaving] = useState(false);
  const [newConcept, setNewConcept] = useState('');

  const addNewConcept = () => {
    if (newConcept.trim()) {
      setEditableConcepts([...editableConcepts, newConcept.trim()]);
      setNewConcept('');
    }
  };

  const updateConcept = (index, value) => {
    const updated = [...editableConcepts];
    updated[index] = value;
    setEditableConcepts(updated);
  };

  const deleteConcept = (index) => {
    setEditableConcepts(editableConcepts.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.post(
        '/api/update-portfolio/',
        {
          section: 'key_concepts',
          data: editableConcepts,
        },
        {
          headers: {
            Authorization: `Token ${adminToken}`,
          },
        }
      );

      if (response.data.success) {
        onSave(editableConcepts);
        alert('Key Concepts updated successfully! Page will reload to show changes.');
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
          className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text-purple">
              Edit Key Concepts
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Add New Concept */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add New Concept
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNewConcept()}
                placeholder="e.g., OOP, Data Structures, REST API"
                className="flex-1 px-4 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
              <button
                onClick={addNewConcept}
                className="px-6 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 font-medium transition-all"
              >
                <FaPlus /> Add
              </button>
            </div>
          </div>

          {/* Concepts List */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 mb-6">
            {editableConcepts.map((concept, index) => {
              const colors = [
                'border-purple-500/40 bg-purple-500/10',
                'border-blue-500/40 bg-blue-500/10',
                'border-green-500/40 bg-green-500/10',
                'border-orange-500/40 bg-orange-500/10',
                'border-violet-500/40 bg-violet-500/10',
              ];
              const colorClass = colors[index % colors.length];

              return (
                <motion.div
                  key={index}
                  className={`glass rounded-lg p-3 border ${colorClass} flex items-center gap-3`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <span className="text-gray-400 font-semibold min-w-[30px]">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => updateConcept(index, e.target.value)}
                    className="flex-1 px-3 py-2 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white bg-black/20"
                  />
                  <button
                    onClick={() => deleteConcept(index)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center gap-2 text-sm transition-all"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {editableConcepts.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No concepts added yet. Add your first concept above!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
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

export default KeyConceptsEditor;
