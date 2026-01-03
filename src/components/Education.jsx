import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaUniversity, FaCalendar, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import EducationEditor from './EducationEditor';
import axios from 'axios';

const Education = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showMap, setShowMap] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [educationData, setEducationData] = useState(data || []);
  const [educationContent, setEducationContent] = useState({
    pageTitle: {
      text: 'Education',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: false,
      text3d: false,
    },
    sectionBackground: {
      className: 'bg-gradient-to-b from-black via-purple-900/10 to-black',
    },
    timeline: {
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-blue-500',
    },
    cardStyle: {
      accentClass: 'border border-purple-500/30 hover-neon-purple',
      enable3d: false,
    },
    cardTitle: {
      fontSize: 'text-xl',
      color: 'text-white',
    },
    cardSubTitle: {
      color: 'text-purple-400',
    },
  });

  useEffect(() => {
    if (data) {
      setEducationData(data);
    }
  }, [data]);
  
  useEffect(() => {
    const fetchEducationContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.education_content) {
          setEducationContent((prev) => ({
            ...prev,
            ...response.data.education_content,
            pageTitle: {
              ...prev.pageTitle,
              ...(response.data.education_content.pageTitle || {}),
            },
            sectionBackground: {
              ...prev.sectionBackground,
              ...(response.data.education_content.sectionBackground || {}),
            },
            timeline: {
              ...prev.timeline,
              ...(response.data.education_content.timeline || {}),
            },
            cardStyle: {
              ...prev.cardStyle,
              ...(response.data.education_content.cardStyle || {}),
            },
            cardTitle: {
              ...prev.cardTitle,
              ...(response.data.education_content.cardTitle || {}),
            },
            cardSubTitle: {
              ...prev.cardSubTitle,
              ...(response.data.education_content.cardSubTitle || {}),
            },
          }));
        }
      } catch (error) {
        console.error('Failed to fetch education content:', error);
      }
    };
    fetchEducationContent();
  }, []);

  return (
    <section className={`section-container ${educationContent.sectionBackground.className}`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className={`${educationContent.pageTitle.fontSize} font-bold text-center`}>
              <span className={`bg-gradient-to-r ${educationContent.pageTitle.gradient} bg-clip-text text-transparent ${educationContent.pageTitle.glow ? 'text-glow' : ''} ${educationContent.pageTitle.text3d ? 'text-3d' : ''}`}>
                {educationContent.pageTitle.text}
              </span>
            </h2>
            {isAdmin && isEditMode && (
              <motion.button
                onClick={() => setShowEditor(true)}
                className="relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 overflow-hidden border border-purple-500/50 shadow-[0_10px_30px_rgba(139,92,246,0.35)] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 transition-all"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 opacity-60 blur-lg bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></span>
                <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/20 blur-2xl"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <FaEdit /> Edit
                </span>
              </motion.button>
            )}
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b ${educationContent.timeline.gradientFrom} ${educationContent.timeline.gradientTo}`}></div>

            <div className="space-y-12">
              {educationData?.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  className={`relative flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-8`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-black neon-purple"></div>

                  {/* Content Card */}
                  <div className="flex-1 w-full md:w-auto">
                    <div className={`glass rounded-2xl p-6 relative overflow-hidden ${educationContent.cardStyle.accentClass} ${educationContent.cardStyle.enable3d ? 'card-3d' : ''} ${
                      edu.type === 'masters' ? 'bg-gradient-to-br from-purple-900/20 to-transparent' : ''
                    }`}>
                      {/* Background Image for MCA - Side positioned + subtle full-card wash */}
                      {edu.type === 'masters' && (
                        <>
                          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/B_P_Poddar_Institute_of_Management_Technology.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-45 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-r-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/B_P_Poddar_Institute_of_Management_Technology.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                          </div>
                        </>
                      )}
                      {/* Background Image for BCA - Side positioned + subtle full-card wash */}
                      {edu.type === 'bachelors' && (
                        <>
                          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Prabhat_Kumar_College_Contai.jpeg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-45 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-r-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Prabhat_Kumar_College_Contai.jpeg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                          </div>
                        </>
                      )}
                      {/* Background Image for Higher Secondary - Side positioned + subtle full-card wash */}
                      {edu.type === 'higher_secondary' && (
                        <>
                          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Negua_Sundar_Narayan_High_School.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-45 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-r-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Negua_Sundar_Narayan_High_School.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                          </div>
                        </>
                      )}
                      {/* Background Image for Secondary - Side positioned + subtle full-card wash */}
                      {edu.type === 'secondary' && (
                        <>
                          <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Negua_Sundar_Narayan_High_School2.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-45 pointer-events-none z-0">
                            <div
                              className="w-full h-full bg-cover bg-center rounded-r-2xl"
                              style={{
                                backgroundImage: 'url(/assets/{images,icons}/Negua_Sundar_Narayan_High_School2.jpg)'
                              }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                          </div>
                        </>
                      )}

                      <div className="flex items-start gap-4 mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <FaGraduationCap size={24} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`${educationContent.cardTitle.fontSize} font-bold ${educationContent.cardTitle.color} mb-1`}>
                            {edu.degree}
                          </h3>
                          <p className={`${educationContent.cardSubTitle.color} mb-1`}>{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.university || edu.board}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-2">
                          <FaCalendar /> {edu.duration || edu.year}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaUniversity /> {edu.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg inline-block">
                          <span className="font-semibold">{edu.grade}</span>
                        </div>
                        {(edu.type === 'masters' || edu.type === 'bachelors' || edu.type === 'higher_secondary' || edu.type === 'secondary') && (
                          <button
                            onClick={() => setShowMap(showMap === edu.id ? null : edu.id)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                          >
                            <FaMapMarkerAlt size={12} /> {showMap === edu.id ? 'Hide' : 'Map'}
                          </button>
                        )}
                      </div>

                      {/* Google Map - Shows when button is clicked for MCA */}
                      {edu.type === 'masters' && showMap === edu.id && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <iframe
                              src="https://maps.google.com/maps?q=B.P.+Poddar+Institute+of+Management+and+Technology,+137+VIP+Road+Kolkata&hl=en&z=17&output=embed"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="B.P. Poddar Institute of Management & Technology - 137, V.I.P Road, Kaikhali, Kolkata 700052"
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        </motion.div>
                      )}

                      {/* Google Map - Shows when button is clicked for BCA */}
                      {edu.type === 'bachelors' && showMap === edu.id && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <iframe
                              src="https://maps.google.com/maps?q=Prabhat+Kumar+College,+311+SH+4+Professor+Colony+Karkuli+Contai+West+Bengal+721401&hl=en&z=17&output=embed"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Prabhat Kumar College - 311, SH 4, Professor Colony, Karkuli, Contai, West Bengal 721401"
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        </motion.div>
                      )}

                      {/* Google Map - Shows when button is clicked for Higher Secondary */}
                      {edu.type === 'higher_secondary' && showMap === edu.id && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <iframe
                              src="https://maps.google.com/maps?q=Negua+Sundarnarayan+High+School+RG66+FGM+Midnapore+Nagua+West+Bengal+721448&hl=en&z=17&output=embed"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Negua Sundarnarayan High School - RG66+FGM, Midnapore, Nagua, West Bengal 721448"
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        </motion.div>
                      )}

                      {/* Google Map - Shows when button is clicked for Secondary */}
                      {edu.type === 'secondary' && showMap === edu.id && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative w-full h-64 rounded-lg overflow-hidden">
                            <iframe
                              src="https://maps.google.com/maps?q=Negua+Sundarnarayan+High+School+RG66+FGM+Midnapore+Nagua+West+Bengal+721448&hl=en&z=17&output=embed"
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Negua Sundarnarayan High School - RG66+FGM, Midnapore, Nagua, West Bengal 721448"
                              className="rounded-lg"
                            ></iframe>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {showEditor && (
        <EducationEditor
          education={educationData}
          educationContent={educationContent}
          onSave={(updatedEducation) => {
            setEducationData(updatedEducation);
            setShowEditor(false);
          }}
          onSaveContent={(updatedContent) => {
            setEducationContent(updatedContent);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Education;
