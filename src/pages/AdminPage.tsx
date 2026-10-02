import React, { useState, useEffect } from 'react';
import { PlanConfig, User } from '../types';
import { 
  ShieldCheck, 
  Users, 
  HardDrive, 
  Cpu, 
  CreditCard, 
  Settings, 
  LayoutTemplate, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Search, 
  Loader2,
  Film,
  Download
} from 'lucide-react';

interface AdminPageProps {
  user: User;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'users' | 'templates' | 'support' | 'audit'>('dashboard');
  
  const [stats, setStats] = useState<any>({
    registeredUsers: 1420,
    activeUsersToday: 384,
    projectsCreated: 3120,
    exportJobsCompleted: 2890,
    totalStorageUsedMb: 14280,
    aiTokensUsed: 94200,
  });

  const [subscriptionEnforced, setSubscriptionEnforced] = useState(false);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User management mock list
  const [usersList, setUsersList] = useState<any[]>([
    { id: 'usr-1', email: 'skm958731@gmail.com', name: 'SKM Studio Lead', role: 'admin', status: 'active', projects: 18, exports: 42 },
    { id: 'usr-2', email: 'creator@novacut.app', name: 'Alex Rivera', role: 'user', status: 'active', projects: 8, exports: 14 },
    { id: 'usr-3', email: 'bengali_creator@dhaka.bd', name: 'Rahim Khan', role: 'user', status: 'active', projects: 22, exports: 36 },
    { id: 'usr-4', email: 'spammer_bot@test.com', name: 'Junk Account', role: 'user', status: 'suspended', projects: 0, exports: 0 },
  ]);
  const [userSearch, setUserSearch] = useState('');

  // Fetch admin stats from server API
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) setStats(data.stats);
      if (data.plans) setPlans(data.plans);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.supportTickets) setSupportTickets(data.supportTickets);
      setSubscriptionEnforced(!!data.subscriptionEnforced);
    } catch (e) {
      console.warn('Failed to load admin stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Toggle Subscription Enforcement
  const handleToggleSubscription = async () => {
    const nextState = !subscriptionEnforced;
    const confirmMsg = nextState 
      ? 'WARNING: Are you sure you want to ENABLE paid subscription paywalls? This may restrict free users from some export resolutions.'
      : 'Switch back to Launch Mode (All Features 100% Free)?';

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/admin/toggle-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState, adminEmail: user.email }),
      });
      const data = await res.json();
      setSubscriptionEnforced(data.subscriptionEnforced);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve Ticket
  const handleResolveTicket = async (ticketId: string) => {
    try {
      await fetch('/api/admin/resolve-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle User Suspension
  const toggleSuspendUser = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  if (user.role !== 'admin') {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] flex flex-col items-center justify-center p-6 text-center select-none">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
          This portal is strictly protected for verified system administrators.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
        >
          Return to Studio
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#070913] text-slate-100 p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">NovaCut Admin Control Panel</h1>
          </div>
          <p className="text-xs text-slate-400">
            Authenticated Admin: <span className="text-purple-300 font-mono font-semibold">{user.email}</span> • Role: Super Administrator
          </p>
        </div>

        {/* Global Subscription Enforcement Toggle Guard */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-xs font-bold text-white block">Launch Mode (All Free)</span>
            <span className="text-[10px] text-slate-400">
              {subscriptionEnforced ? 'Paid Tiers Enforced' : 'All Features 100% Unlocked'}
            </span>
          </div>

          <button
            onClick={handleToggleSubscription}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              subscriptionEnforced
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {subscriptionEnforced ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{subscriptionEnforced ? 'Paywalls Active' : 'Launch Mode Active'}</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'Metrics Overview', icon: Cpu },
          { id: 'plans', label: 'Future Plans & Quotas', icon: CreditCard },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'support', label: 'Support Desk', icon: MessageSquare },
          { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: METRICS OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Registered Creators</span>
              <p className="text-2xl font-black text-white mt-1">{stats.registeredUsers}</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">+{stats.activeUsersToday} active today</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Projects Created</span>
              <p className="text-2xl font-black text-cyan-300 mt-1">{stats.projectsCreated}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Multi-track timelines</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Rendered Exports</span>
              <p className="text-2xl font-black text-purple-400 mt-1">{stats.exportJobsCompleted}</p>
              <span className="text-[10px] text-emerald-400 mt-1 block">100% Watermark-Free</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">AI Operations</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{stats.aiTokensUsed}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Gemini 3.8 Tokens</span>
            </div>
          </div>

          {/* Infrastructure Health Note */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-purple-300">⚡ Platform Architecture Status</span>
            <p>
              All client rendering runs client-side via HTML5 Canvas and MediaRecorder APIs, relieving cloud server overhead while delivering instant 4K downloads for users.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: FUTURE PLANS & PRICING */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Future Subscription & Entitlement Architecture</h2>
              <p className="text-xs text-slate-400">
                Configure future tiers (Free, Pro, Studio/Agency). Changes are safely staged without disrupting the current free launch state.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{plan.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    {plan.active ? 'Configured' : 'Inactive'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#070913]">
                    <span className="text-[10px] text-slate-500 block">Monthly Price</span>
                    <span className="font-bold text-white">${plan.monthlyPrice} / mo</span>
                  </div>
                  <div className="p-2 rounded bg-[#070913]">
                    <span className="text-[10px] text-slate-500 block">Yearly Price</span>
                    <span className="font-bold text-white">${plan.yearlyPrice} / yr</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Entitlements</span>
                  {plan.features.slice(0, 4).map((f, i) => (
                    <p key={i} className="text-slate-400 truncate">• {f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Registered Creators ({usersList.length})</h2>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-slate-800">
              <thead className="bg-[#0A0E18] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Projects</th>
                  <th className="px-4 py-3">Exports</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersList
                  .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.name.toLowerCase().includes(userSearch.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">{u.projects}</td>
                      <td className="px-4 py-3 font-mono text-cyan-300">{u.exports}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.status === 'active' ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleSuspendUser(u.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                              u.status === 'active'
                                ? 'bg-slate-800 hover:bg-rose-950/40 text-rose-400 border border-slate-700'
                                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Restore'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT DESK */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Creator Support Tickets ({supportTickets.length})</h2>
          
          <div className="space-y-3">
            {supportTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{t.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'open' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">{new Date(t.date).toLocaleString()}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{t.message}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-mono">From: {t.userEmail}</span>
                  {t.status === 'open' && (
                    <button
                      onClick={() => handleResolveTicket(t.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Administrative Security Audit Trail</h2>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 divide-y divide-slate-800/60 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-400">{log.action}</span>
                    <span className="text-slate-400">by {log.user}</span>
                  </div>
                  <p className="text-slate-300 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
