import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { FyxtersLogo } from './FyxtersLogo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <FyxtersLogo className="h-10 w-10 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Fyxters</span>
            </div>
            <p className="text-sm">
              Professional phone repair services at your doorstep. Quality repairs with premium parts and expert technicians.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/fyxters" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/fyxters" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/fyxters" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com/company/fyxters" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Our Services</Link>
              </li>
              <li>
                <Link to="/become-technician" className="hover:text-white transition-colors">Become a Fyxter</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-white transition-colors">Warranty Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+15148652788" className="hover:text-white transition-colors">
                  (514) 865-2788
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@fyxters.com" className="hover:text-white transition-colors">
                  info@fyxters.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Business Hours</h4>
              <p className="text-sm">Monday - Friday: 9AM - 7PM</p>
              <p className="text-sm">Saturday: 10AM - 5PM</p>
              <p className="text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Fyxters. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
