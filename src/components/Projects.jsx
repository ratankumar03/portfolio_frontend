import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import ProjectsContentEditor from './ProjectsContentEditor';
import axios from 'axios';

const Projects = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showEditor, setShowEditor] = useState(false);

  // Projects content state
  const [projectsContent, setProjectsContent] = useState({
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
    personalProjects: data?.personal || [],
    groupProjects: data?.group || []
  });

  // Fetch custom projects content from backend
  useEffect(() => {
    const fetchProjectsContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.projects_content) {
          const fetchedContent = response.data.projects_content;
          // Merge with existing projects data if arrays are empty
          if (!fetchedContent.personalProjects || fetchedContent.personalProjects.length === 0) {
            fetchedContent.personalProjects = data?.personal || [];
          }
          if (!fetchedContent.groupProjects || fetchedContent.groupProjects.length === 0) {
            fetchedContent.groupProjects = data?.group || [];
          }
          setProjectsContent(fetchedContent);
        }
      } catch (error) {
        console.error('Failed to fetch projects content:', error);
      }
    };
    fetchProjectsContent();
  }, [data]);
  // Function to get unique icon based on project name and technologies
  const getProjectIcon = (project) => {
    const name = project.name.toLowerCase();
    const tech = project.technologies?.join(' ').toLowerCase() || '';

    // Check project type by name or technologies - More specific icons
    if (name.includes('stock') || name.includes('analysis')) return '📊';
    if (name.includes('opinion') || name.includes('poll')) return '🗳️';
    if (name.includes('intrusion') || name.includes('detection') || name.includes('security')) return '🔒';
    if (name.includes('bank') || name.includes('transfer') || name.includes('fund')) return '💳';
    if (name.includes('alzheimer') || name.includes('health') || name.includes('medical')) return '⚕️';
    if (name.includes('ai') || name.includes('artificial')) return '✨';
    if (name.includes('job') || name.includes('match')) return '💼';
    if (name.includes('merge') || name.includes('tool')) return '🔧';
    if (tech.includes('django')) return '🎯';
    if (tech.includes('react') || tech.includes('javascript')) return '⚛️';
    if (tech.includes('machine learning') || tech.includes('ml') || tech.includes('scikit')) return '🧠';
    if (tech.includes('python')) return '💻';
    if (tech.includes('web') || tech.includes('html')) return '🌐';
    if (tech.includes('database') || tech.includes('sql') || tech.includes('sqlite')) return '💾';

    // Default icon
    return '🚀';
  };

  const ProjectCard = ({ project, index }) => (
    <motion.div
      className="project-card group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20">
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-50 group-hover:opacity-70 transition-opacity">
            {getProjectIcon(project)}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
        {project.name}
      </h3>
      
      {project.duration && (
        <p className="text-sm text-gray-500 mb-3">{project.duration}</p>
      )}

      <p className={`text-gray-400 mb-4 line-clamp-3 ${projectsContent.cardTextAlign || 'text-left'}`}>{project.description}</p>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {(project.features || project.achievements) && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            {project.features ? 'Features' : 'Achievements'}:
          </h4>
          <ul className="space-y-1">
            {(project.features || project.achievements)?.slice(0, 3).map((item, idx) => (
              <li key={idx} className="text-xs text-gray-500 flex items-start gap-1">
                <span className="text-purple-400">▹</span>
                <span className={projectsContent.cardTextAlign || 'text-left'}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <FaGithub /> View on GitHub
      </a>
    </motion.div>
  );

  return (
    <section className="section-container bg-gradient-to-b from-black via-blue-900/10 to-black relative">
      <div className="max-w-7xl mx-auto w-full">
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
              className="absolute top-24 right-8 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 flex items-center gap-2 text-sm font-medium transition-all z-10"
              title="Edit Projects Section"
            >
              <FaEdit /> Edit Projects
            </button>
          )}

          <h2 className={`${projectsContent.pageTitle.fontSize} font-bold text-center mb-16`}>
            <span className={`bg-gradient-to-r ${projectsContent.pageTitle.gradient} bg-clip-text text-transparent ${projectsContent.pageTitle.glow ? 'text-glow-blue' : ''}`}>
              {projectsContent.pageTitle.text}
            </span>
          </h2>

          {/* Personal Projects */}
          <div className="mb-16">
            <h3 className={`${projectsContent.personalProjectsHeading.fontSize} font-bold mb-8 ${projectsContent.personalProjectsHeading.color} text-center`}>
              {projectsContent.personalProjectsHeading.text}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {(projectsContent.personalProjects || data?.personal)?.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>

          {/* Group Projects */}
          <div>
            <h3 className={`${projectsContent.groupProjectsHeading.fontSize} font-bold mb-8 ${projectsContent.groupProjectsHeading.color} text-center`}>
              {projectsContent.groupProjectsHeading.text}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {(projectsContent.groupProjects || data?.group)?.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index + (projectsContent.personalProjects?.length || data?.personal?.length || 0)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Content Editor Modal */}
      {showEditor && (
        <ProjectsContentEditor
          projectsData={projectsContent}
          onSave={(updatedContent) => {
            setProjectsContent(updatedContent);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Projects;
