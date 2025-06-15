import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FyxtersLogo } from './FyxtersLogo';
import { Footer } from './Footer';
import { Helmet } from 'react-helmet';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
      <title>Fyxters – Book the Best Phone Repair Technicians in Montreal</title>
      <meta name="description" content="Get fast, reliable phone repair from the top technicians in Montreal. Book online. Onsite and in-store service available today." />
      <meta name="keywords" content="phone repair, laptop repair, Montreal repair technician, screen replacement, iPhone repair, Samsung repair, Fyxters" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="Fyxters – Book the Best Repair Technicians in Montreal" />
      <meta property="og:description" content="Trusted, certified phone repair technicians at your service across Montreal. Book your repair now." />
      <meta property="og:image" content="https://fyxters.com/og-image.jpg" />
      <meta property="og:url" content="https://fyxters.com" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fyxters" />
      <meta property="og:locale" content="en_CA" />
      <meta property="og:see_also" content="https://www.instagram.com/fyxters/" />
          {/* Google Search Console Verification */}
  <meta name="google-site-verification" content="google74900e58dffe6d05" />
    </Helmet>
      {/* Header */}
      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/" className="flex items-center" onClick={handleLogoClick}>
                <FyxtersLogo className="h-12 w-12 md:h-14 md:w-14" />
                <span className="ml-3 text-2xl md:text-3xl font-bold">Fyxters</span>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/how-it-works" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/become-technician" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Become a Technician
              </Link>
              <Link
                to="/dashboard" 
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Navigation Menu */}
        <div
          className={`absolute top-full left-0 right-0 z-50 bg-white transform transition-all duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
        >
          <div className="px-4 py-6 space-y-4 border-t">
            <Link 
              to="/how-it-works" 
              className="block py-3 text-lg text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/become-technician" 
              className="block py-3 text-lg text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Technician
            </Link>
            <Link
              to="/dashboard" 
              className="block bg-black text-white px-6 py-3 rounded-lg text-center text-lg hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-600 min-h-[400px] md:min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-end">
          <img 
            src="https://res.cloudinary.com/dqwxexsra/image/upload/e_background_removal/f_png/v1739746162/DALL_E_2025-02-16_16.24.24_-_A_superhero_with_a_bold_letter_F_on_his_chest_wearing_a_modern_and_sleek_superhero_suit._He_is_holding_a_smartphone_in_one_hand_and_smiling_confide_o56dxv.webp"
            alt="Fyxters Superhero"
            className="h-[400px] md:h-[500px] w-auto object-contain object-right transform translate-x-1/4 md:translate-x-0"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center h-[400px] md:h-[500px]">
        <div className="max-w-md bg-black bg-opacity-15 p-5 rounded-lg backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
      Fyxters – The Heroes of Repairs
        </h1>
        <p className="text-lg md:text-xl text-gray-100">
      <strong>Repair Your Device in 3 Easy Steps</strong><br />
      1. Choose Your Device<br />
      2. Share Your Location<br />
      3. Get Instant Pricing & Repair<br />
      
    </p><button
  onClick={() => {
    const section = document.getElementById('select-device');
    section?.scrollIntoView({ behavior: 'smooth' });
  }}
  className="mt-6 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition-colors"
>
  Start Repair
</button>

  </div>
</div>

        </div>
      </div>

      {/* Main Content */}
      {children}

      <Footer />
    </div>
  );
}
