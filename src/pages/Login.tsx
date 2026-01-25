import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 If session already exists, go straight to admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };

    checkSession();

    // 🔁 Listen for magic-link completion
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate('/admin');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/admin',
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>

        {sent ? (
          <p className="text-green-600 text-sm">
            Magic link sent. Check your email.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="you@fyxters.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded mb-3"
            />

            {error && (
              <p className="text-red-600 text-sm mb-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Send magic link
            </button>
          </>
        )}
      </form>
    </div>
  );
}

