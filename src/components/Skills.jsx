import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaPalette } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import TechnicalSkillsEditor from './TechnicalSkillsEditor';
import ToolsEditor from './ToolsEditor';
import KeyConceptsEditor from './KeyConceptsEditor';
import SectionHeadingsEditor from './SectionHeadingsEditor';
import axios from 'axios';

const Skills = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [activeTool, setActiveTool] = useState(null);
  const [showTechnicalEditor, setShowTechnicalEditor] = useState(false);
  const [showToolsEditor, setShowToolsEditor] = useState(false);
  const [showConceptsEditor, setShowConceptsEditor] = useState(false);
  const [showHeadingsEditor, setShowHeadingsEditor] = useState(false);
  const [technicalSkills, setTechnicalSkills] = useState(data?.technical || []);
  const [tools, setTools] = useState(data?.tools || []);
  const [concepts, setConcepts] = useState(data?.concepts || []);

  // Default headings configuration
  const [headings, setHeadings] = useState({
    mainTitle: {
      text: 'Skills & Expertise',
      gradient: 'gradient-text-blue',
      fontSize: 'text-4xl md:text-5xl',
      customGradient: 'from-blue-400 via-cyan-400 to-blue-600'
    },
    technicalSkills: {
      text: 'Technical Skills',
      color: 'text-purple-400',
      fontSize: 'text-3xl'
    },
    toolsSoftware: {
      text: 'Tools & Software',
      color: 'text-blue-400',
      fontSize: 'text-3xl'
    },
    keyConcepts: {
      text: 'Key Concepts',
      gradient: 'gradient-text-purple',
      fontSize: 'text-4xl',
      customGradient: 'from-purple-400 via-pink-400 to-purple-600',
      glow: true
    }
  });

  // Fetch custom headings from backend
  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.skills_headings) {
          // Deep merge for nested objects
          setHeadings(prev => ({
            ...prev,
            mainTitle: {
              ...prev.mainTitle,
              ...(response.data.skills_headings.mainTitle || {})
            },
            technicalSkills: {
              ...prev.technicalSkills,
              ...(response.data.skills_headings.technicalSkills || {})
            },
            toolsSoftware: {
              ...prev.toolsSoftware,
              ...(response.data.skills_headings.toolsSoftware || {})
            },
            keyConcepts: {
              ...prev.keyConcepts,
              ...(response.data.skills_headings.keyConcepts || {})
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch headings:', error);
      }
    };
    fetchHeadings();
  }, []);
  return (
    <section className="section-container bg-gradient-to-b from-black via-blue-900/10 to-black">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-16">
            <h2 className={`${headings.mainTitle.fontSize} font-bold text-center`}>
              <span className={`bg-gradient-to-r ${headings.mainTitle.customGradient} bg-clip-text text-transparent`}>
                {headings.mainTitle.text}
              </span>
            </h2>
            {isAdmin && isEditMode && (
              <button
                onClick={() => setShowHeadingsEditor(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                title="Edit All Headings"
              >
                <FaPalette /> Edit Headings
              </button>
            )}
          </div>

          {/* Technical Skills */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h3 className={`${headings.technicalSkills.fontSize} font-bold ${headings.technicalSkills.color} text-center`}>
                {headings.technicalSkills.text}
              </h3>
              {isAdmin && isEditMode && (
                <button
                  onClick={() => setShowTechnicalEditor(true)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(technicalSkills.length > 0 ? technicalSkills : data?.technical)?.map((skill, index) => {
                const isPython = skill.name === 'Python';
                const isDjango = skill.name === 'Django';
                const isML = skill.name === 'Machine Learning';
                const isDL = skill.name === 'Deep Learning';
                const isSQL = skill.name === 'SQL';
                const isJava = skill.name === 'Java';
                const isHTML = skill.name === 'HTML';
                const isCSS = skill.name === 'CSS';
                const isMongo = skill.name === 'MongoDB';
                const hasCustomBg = isPython || isDjango || isML || isDL || isSQL || isJava || isHTML || isCSS || isMongo;
                return (
                  <motion.div
                    key={skill.name}
                    className={`skill-card group relative overflow-hidden hover-neon-purple ${hasCustomBg ? 'py-6' : ''}`}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    {hasCustomBg && (
                      <>
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: isPython
                                ? 'url(/assets/icons/python_background.jpg)'
                                : isDjango
                                  ? 'url(/assets/icons/Django_background.jpg)'
                                  : isML
                                    ? 'url(/assets/icons/ai_ml_background.jpg)'
                                    : isDL
                                      ? 'url(/assets/icons/deep_learning_background.jpg)'
                                  : isSQL
                                    ? 'url(/assets/icons/sql_background.jpg)'
                                    : isJava
                                      ? 'url(/assets/icons/java_background.jpg)'
                                      : isHTML
                                        ? 'url(/assets/icons/html_background.png)'
                                        : isCSS
                                          ? 'url(/assets/icons/css_background.png)'
                                          : 'url(/assets/icons/MongoDBl_background.png)',
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-full opacity-30 pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: isPython
                                ? 'url(/assets/icons/python_background.jpg)'
                                : isDjango
                                  ? 'url(/assets/icons/Django_background.jpg)'
                                  : isML
                                    ? 'url(/assets/icons/ai_ml_background.jpg)'
                                    : isDL
                                      ? 'url(/assets/icons/deep_learning_background.jpg)'
                                  : isSQL
                                    ? 'url(/assets/icons/sql_background.jpg)'
                                    : isJava
                                      ? 'url(/assets/icons/java_background.jpg)'
                                      : isHTML
                                        ? 'url(/assets/icons/html_background.png)'
                                        : isCSS
                                          ? 'url(/assets/icons/css_background.png)'
                                          : 'url(/assets/icons/MongoDBl_background.png)',
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                        </div>
                      </>
                    )}
                    <div className="text-center relative z-10">
                      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">
                        {isPython ? (
                          <img
                            src="/assets/icons/Python.png"
                            alt="Python"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isDjango ? (
                          <img
                            src="/assets/icons/Django.png"
                            alt="Django"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isML ? (
                          <img
                            src="/assets/icons/Machine_Learning.png"
                            alt="Machine Learning"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isDL ? (
                          <img
                            src="/assets/icons/Deep_Learning.png"
                            alt="Deep Learning"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isSQL ? (
                          <img
                            src="/assets/icons/sql.png"
                            alt="SQL"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isJava ? (
                          <img
                            src="/assets/icons/Java.png"
                            alt="Java"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isHTML ? (
                          <img
                            src="/assets/icons/html.png"
                            alt="HTML"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isCSS ? (
                          <img
                            src="/assets/icons/css.png"
                            alt="CSS"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : isMongo ? (
                          <img
                            src="/assets/icons/MongoDB.png"
                            alt="MongoDB"
                            className="mx-auto h-10 w-10 object-contain"
                          />
                        ) : (
                          skill.icon
                        )}
                      </div>
                      <h4 className="font-semibold text-white mb-2">{skill.name}</h4>
                      <p className="text-xs text-gray-500">{skill.category}</p>
                    
                    {/* Progress Bar */}
                    {skill.proficiency && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                      </div>
                    )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h3 className={`${headings.toolsSoftware.fontSize} font-bold ${headings.toolsSoftware.color} text-center`}>
                {headings.toolsSoftware.text}
              </h3>
              {isAdmin && isEditMode && (
                <button
                  onClick={() => setShowToolsEditor(true)}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {(tools.length > 0 ? tools : data?.tools)?.map((tool, index) => {
                const isPowerBI = tool.name === 'Power BI';
                const isExcel = tool.name === 'Excel';
                const isCiscoPT = tool.name === 'Cisco Packet Tracer';
                const isNetSim = tool.name === 'NetSim';
                const hasCustomBg = isPowerBI || isExcel || isCiscoPT || isNetSim;
                const accentClass = isPowerBI
                  ? 'border-yellow-500/40 shadow-[0_0_30px_rgba(250,204,21,0.15)]'
                  : isExcel
                    ? 'border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.15)]'
                    : isCiscoPT
                      ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                      : isNetSim
                        ? 'border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                      : 'border-blue-500/20';
                const isActive = activeTool === tool.name;
                return (
                  <motion.div
                    key={tool.name}
                    className={`glass rounded-xl p-6 text-center w-44 relative overflow-hidden border cursor-pointer transition-transform ${
                      accentClass
                    } ${hasCustomBg ? 'py-6' : ''} ${
                      isActive ? 'scale-105 hover-neon-blue' : 'hover:scale-105'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveTool(isActive ? null : tool.name)}
                  >
                    {hasCustomBg && (
                      <>
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: isPowerBI
                                ? 'url(/assets/icons/power_bi_background.png)'
                                : isExcel
                                  ? 'url(/assets/icons/Excel_background.png)'
                                  : isCiscoPT
                                    ? 'url(/assets/icons/Cisco_Packet_Tracer_background.png)'
                                    : 'url(/assets/icons/netsim_background.png)',
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-full opacity-30 pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: isPowerBI
                                ? 'url(/assets/icons/power_bi_background.png)'
                                : isExcel
                                  ? 'url(/assets/icons/Excel_background.png)'
                                  : isCiscoPT
                                    ? 'url(/assets/icons/Cisco_Packet_Tracer_background.png)'
                                    : 'url(/assets/icons/netsim_background.png)',
                            }}
                          ></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>
                        </div>
                      </>
                    )}
                    <div className="text-3xl mb-2 relative z-10">
                      {isPowerBI ? (
                        <img
                          src="/assets/icons/Power BI.png"
                          alt="Power BI"
                          className="mx-auto h-9 w-9 object-contain"
                        />
                      ) : isExcel ? (
                        <img
                          src="/assets/icons/Excel.png"
                          alt="Excel"
                          className="mx-auto h-9 w-9 object-contain"
                        />
                      ) : isCiscoPT ? (
                        <img
                          src="/assets/icons/Cisco_Packet_Tracer.png"
                          alt="Cisco Packet Tracer"
                          className="mx-auto h-9 w-9 object-contain"
                        />
                      ) : isNetSim ? (
                        <img
                          src="/assets/icons/netsim.png"
                          alt="NetSim"
                          className="mx-auto h-9 w-9 object-contain"
                        />
                      ) : (
                        tool.icon
                      )}
                    </div>
                    <h4 className="font-semibold text-white text-sm relative z-10">{tool.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 relative z-10">{tool.category}</p>
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wide ${
                          isPowerBI
                            ? 'bg-yellow-500/15 text-yellow-300'
                            : isExcel
                              ? 'bg-green-500/15 text-green-300'
                              : isCiscoPT
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : isNetSim
                                  ? 'bg-indigo-500/15 text-indigo-300'
                                : 'bg-blue-500/15 text-blue-300'
                        }`}
                      >
                        Tool
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Concepts - Unique Hexagon Layout */}
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-12">
              <motion.h3
                className={`${headings.keyConcepts.fontSize} font-bold text-center relative`}
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className={`bg-gradient-to-r ${headings.keyConcepts.customGradient} bg-clip-text text-transparent ${headings.keyConcepts.glow ? 'text-glow' : ''}`}>
                  {headings.keyConcepts.text}
                </span>
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: 128 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                ></motion.div>
              </motion.h3>
              {isAdmin && isEditMode && (
                <button
                  onClick={() => setShowConceptsEditor(true)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 relative">
              {(concepts.length > 0 ? concepts : data?.concepts)?.map((concept, index) => {
                const colors = [
                  'from-purple-600/20 to-pink-600/20 border-purple-500/40 hover:shadow-purple-500/50',
                  'from-blue-600/20 to-cyan-600/20 border-blue-500/40 hover:shadow-blue-500/50',
                  'from-green-600/20 to-emerald-600/20 border-green-500/40 hover:shadow-green-500/50',
                  'from-orange-600/20 to-red-600/20 border-orange-500/40 hover:shadow-orange-500/50',
                  'from-violet-600/20 to-fuchsia-600/20 border-violet-500/40 hover:shadow-violet-500/50',
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <motion.div
                    key={concept}
                    className={`group relative px-8 py-4 bg-gradient-to-br ${colorClass} rounded-2xl border-2 backdrop-blur-xl overflow-hidden transition-all duration-500 cursor-pointer`}
                    initial={{ opacity: 0, rotateY: -90, scale: 0.5 }}
                    whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.15,
                      rotateZ: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated Background Particles */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent)" }}
                      animate={{
                        background: [
                          "radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.2), transparent)",
                          "radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.2), transparent)",
                          "radial-gradient(circle at 0% 100%, rgba(192, 132, 252, 0.2), transparent)",
                          "radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.2), transparent)",
                          "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2), transparent)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Glowing Border Animation */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      style={{
                        boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Text Content */}
                    <motion.span
                      className="relative z-10 text-white font-bold text-base tracking-wide block text-center"
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                    >
                      {concept}
                    </motion.span>

                    {/* Shine Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000"
                      style={{ transform: "skewX(-20deg)" }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Decorative floating elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-purple-500/10 blur-2xl"
              animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Editor Modals */}
      {showTechnicalEditor && (
        <TechnicalSkillsEditor
          skills={technicalSkills.length > 0 ? technicalSkills : data?.technical}
          onSave={(updatedSkills) => {
            setTechnicalSkills(updatedSkills);
            setShowTechnicalEditor(false);
          }}
          onClose={() => setShowTechnicalEditor(false)}
        />
      )}

      {showToolsEditor && (
        <ToolsEditor
          tools={tools.length > 0 ? tools : data?.tools}
          onSave={(updatedTools) => {
            setTools(updatedTools);
            setShowToolsEditor(false);
          }}
          onClose={() => setShowToolsEditor(false)}
        />
      )}

      {showConceptsEditor && (
        <KeyConceptsEditor
          concepts={concepts.length > 0 ? concepts : data?.concepts}
          onSave={(updatedConcepts) => {
            setConcepts(updatedConcepts);
            setShowConceptsEditor(false);
          }}
          onClose={() => setShowConceptsEditor(false)}
        />
      )}

      {showHeadingsEditor && (
        <SectionHeadingsEditor
          headings={headings}
          onSave={(updatedHeadings) => {
            setHeadings(updatedHeadings);
            setShowHeadingsEditor(false);
          }}
          onClose={() => setShowHeadingsEditor(false)}
        />
      )}
    </section>
  );
};

export default Skills;
