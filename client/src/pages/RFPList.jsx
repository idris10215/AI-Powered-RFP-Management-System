import React, { useEffect, useState } from 'react';
import { fetchRFPs } from '../services/api';
import RFPCard from '../components/RFPCard';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RFPList = () => {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRFPs();
  }, []);

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

  const sentRFPs = rfps.filter(r => r.status === 'Sent');
  const draftRFPs = rfps.filter(r => r.status === 'Draft');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold text-slate-800">RFP Management</h1>
          <p className="text-slate-500 mt-1">Manage your active and draft requests.</p>
         </div>
         <Link 
            to="/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
          >
            <Plus size={18} />
            Create New RFP
          </Link>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Sent Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Active RFPs (Sent)
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
                <p className="text-slate-400 text-sm">No active RFPs.</p>
              </div>
            )}
          </div>
        </div>

        {/* Draft Column */}
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
                <p className="text-slate-400 text-sm">No drafts available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFPList;
