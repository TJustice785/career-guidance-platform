import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const StudentFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student/browse-schools" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Find Schools
                </Link>
              </li>
              <li>
                <Link to="/student/browse-jobs" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/student/applications" className="text-gray-400 hover:text-primary-500 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/student/documents" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student/qualifications" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Career Guide
                </Link>
              </li>
              <li>
                <Link to="/student/personalized" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Personalized Recommendations
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Student Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">Stay connected with us on social media for updates and opportunities.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} CareerPath. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;