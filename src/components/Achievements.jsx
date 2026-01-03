import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaAward, FaStar, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import AchievementsEditor from './AchievementsEditor';
import axios from 'axios';

const Achievements = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showEditor, setShowEditor] = useState(false);
  const [achievementsData, setAchievementsData] = useState(data || []);
  const [achievementsContent, setAchievementsContent] = useState({
    pageTitle: {
      text: 'Achievements',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: false,
      text3d: false,
    },
    sectionBackground: {
      className: 'bg-gradient-to-b from-black via-blue-900/10 to-black',
    },
    cardStyle: {
      accentClass: 'border border-blue-500/30 hover-neon-blue',
      enable3d: false,
    },
    cardTitle: {
      fontSize: 'text-xl',
      color: 'text-white',
    },
    cardOrg: {
      color: 'text-blue-400',
    },
    cardYear: {
      color: 'text-gray-500',
    },
    descriptionAlign: 'text-left',
  });

  useEffect(() => {
    if (data) {
      setAchievementsData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchAchievementsContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.achievements_content) {
          setAchievementsContent((prev) => ({
            ...prev,
            ...response.data.achievements_content,
            pageTitle: {
              ...prev.pageTitle,
              ...(response.data.achievements_content.pageTitle || {}),
            },
            sectionBackground: {
              ...prev.sectionBackground,
              ...(response.data.achievements_content.sectionBackground || {}),
            },
            cardStyle: {
              ...prev.cardStyle,
              ...(response.data.achievements_content.cardStyle || {}),
            },
            cardTitle: {
              ...prev.cardTitle,
              ...(response.data.achievements_content.cardTitle || {}),
            },
            cardOrg: {
              ...prev.cardOrg,
              ...(response.data.achievements_content.cardOrg || {}),
            },
            cardYear: {
              ...prev.cardYear,
              ...(response.data.achievements_content.cardYear || {}),
            },
          }));
        }
      } catch (error) {
        console.error('Failed to fetch achievements content:', error);
      }
    };
    fetchAchievementsContent();
  }, []);

  return (
    <section className={`section-container ${achievementsContent.sectionBackground.className}`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className={`${achievementsContent.pageTitle.fontSize} font-bold text-center`}>
              <span className={`bg-gradient-to-r ${achievementsContent.pageTitle.gradient} bg-clip-text text-transparent ${achievementsContent.pageTitle.glow ? 'text-glow-blue' : ''} ${achievementsContent.pageTitle.text3d ? 'text-3d' : ''}`}>
                {achievementsContent.pageTitle.text}
              </span>
            </h2>
            {isAdmin && isEditMode && (
              <motion.button
                onClick={() => setShowEditor(true)}
                className="relative px-5 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2 overflow-hidden border border-blue-500/50 shadow-[0_10px_30px_rgba(59,130,246,0.35)] bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 transition-all"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 opacity-60 blur-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"></span>
                <span className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/20 blur-2xl"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <FaEdit /> Edit
                </span>
              </motion.button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {achievementsData?.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`glass rounded-2xl p-8 group ${achievementsContent.cardStyle.accentClass} ${achievementsContent.cardStyle.enable3d ? 'card-3d' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 neon-blue group-hover:scale-110 transition-transform">
                    <FaTrophy size={32} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`${achievementsContent.cardTitle.fontSize} font-bold ${achievementsContent.cardTitle.color} group-hover:text-blue-400 transition-colors`}>
                        {achievement.title}
                      </h3>
                      <FaStar className="text-yellow-400 animate-pulse" />
                    </div>
                    
                    <p className={`${achievementsContent.cardOrg.color} font-semibold mb-2`}>
                      {achievement.organization}
                    </p>
                    
                    <p className={`text-gray-400 mb-3 ${achievementsContent.descriptionAlign || 'text-left'}`}>{achievement.description}</p>
                    
                    <div className={`flex items-center gap-2 text-sm ${achievementsContent.cardYear.color}`}>
                      <FaAward className="text-purple-400" />
                      <span>{achievement.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {showEditor && (
        <AchievementsEditor
          achievements={achievementsData}
          achievementsContent={achievementsContent}
          onSave={(updatedAchievements) => {
            setAchievementsData(updatedAchievements);
            setShowEditor(false);
          }}
          onSaveContent={(updatedContent) => {
            setAchievementsContent(updatedContent);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Achievements;
