import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaCalendar, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import CertificationsEditor from './CertificationsEditor';
import axios from 'axios';

const Certifications = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showEditor, setShowEditor] = useState(false);
  const [certificationsData, setCertificationsData] = useState(data || []);
  const [certificationsContent, setCertificationsContent] = useState({
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

  useEffect(() => {
    if (data) {
      setCertificationsData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchCertificationsContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.certifications_content) {
          setCertificationsContent((prev) => ({
            ...prev,
            ...response.data.certifications_content,
            pageTitle: {
              ...prev.pageTitle,
              ...(response.data.certifications_content.pageTitle || {}),
            },
            sectionBackground: {
              ...prev.sectionBackground,
              ...(response.data.certifications_content.sectionBackground || {}),
            },
            cardStyle: {
              ...prev.cardStyle,
              ...(response.data.certifications_content.cardStyle || {}),
            },
            cardTitle: {
              ...prev.cardTitle,
              ...(response.data.certifications_content.cardTitle || {}),
            },
            cardIssuer: {
              ...prev.cardIssuer,
              ...(response.data.certifications_content.cardIssuer || {}),
            },
            cardDate: {
              ...prev.cardDate,
              ...(response.data.certifications_content.cardDate || {}),
            },
            moduleChip: {
              ...prev.moduleChip,
              ...(response.data.certifications_content.moduleChip || {}),
            },
          }));
        }
      } catch (error) {
        console.error('Failed to fetch certifications content:', error);
      }
    };
    fetchCertificationsContent();
  }, []);

  return (
    <section className={`section-container ${certificationsContent.sectionBackground.className}`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className={`${certificationsContent.pageTitle.fontSize} font-bold text-center`}>
              <span className={`bg-gradient-to-r ${certificationsContent.pageTitle.gradient} bg-clip-text text-transparent ${certificationsContent.pageTitle.glow ? 'text-glow' : ''} ${certificationsContent.pageTitle.text3d ? 'text-3d' : ''}`}>
                {certificationsContent.pageTitle.text}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationsData?.map((cert, index) => (
              <motion.div
                key={cert.id}
                className={`glass rounded-2xl p-6 group ${certificationsContent.cardStyle.accentClass} ${certificationsContent.cardStyle.enable3d ? 'card-3d' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
                    <FaCertificate size={24} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`${certificationsContent.cardTitle.fontSize} font-bold ${certificationsContent.cardTitle.color} mb-2 group-hover:text-purple-400 transition-colors`}>
                      {cert.title}
                    </h3>
                    <p className={`${certificationsContent.cardIssuer.color} text-sm mb-1`}>{cert.issuer}</p>
                    <p className={`${certificationsContent.cardDate.color} text-xs flex items-center gap-2`}>
                      <FaCalendar /> {cert.duration}
                    </p>
                  </div>
                </div>

                <p className={`text-sm text-gray-400 mb-3 ${certificationsContent.descriptionAlign || 'text-left'}`}>{cert.description}</p>

                {cert.modules && (
                  <div className="flex flex-wrap gap-2">
                    {cert.modules.map((module, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs ${certificationsContent.moduleChip.className}`}
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showEditor && (
        <CertificationsEditor
          certifications={certificationsData}
          certificationsContent={certificationsContent}
          onSave={(updatedCerts) => {
            setCertificationsData(updatedCerts);
            setShowEditor(false);
          }}
          onSaveContent={(updatedContent) => {
            setCertificationsContent(updatedContent);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Certifications;
