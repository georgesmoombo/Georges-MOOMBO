import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { ShieldCheck, Lock, AlertTriangle, Key, Users, RefreshCw, Server, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details?: string;
  ip?: string;
}

export const SecurityAuditPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusInfo, setStatusInfo] = useState<{
    sslActive: boolean;
    firewallStatus: string;
    activeSessionsCount: number;
    failedAttempts24h: number;
  }>({
    sslActive: true,
    firewallStatus: 'ACTIVE',
    activeSessionsCount: 1,
    failedAttempts24h: 0
  });

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('gm_admin_token');
      const [logsRes, statusRes] = await Promise.all([
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/security-status', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatusInfo(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  return (
    <AdminLayout activeNav="security">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Sécurité & Surveillance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Journal d'Audit & Conformité Système
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Traçabilité inaltérable des connexions, modifications de données et contrôles des privilèges RBAC.
            </p>
          </div>

          <button
            onClick={fetchSecurityData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Actualiser les logs
          </button>
        </div>

        {/* Security Health Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contrôle RBAC</span>
            <div className="text-xl font-bold text-green-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> ACTIF & STRICT
            </div>
            <span className="text-[11px] text-slate-500">ADMIN & EDITOR séparés</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sessions Chiffrées</span>
            <div className="text-xl font-bold text-blue-400 font-mono">
              {statusInfo.activeSessionsCount} active(s)
            </div>
            <span className="text-[11px] text-slate-500">Expiration auto : 8 heures</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tentatives Infructueuses</span>
            <div className="text-xl font-bold text-amber-400 font-mono">
              {statusInfo.failedAttempts24h} (24h)
            </div>
            <span className="text-[11px] text-slate-500">Surveillance brute-force</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chiffrement Mots de Passe</span>
            <div className="text-xl font-bold text-purple-400 font-mono">
              PBKDF2-SHA512
            </div>
            <span className="text-[11px] text-slate-500">Salage cryptographique 10k it.</span>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" /> Historique des Événements Sensibles ({logs.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">Stockage immuable</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Horodatage</th>
                  <th className="p-3 font-bold">Utilisateur</th>
                  <th className="p-3 font-bold">Rôle</th>
                  <th className="p-3 font-bold">Action</th>
                  <th className="p-3 font-bold">Ressource</th>
                  <th className="p-3 font-bold">Résultat</th>
                  <th className="p-3 font-bold">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {logs.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{item.timestamp}</td>
                    <td className="p-3 font-bold text-white">{item.user}</td>
                    <td className="p-3 font-mono text-blue-400">{item.role}</td>
                    <td className="p-3 font-mono font-bold text-slate-200">{item.action}</td>
                    <td className="p-3 text-slate-400">{item.resource}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{item.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
