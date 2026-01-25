import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('technicians')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    run();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return isAdmin ? children : <Navigate to="/login" replace />;
}
