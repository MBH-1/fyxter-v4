import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Phone, Calendar, Clock, PenTool as Tool, User, MessageSquare, ArrowLeft, LogOut, Shield } from 'lucide-react';
import { FyxtersLogo } from './FyxtersLogo';

interface RepairOrder {
  id: string;
  model: string;
  repair_type: string;
  service_type: string;
  price: number;
  status: string;
  created_at: string;
  technician: {
    name: string;
    phone: string;
    email: string;
  } | null;
}

interface UserProfile {
  id: string;
  phone: string;
}

export function UserDashboard() {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      // Check if user is a technician
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('id')
        .eq('id', user.id)
        .single();

      if (technicianData) {
        setIsTechnician(true);
        fetchTechnicianOrders(user.id);
      } else {
        // Not a technician, redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicianOrders = async (technicianId: string) => {
    try {
      // Fetch repair orders assigned to this technician
      const { data: ordersData, error: ordersError } = await supabase
        .from('repair_orders')
        .select(`
          *,
          technician:technicians(
            name,
            phone,
            email
          )
        `)
        .eq('technician_id', technicianId)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching technician orders:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not a technician
  if (!isAuthenticated || !isTechnician) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
            <p className="text-gray-600 mt-2">
              The dashboard is only accessible to authorized technicians.
            </p>
          </div>
          <Link
            to="/"
            className="w-full block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <FyxtersLogo className="h-12 w-12 md:h-14 md:w-14" />
                <span className="ml-3 text-2xl md:text-3xl font-bold">Fyxters</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              
              <button
                onClick={handleSignOut}
                className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <Tool className="w-4 h-4 mr-1" />
            Technician Access
          </div>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {order.model.replace(/_/g, ' ')}
                    </h2>
                    <p className="text-gray-600">{order.repair_type}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-gray-900 mt-2">
                      ${order.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tool size={18} />
                    <span>Service Type: {order.service_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={18} />
                    <span>{formatTime(order.created_at)}</span>
                  </div>
                </div>

                {order.technician && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Assigned Technician</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={18} />
                        <span>{order.technician.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={18} />
                        <a href={`tel:${order.technician.phone}`} className="text-blue-600 hover:text-blue-800">
                          {order.technician.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <MessageSquare size={18} />
                        <a href={`mailto:${order.technician.email}`} className="text-blue-600 hover:text-blue-800">
                          {order.technician.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">You don't have any assigned repair requests yet.</p>
              <Link 
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}