import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Job = {
  id: string;
  customer_name: string;
  customer_phone: string;
  device_model: string;
  repair_type: string;
  status: string;
  check_in_time: string;
  check_out_time: string | null;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);

  // 🔐 ADMIN CHECK (FIRST)
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('technicians')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || data?.role !== 'admin') {
        navigate('/');
        return;
      }

      setChecking(false);
    };

    checkAdmin();
  }, [navigate]);

  // 📦 FETCH JOBS (ONLY AFTER ADMIN CONFIRMED)
  const fetchJobs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (!error) {
      setJobs(data || []);
    } else {
      console.error('Error fetching jobs:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!checking) {
      fetchJobs();
    }
  }, [checking]);

  const markAsDone = async (jobId: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({
        status: 'done',
        check_out_time: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (!error) {
      fetchJobs();
    }
  };

  // ⏳ AUTH CHECK LOADING
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access…
      </div>
    );
  }

  // 🧱 DASHBOARD UI
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{job.customer_name}</p>
                <p className="text-sm text-gray-600">
                  {job.device_model} – {job.repair_type}
                </p>
                <p className="text-xs text-gray-500">
                  Check-in: {new Date(job.check_in_time).toLocaleString()}
                </p>
                {job.check_out_time && (
                  <p className="text-xs text-gray-500">
                    Check-out: {new Date(job.check_out_time).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${
                    job.status === 'done'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {job.status}
                </span>

                {job.status !== 'done' && (
                  <button
                    onClick={() => markAsDone(job.id)}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Mark as done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

