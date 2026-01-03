import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import ContactEditor from './ContactEditor';

const Contact = ({ data }) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [contactContent, setContactContent] = useState({
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

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await axios.get('/api/portfolio-data/');
        if (response.data.contact_content) {
          setContactContent((prev) => ({
            ...prev,
            ...response.data.contact_content,
            pageTitle: {
              ...prev.pageTitle,
              ...(response.data.contact_content.pageTitle || {}),
            },
            subTitle: {
              ...prev.subTitle,
              ...(response.data.contact_content.subTitle || {}),
            },
            sectionBackground: {
              ...prev.sectionBackground,
              ...(response.data.contact_content.sectionBackground || {}),
            },
            infoCard: {
              ...prev.infoCard,
              ...(response.data.contact_content.infoCard || {}),
            },
            formCard: {
              ...prev.formCard,
              ...(response.data.contact_content.formCard || {}),
            },
            button: {
              ...prev.button,
              ...(response.data.contact_content.button || {}),
              className:
                response.data.contact_content.button?.className ||
                prev.button.className,
            },
            contactItems: response.data.contact_content.contactItems || [],
            formFields: response.data.contact_content.formFields || prev.formFields,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch contact content:', error);
      }
    };
    fetchContactContent();
  }, []);

  useEffect(() => {
    const fields = contactContent.formFields || [];
    if (fields.length === 0) return;
    setFormData((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        if (!(field.name in next)) {
          next[field.name] = '';
        }
      });
      return next;
    });
  }, [contactContent.formFields]);

  const fallbackItems = [
    {
      id: 1,
      label: 'Email',
      value: data?.email || '',
      type: 'email',
    },
    {
      id: 2,
      label: 'Phone',
      value: data?.phone || '',
      type: 'phone',
    },
    {
      id: 3,
      label: 'Location',
      value: `${data?.location?.district || ''}${data?.location?.state ? `, ${data?.location?.state}` : ''}`,
      type: 'location',
    },
  ];

  const contactItems = (contactContent.contactItems && contactContent.contactItems.length > 0)
    ? contactContent.contactItems
    : fallbackItems;

  const resolveHref = (item) => {
    if (item.href) return item.href;
    if (item.type === 'email') return `mailto:${item.value}`;
    if (item.type === 'phone') return `tel:${item.value}`;
    return undefined;
  };

  const resolveIcon = (type) => {
    if (type === 'email') return <FaEnvelope size={20} className={contactContent.infoCard.iconColor} />;
    if (type === 'phone') return <FaPhoneAlt size={20} className={contactContent.infoCard.iconColor} />;
    return <FaMapMarkerAlt size={20} className={contactContent.infoCard.iconColor} />;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const baseKeys = ['name', 'email', 'subject', 'message'];
      const payload = {
        name: formData.name || '',
        email: formData.email || '',
        subject: formData.subject || '',
        message: formData.message || '',
      };

      const extraFields = (contactContent.formFields || [])
        .filter((field) => !baseKeys.includes(field.name))
        .map((field) => {
          const value = formData[field.name];
          if (!value) return null;
          return `${field.label || field.name}: ${value}`;
        })
        .filter(Boolean);

      if (extraFields.length > 0) {
        payload.message = `${payload.message ? `${payload.message}\n\n` : ''}Additional Info:\n${extraFields.join('\n')}`;
      }

      const response = await axios.post('/api/contact/', payload);
      setStatus({
        type: 'success',
        message: response.data.message || 'Message sent successfully!',
      });
      setFormData((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = '';
        });
        return next;
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`section-container ${contactContent.sectionBackground.className}`}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className={`${contactContent.pageTitle.fontSize} font-bold text-center`}>
              <span className={`bg-gradient-to-r ${contactContent.pageTitle.gradient} bg-clip-text text-transparent ${contactContent.pageTitle.glow ? 'text-glow' : ''} ${contactContent.pageTitle.text3d ? 'text-3d' : ''}`}>
                {contactContent.pageTitle.text}
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
          <p className={`${contactContent.subTitle.textAlign || 'text-center'} ${contactContent.subTitle.color} ${contactContent.subTitle.fontSize} mb-16`}>
            {contactContent.subTitle.text}
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-400">
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactItems.map((item) => {
                  const href = resolveHref(item);
                  const content = (
                    <>
                      <div className={`w-12 h-12 rounded-full ${contactContent.infoCard.iconBg} flex items-center justify-center`}>
                        {resolveIcon(item.type)}
                      </div>
                      <div>
                        <p className={`text-sm ${contactContent.infoCard.labelColor}`}>{item.label}</p>
                        <p className={`${contactContent.infoCard.valueColor} font-medium`}>{item.value}</p>
                      </div>
                    </>
                  );
                  const classes = `flex items-center gap-4 glass rounded-lg p-4 transition-all group ${contactContent.infoCard.accentClass} ${contactContent.infoCard.enable3d ? 'card-3d' : ''}`;

                  return href ? (
                    <a key={item.id} href={href} className={classes}>
                      {content}
                    </a>
                  ) : (
                    <div key={item.id} className={classes}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className={`space-y-4 glass rounded-2xl p-6 ${contactContent.formCard.accentClass} ${contactContent.formCard.enable3d ? 'card-3d' : ''}`}>
                {(contactContent.formFields || []).map((field) => {
                  const commonProps = {
                    name: field.name,
                    value: formData[field.name] || '',
                    onChange: handleChange,
                    placeholder: field.placeholder || field.label,
                    required: !!field.required,
                    className:
                      'w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500',
                  };

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id || field.name}>
                        <textarea
                          {...commonProps}
                          rows={field.rows || 5}
                          className={`${commonProps.className} resize-none`}
                        ></textarea>
                      </div>
                    );
                  }

                  return (
                    <div key={field.id || field.name}>
                      <input
                        type={field.type || 'text'}
                        {...commonProps}
                      />
                    </div>
                  );
                })}

                {status.message && (
                  <div
                    className={`p-4 rounded-lg ${
                      status.type === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                {(() => {
                  const baseClass = contactContent.button.className || '';
                  const buttonClass = baseClass.includes('btn-send-green')
                    ? baseClass
                    : `${baseClass} btn-send-green`.trim();
                  return (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full ${buttonClass} flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                  {loading ? (
                    <>
                      <div className="spinner border-2 border-white/20 border-t-white w-5 h-5"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                    </button>
                  );
                })()}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {showEditor && (
        <ContactEditor
          contactContent={contactContent}
          fallbackItems={fallbackItems}
          onSaveContent={(updatedContent) => {
            setContactContent(updatedContent);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </section>
  );
};

export default Contact;
