import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StarField from './components/StarField';
import RainEffect from './components/RainEffect';
import ScrollToTop from './components/ScrollToTop';
import axios from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch portfolio data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/portfolio-data/`);
        setPortfolioData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Log visitor
    axios.post(`${API_BASE_URL}/api/log-visitor/`, { page: 'home' }).catch(err => console.log(err));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AdminProvider>
        <Router>
          <ScrollToTop />
        <div className="relative overflow-x-hidden min-h-screen theme-shell">
        {/* Animated Background */}
        <StarField />
        <RainEffect />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home data={portfolioData?.personal_info} coreExpertise={portfolioData?.core_expertise} />} />
              <Route path="/about" element={<About data={portfolioData?.personal_info} />} />
              <Route path="/experience" element={<Experience data={portfolioData?.experience} />} />
              <Route path="/projects" element={<Projects data={portfolioData?.projects} />} />
              <Route path="/education" element={<Education data={portfolioData?.education} />} />
              <Route path="/skills" element={<Skills data={portfolioData?.skills} />} />
              <Route path="/certifications" element={<Certifications data={portfolioData?.certifications} />} />
              <Route path="/achievements" element={<Achievements data={portfolioData?.achievements} />} />
              <Route path="/contact" element={<Contact data={portfolioData?.personal_info} />} />
            </Routes>

            <Footer data={portfolioData?.personal_info} />
          </div>
        </div>
        </Router>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
