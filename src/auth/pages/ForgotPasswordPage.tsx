import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter, Link } from '../../router/RouterContext';
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <Link to="/admin/login" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Récupération de Compte
            </h1>
            <p className="text-xs text-slate-400">
              Saisissez votre adresse email pour recevoir les instructions de réinitialisation sécurisées.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Si l'adresse <strong>{email}</strong> correspond à un compte administrateur autorisé, les instructions sécurisées de réinitialisation ont été générées et transmises.
              </p>
              <Link
                to="/admin/login"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Retour à la page de connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Adresse Email Associée
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@moombo.cd"
                    className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                {loading ? 'Traitement en cours...' : 'Envoyer les instructions'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Georges MOOMBO MODEAWI.
      </div>
    </div>
  );
};
