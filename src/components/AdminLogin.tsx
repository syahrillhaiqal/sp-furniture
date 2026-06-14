import React, { useState } from 'react';
import { ShieldAlert, Lock, UserCheck, Key, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xl p-8 space-y-6">
        
        {/* Shield Icon and Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-900 rounded-xl flex items-center justify-center mx-auto border border-amber-800/20">
            <Lock size={22} className="stroke-[2.5]" />
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
          {/* Username Input */}
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider font-mono">
              Secure PIN / Password
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

        {/* Demo Credentials Drawer Badge */}
        {/* <div className="bg-amber-50/40 rounded-lg p-3.5 border border-amber-800/10 text-[10px] text-stone-500 leading-relaxed font-sans">
          🔑 <strong>Demo Credentials:</strong>
          <div className="flex gap-4 mt-1 font-mono text-stone-600 font-semibold">
            <span>User: <code className="bg-white px-1.5 py-0.5 rounded border">admin</code></span>
            <span>Pass: <code className="bg-white px-1.5 py-0.5 rounded border">sphome123</code></span>
          </div>
        </div> */}
      </div>
    </div>
  );
};
