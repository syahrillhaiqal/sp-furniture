import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Key, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';

export const AdminLogin: React.FC = () => {
  const { login, setRoute } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Context login credentials validation
    if ((username === 'admin' || username === 'sphome') && (password === 'sphome123' || password === 'admin')) {
      const logged = login(password);
      if (logged) {
        setRoute('admin-dashboard');
      }
    } else {
      setErrorMsg('Unauthorized administrative credentials. Please verify your staff role username and secure password.');
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-16 sm:py-20"
      style={{
        backgroundColor: '#f5f5f4',
        backgroundImage:
          'radial-gradient(circle at 18% 20%, rgba(180, 83, 9, 0.14), transparent 22%), radial-gradient(circle at 82% 18%, rgba(28, 25, 23, 0.12), transparent 20%), radial-gradient(circle at 50% 78%, rgba(120, 113, 108, 0.1), transparent 24%), repeating-linear-gradient(135deg, rgba(120, 113, 108, 0.08) 0 1px, transparent 1px 24px)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.3))]" />
      <div className="relative mx-auto max-w-md">
        <div className="bg-white/92 backdrop-blur-sm rounded-2xl border border-stone-200 overflow-hidden shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-800/15 shadow-sm">
              <img
                src="/SP-Home-Furniture-icon.png"
                alt="SP Home Furniture"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Administrator Portal</h1>
            <p className="text-[11px] text-stone-500 font-mono tracking-widest uppercase">
              Internal Staff Secured Terminal
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 rounded-lg text-xs font-semibold leading-relaxed border border-red-100 flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider font-mono">
                Staff Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <UserCheck size={14} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Staff username (e.g. admin)"
                  className="w-full rounded-md border border-stone-300 pl-9 pr-3 py-2 text-sm bg-stone-50/50 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                  <Key size={14} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password (sphome123)"
                  className="w-full rounded-md border border-stone-300 pl-9 pr-3 py-2 text-sm bg-stone-50/50 focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-amber-800 text-white font-semibold py-2.5 px-4 rounded-md text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow cursor-pointer pt-3 pb-3"
            >
              <span>Login</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
