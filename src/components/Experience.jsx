import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import ExperienceContentEditor from './ExperienceContentEditor';
import axios from 'axios';

const Experience = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showMap, setShowMap] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // Experience content state
  const [experienceContent, setExperienceContent] = useState({
    pageTitle: {
      text: 'Professional Experience',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: false
    },
    experiences: data || [],
    keyResponsibilitiesHeading: {
      text: 'Key Responsibilities:',
      fontSize: 'text-lg',
      color: 'text-gray-200'
    },
    technologiesUsedHeading: {
      text: 'Technologies Used:',
      fontSize: 'text-lg',
      color: 'text-gray-200'
    },
    officeLocationHeading: {
      text: 'Office Location',
      fontSize: 'text-lg',
      color: 'text-gray-200'
    },
    currentBadge: {
      text: 'Current',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    googleMapButton: {
      showText: 'Google Map',
      hideText: 'Hide Map',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      hoverBg: 'hover:bg-blue-500/30'
    }
  });

  // Fetch custom experience content from backend
  useEffect(() => {
    const fetchExperienceContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.experience_content) {
          const fetchedContent = response.data.experience_content;
          // Merge with existing experience data if experiences array is empty
          if (!fetchedContent.experiences || fetchedContent.experiences.length === 0) {
            fetchedContent.experiences = data || [];
          }
          setExperienceContent(fetchedContent);
        }
      } catch (error) {
        console.error('Failed to fetch experience content:', error);
      }
    };
    fetchExperienceContent();
  }, [data]);

  return (
    <section className="section-container bg-gradient-to-b from-black via-purple-900/10 to-black relative">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Edit Button */}
          {isAdmin && isEditMode && (
            <button
              onClick={() => setShowEditor(true)}
              className="absolute top-24 right-8 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 flex items-center gap-2 text-sm font-medium transition-all z-10"
              title="Edit Experience Section"
            >
              <FaEdit /> Edit Experience
            </button>
          )}

          <h2 className={`${experienceContent.pageTitle.fontSize} font-bold text-center mb-16`}>
            <span className={`bg-gradient-to-r ${experienceContent.pageTitle.gradient} bg-clip-text text-transparent ${experienceContent.pageTitle.glow ? 'text-glow-purple' : ''}`}>
              {experienceContent.pageTitle.text}
            </span>
          </h2>

          <div className="space-y-8">
            {(experienceContent.experiences || data)?.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`glass rounded-2xl p-8 ${exp.cardEffect || 'hover-neon-purple'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h3 className={`${exp.positionSize || 'text-2xl'} font-bold ${exp.positionColor || 'text-purple-400'} mb-2`}>
                      {exp.position}
                    </h3>
                    <p className={`${exp.companySize || 'text-xl'} ${exp.companyColor || 'text-gray-300'} mb-2`}>{exp.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt /> {exp.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaBriefcase /> {exp.employment_type}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCalendar /> {exp.start_date} - {exp.end_date}
                      </span>
                    </div>
                  </div>
                  {exp.is_current && (
                    <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                      <span className={`px-4 py-2 ${experienceContent.currentBadge?.bgColor || 'bg-green-500/20'} ${experienceContent.currentBadge?.textColor || 'text-green-400'} rounded-full text-sm font-medium`}>
                        {experienceContent.currentBadge?.text || 'Current'}
                      </span>
                      <button
                        onClick={() => setShowMap(!showMap)}
                        className={`px-4 py-2 ${experienceContent.googleMapButton?.bgColor || 'bg-blue-500/20'} ${experienceContent.googleMapButton?.textColor || 'text-blue-400'} ${experienceContent.googleMapButton?.hoverBg || 'hover:bg-blue-500/30'} rounded-full text-sm font-medium flex items-center gap-2 transition-colors`}
                      >
                        <FaMapMarkerAlt /> {showMap ? (experienceContent.googleMapButton?.hideText || 'Hide Map') : (experienceContent.googleMapButton?.showText || 'Google Map')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className={`${experienceContent.keyResponsibilitiesHeading?.fontSize || 'text-lg'} font-semibold ${experienceContent.keyResponsibilitiesHeading?.color || 'text-gray-200'} mb-3`}>
                    {experienceContent.keyResponsibilitiesHeading?.text || 'Key Responsibilities:'}
                  </h4>
                  <ul className="space-y-2">
                    {exp.responsibilities?.map((resp, idx) => (
                      <li key={idx} className="text-gray-400 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">▹</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`${experienceContent.technologiesUsedHeading?.fontSize || 'text-lg'} font-semibold ${experienceContent.technologiesUsedHeading?.color || 'text-gray-200'} mb-3`}>
                    {experienceContent.technologiesUsedHeading?.text || 'Technologies Used:'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Google Map - Shows when button is clicked */}
                {exp.is_current && showMap && (
                  <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h4 className={`${experienceContent.officeLocationHeading?.fontSize || 'text-lg'} font-semibold ${experienceContent.officeLocationHeading?.color || 'text-gray-200'} mb-3 flex items-center gap-2`}>
                      <FaMapMarkerAlt className="text-blue-400" /> {experienceContent.officeLocationHeading?.text || 'Office Location'}
                    </h4>
                    <div className="relative w-full h-96 rounded-lg overflow-hidden">
                      <iframe
                        src={exp.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.5!2d88.386!3d22.6298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89d7f3f3f3f3f%3A0x1234567890abcdef!2s9%2F6%20Kalicharan%20Ghosh%20Road%2C%20Sinthi%2C%20Kolkata%2C%20West%20Bengal%20700050%2C%20India!5e0!3m2!1sen!2sin!4v1735651234567!5m2!1sen!2sin"}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location - 9/6 Kalicharan Ghosh Road, Sinthi, Kolkata 700050"
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Experience Content Editor Modal */}
      {showEditor && (
        <ExperienceContentEditor
          experienceData={experienceContent}
          onSave={(updatedContent) => {
            setExperienceContent(updatedContent);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Experience;
