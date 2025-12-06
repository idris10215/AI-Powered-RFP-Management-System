import React, { useEffect, useState } from 'react';
import { checkInbox, fetchAllProposals } from '../services/api'; 

import { Inbox as InboxIcon, Loader2, FileText, Calendar } from 'lucide-react';

const InboxPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {
      const { data } = await fetchAllProposals();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error("Error loading inbox", error);
      setMessage(`Failed to load inbox: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
      setLoading(true);
      try {
          const { data } = await checkInbox();
          setMessage(data.message);
          await loadInbox(); 
      } catch (error) {
          setMessage("Failed to check for new emails.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold text-slate-800">Inbox</h1>
          <p className="text-slate-500 mt-1">Check for new vendor proposals.</p>
         </div>
         <button 
           onClick={handleRefresh}
           disabled={loading}
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
         >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <InboxIcon size={18} />}
            Refresh Inbox
         </button>
      </div>

      {message && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 flex items-center gap-2">
            <InboxIcon size={18} />
            {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && proposals.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Checking for new emails...</div>
        ) : proposals.length === 0 ? (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <InboxIcon size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-700">No New Proposals</h3>
                <p className="text-slate-500 text-sm mt-1">Check back later or ensure vendors are replying to your RFPs.</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {proposals.map((prop, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="font-semibold text-slate-800">New Proposal Received</h3>
                             <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Calendar size={12} />
                                Just now
                             </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            <strong>Vendor:</strong> {prop.vendor?.name || "Unknown Vendor"} <br />
                            <strong>RFP:</strong> {prop.rfp?.jsonData?.title || "Unknown RFP"}
                        </p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-600 whitespace-pre-wrap">
                            {prop.rawText ? prop.rawText.slice(0, 200) + "..." : "No text content"}
                        </div>
                        <div className="mt-3 flex gap-2">
                             {prop.parsedData?.cost && (
                                 <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">
                                     Cost Detected: {prop.parsedData.cost}
                                 </span>
                             )}
                             {prop.parsedData?.deliveryTime && (
                                 <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">
                                     Delivery: {prop.parsedData.deliveryTime}
                                 </span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
