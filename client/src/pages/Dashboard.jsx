import React, { useEffect, useState } from 'react';
import { fetchRFPs, checkInbox } from '../services/api';
import RFPCard from '../components/RFPCard';
import { Plus, Send, Inbox, BarChart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingInbox, setCheckingInbox] = useState(false);
  const [inboxMsg, setInboxMsg] = useState('');

  const loadRFPs = async () => {
    try {
      const { data } = await fetchRFPs();
      setRfps(data.rfp || []);
    } catch (error) {
      console.error("Failed to load RFPs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFPs();
  }, []);

  const handleCheckInbox = async () => {
    setCheckingInbox(true);
    setInboxMsg('');
    try {
      const { data } = await checkInbox();
      setInboxMsg(data.message);
    } catch (error) {
      setInboxMsg("Error checking inbox");
    } finally {
      setCheckingInbox(false);
    }
  };

  const sentRFPs = rfps.filter(r => r.status === 'Sent');
  const draftRFPs = rfps.filter(r => r.status === 'Draft');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Procurement Dashboard</h1>
          <p className="text-slate-500 mt-1">AI-powered workflow to streamline your purchasing.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New RFP
          </Link>
        </div>
      </div>
      
      {inboxMsg && (
        <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 flex items-center gap-2">
          <Inbox size={16} /> {inboxMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Workflow Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

          {[
            { label: "Create Request", icon: Plus, desc: "Describe needs in natural language" },
            { label: "Send to Vendors", icon: Send, desc: "AI selects and notifies vendors" },
            { label: "Receive Proposals", icon: Inbox, desc: "Auto-parsing of email responses" },
            { label: "Analyze & Compete", icon: BarChart, desc: "AI comparison and scoring" }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-100 text-slate-400 flex items-center justify-center mb-3 shadow-sm group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
                <step.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-700 text-sm">{step.label}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[150px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Active RFPs
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{sentRFPs.length}</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
               [1, 2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>)
            ) : sentRFPs.length > 0 ? (
              sentRFPs.map(rfp => <RFPCard key={rfp._id} rfp={rfp} />)
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl border-dashed">
                <p className="text-slate-400 text-sm">No active RFPs right now.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Drafts
               <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{draftRFPs.length}</span>
            </h2>
          </div>

          <div className="space-y-4">
             {loading ? (
               [1, 2].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>)
            ) : draftRFPs.length > 0 ? (
              draftRFPs.map(rfp => <RFPCard key={rfp._id} rfp={rfp} />)
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-xl border-dashed">
                <p className="text-slate-400 text-sm">No drafts. Start a new RFP!</p>
                <Link to="/create" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">Create RFP &rarr;</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
