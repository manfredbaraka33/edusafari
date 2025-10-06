import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Linkedin, Youtube, Mail } from 'lucide-react'; // Using lucide-react for icons
import { Link } from 'react-router-dom';

const Footer = () => {
  // State to manage the theme, initialized from localStorage or defaults to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Effect to apply the theme class to the document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900  to-indigo-900 text-white dark:from-gray-800 dark:to-black py-10 px-4 sm:px-6 lg:px-8  shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Company Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          
          <h4 className="text-3xl font-bold mb-3 tracking-wide">EduSafari</h4>
          <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">
            Your Education Safari companion providing you with reliable information on institutions, tools, online platforms and all other needs.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className='flex-col justify-items-center'>
          <h4 className="text-xl font-semibold mb-4 text-blue-300 dark:text-gray-200">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <a href="/" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <Link to="/" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Features
              </Link>
            </li>
            <li>
              <a href="/" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Pricing
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Community
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Legal & Support */}
        <div className='flex-col justify-items-center'>
          <h4 className="text-xl font-semibold mb-4 text-blue-300 dark:text-gray-200">Get Support</h4>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Section 4: Connect with Us */}
        <div className='flex-col justify-items-center'>
          <h4 className="text-xl font-semibold mb-4 text-blue-300 dark:text-gray-200">Connect with Us</h4>
          <div className="flex space-x-4 mb-6">
            <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200" aria-label="Instagram">
              <Instagram className="h-7 w-7" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200" aria-label="Twitter">
              <Twitter className="h-7 w-7" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200" aria-label="LinkedIn">
              <Linkedin className="h-7 w-7" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white dark:text-gray-400 dark:hover:text-white transition-colors duration-200" aria-label="YouTube">
              <Youtube className="h-7 w-7" />
            </a>
          </div>
          <p className="flex items-center text-gray-300 dark:text-gray-400">
            <Mail className="h-5 w-5 mr-2" />
            <a href="mailto:info@elopynest.com" className="hover:text-white dark:hover:text-white transition-colors duration-200">
              info@edusafari.com
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-10 pt-6 border-t border-blue-800 dark:border-gray-700 text-center text-sm text-gray-400 dark:text-gray-500">
        &copy; {currentYear} EduSafari. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
