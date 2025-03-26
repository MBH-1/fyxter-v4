import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { HowItWorks } from './pages/HowItWorks';
import { BecomeTechnician } from './pages/BecomeTechnician';
import { UserDashboard } from './components/UserDashboard';
import { Layout } from './components/Layout';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AboutUs } from './pages/AboutUs';
import { Services } from './pages/Services';
import { FAQPage } from './pages/FAQPage';
import { WarrantyPolicy } from './pages/WarrantyPolicy';
import { BlogPage } from './pages/BlogPage';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { TestPage } from './pages/TestPage';
import { RepairConfirmation } from './pages/RepairConfirmation';
import { supabase } from './lib/supabase';

// Technician-only route component
const TechnicianRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(true);
  const [isTechnician, setIsTechnician] = React.useState(false);
  
  React.useEffect(() => {
    const checkTechnicianStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsTechnician(false);
        setLoading(false);
        return;
      }
      
      // Check if user is a technician
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('id')
        .eq('id', user.id)
        .single();
        
      setIsTechnician(!!technicianData);
      setLoading(false);
    };
    
    checkTechnicianStatus();
  }, []);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isTechnician ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/how-it-works" element={
        <Layout>
          <HowItWorks />
        </Layout>
      } />
      <Route path="/become-technician" element={
        <Layout>
          <BecomeTechnician />
        </Layout>
      } />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/warranty" element={<WarrantyPolicy />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/shipping" element={<ShippingPolicy />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/repair-confirmation" element={<Layout><RepairConfirmation /></Layout>} />
      <Route path="/dashboard" element={
        <TechnicianRoute>
          <UserDashboard />
        </TechnicianRoute>
      } />
    </Routes>
  );
}

export default App;