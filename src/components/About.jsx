import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaDownload, FaFilePdf, FaEye, FaEdit } from 'react-icons/fa';
import { useAdmin } from '../context/AdminContext';
import AboutContentEditor from './AboutContentEditor';
import axios from 'axios';

const About = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [showEditor, setShowEditor] = useState(false);
  const location = data?.location;

  const buildDefaultAboutContent = () => ({
    pageTitle: {
      text: 'About Me',
      fontSize: 'text-4xl md:text-5xl',
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: false
    },
    profileSummary: {
      heading: 'Profile Summary',
      headingColor: 'text-blue-400',
      headingSize: 'text-2xl',
      content: data?.profile_summary || '',
      textColor: 'text-gray-300',
      textSize: 'text-base',
      cardEffect: 'hover-neon-blue',
      textAlign: 'text-left'
    },
    location: {
      heading: 'Location',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      cardEffect: 'hover-neon-purple',
      data: location || {
        village: '',
        post: '',
        police_station: '',
        district: '',
        state: '',
        country: '',
        pin: ''
      }
    },
    getInTouch: {
      heading: 'Get In Touch',
      headingColor: 'text-blue-400',
      headingSize: 'text-2xl',
      cardEffect: 'hover-neon-blue',
      data: {
        emailLabel: 'Email',
        email: data?.email || '',
        phoneLabel: 'Phone',
        phone: data?.phone || '',
        locationLabel: 'Location',
        location: location ? `${location.state}, ${location.country}` : '',
      }
    },
    resume: {
      heading: 'My Resume',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      description: 'Download my professional resume to learn more about my skills, experience, and achievements.',
      downloadButtonText: 'Download Resume',
      viewButtonText: 'View Resume',
      resumeUrl: '/assets/resume_cv/Ratan Kumar Majhi(Resume).pdf',
      cardEffect: 'hover-neon-purple'
    },
    findMeHere: {
      heading: 'Find Me Here',
      headingColor: 'text-purple-400',
      headingSize: 'text-2xl',
      mapUrl: '',
      cardEffect: 'hover-neon-purple'
    }
  });

  // About content state
  const [aboutContent, setAboutContent] = useState(buildDefaultAboutContent);

  // Fetch custom about content from backend
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.about_content) {
          const defaults = buildDefaultAboutContent();
          const fetchedContent = response.data.about_content;
          const mergedContent = {
            ...defaults,
            ...fetchedContent,
            pageTitle: {
              ...defaults.pageTitle,
              ...fetchedContent.pageTitle
            },
            profileSummary: {
              ...defaults.profileSummary,
              ...fetchedContent.profileSummary
            },
            location: {
              ...defaults.location,
              ...fetchedContent.location,
              data: {
                ...defaults.location.data,
                ...fetchedContent.location?.data
              }
            },
            getInTouch: {
              ...defaults.getInTouch,
              ...fetchedContent.getInTouch,
              data: {
                ...defaults.getInTouch.data,
                ...fetchedContent.getInTouch?.data
              }
            },
            resume: {
              ...defaults.resume,
              ...fetchedContent.resume
            },
            findMeHere: {
              ...defaults.findMeHere,
              ...fetchedContent.findMeHere
            }
          };

          if (!mergedContent.profileSummary.content) {
            mergedContent.profileSummary.content = data?.profile_summary || '';
          }

          setAboutContent(mergedContent);
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      }
    };
    fetchAboutContent();
  }, [data, location]);

  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59453.88!2d87.538078!3d21.900526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02d3f3f3f3f3f3%3A0x1234567890abcdef!2sEgra%2C%20Purba%20Medinipur%2C%20West%20Bengal%20721448%2C%20India!5e0!3m2!1sen!2sin!4v1735650000000!5m2!1sen!2sin";

  return (
    <section className="section-container bg-gradient-to-b from-black via-blue-900/10 to-black relative">
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
              className="absolute top-24 right-8 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 flex items-center gap-2 text-sm font-medium transition-all z-10"
              title="Edit About Section"
            >
              <FaEdit /> Edit About
            </button>
          )}

          <h2 className={`${aboutContent.pageTitle.fontSize} font-bold text-center mb-12`}>
            <span className={`bg-gradient-to-r ${aboutContent.pageTitle.gradient} bg-clip-text text-transparent ${aboutContent.pageTitle.glow ? 'text-glow-blue' : ''}`}>
              {aboutContent.pageTitle.text}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Summary */}
            <motion.div
              className={`glass rounded-2xl p-8 ${aboutContent.profileSummary.cardEffect}`}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className={`${aboutContent.profileSummary.headingSize} font-semibold mb-4 ${aboutContent.profileSummary.headingColor}`}>
                {aboutContent.profileSummary.heading}
              </h3>
              <p className={`${aboutContent.profileSummary.textColor} ${aboutContent.profileSummary.textSize} ${aboutContent.profileSummary.textAlign || 'text-left'} leading-relaxed`}>
                {aboutContent.profileSummary.content || data?.profile_summary}
              </p>
            </motion.div>

            {/* Location Details */}
            <motion.div
              className={`glass rounded-2xl p-8 ${aboutContent.location.cardEffect}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className={`${aboutContent.location.headingSize} font-semibold mb-4 ${aboutContent.location.headingColor} flex items-center gap-2`}>
                <FaMapMarkerAlt /> {aboutContent.location.heading}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-500">Village:</span> {aboutContent.location.data.village || location?.village}</p>
                <p><span className="text-gray-500">Post:</span> {aboutContent.location.data.post || location?.post}</p>
                <p><span className="text-gray-500">Police Station:</span> {aboutContent.location.data.police_station || location?.police_station}</p>
                <p><span className="text-gray-500">District:</span> {aboutContent.location.data.district || location?.district}</p>
                <p><span className="text-gray-500">State:</span> {aboutContent.location.data.state || location?.state}</p>
                <p><span className="text-gray-500">Country:</span> {aboutContent.location.data.country || location?.country}</p>
                <p><span className="text-gray-500">PIN:</span> {aboutContent.location.data.pin || location?.pin}</p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className={`glass rounded-2xl p-8 ${aboutContent.getInTouch.cardEffect} md:col-span-2`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className={`${aboutContent.getInTouch.headingSize} font-semibold mb-6 ${aboutContent.getInTouch.headingColor}`}>
                {aboutContent.getInTouch.heading}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <a
                  href={`mailto:${aboutContent.getInTouch.data.email || data?.email}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FaEnvelope size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{aboutContent.getInTouch.data.emailLabel}</p>
                    <p className="font-medium">{aboutContent.getInTouch.data.email || data?.email}</p>
                  </div>
                </a>

                <a
                  href={`tel:${aboutContent.getInTouch.data.phone || data?.phone}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <FaPhoneAlt size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{aboutContent.getInTouch.data.phoneLabel}</p>
                    <p className="font-medium">{aboutContent.getInTouch.data.phone || data?.phone}</p>
                  </div>
                </a>

                <a
                  href={data?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{aboutContent.getInTouch.data.locationLabel}</p>
                    <p className="font-medium">{aboutContent.getInTouch.data.location || `${aboutContent.location.data.state || location?.state}, ${aboutContent.location.data.country || location?.country}`}</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Resume */}
            <motion.div
              className={`glass rounded-2xl p-8 ${aboutContent.resume.cardEffect} md:col-span-2`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className={`${aboutContent.resume.headingSize} font-semibold mb-3 ${aboutContent.resume.headingColor} flex items-center gap-2`}>
                    <FaFilePdf /> {aboutContent.resume.heading}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {aboutContent.resume.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <a
                      href={aboutContent.resume.resumeUrl}
                      download
                      className="btn-primary flex items-center gap-2"
                    >
                      <FaDownload /> {aboutContent.resume.downloadButtonText}
                    </a>
                    <a
                      href={aboutContent.resume.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2"
                    >
                      <FaEye /> {aboutContent.resume.viewButtonText}
                    </a>
                  </div>
                </div>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center self-start md:self-auto">
                  <FaFilePdf size={40} className="text-purple-300" />
                </div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              className={`glass rounded-2xl p-8 ${aboutContent.findMeHere.cardEffect} md:col-span-2`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <h3 className={`${aboutContent.findMeHere.headingSize} font-semibold mb-6 ${aboutContent.findMeHere.headingColor} flex items-center gap-2`}>
                <FaMapMarkerAlt /> {aboutContent.findMeHere.heading}
              </h3>
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <iframe
                  src={aboutContent.findMeHere.mapUrl || defaultMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map - Egra, Purba Medinipur, West Bengal"
                  className="rounded-lg"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* About Content Editor Modal */}
      {showEditor && (
        <AboutContentEditor
          aboutData={aboutContent}
          onSave={(updatedContent) => {
            setAboutContent(updatedContent);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default About;
