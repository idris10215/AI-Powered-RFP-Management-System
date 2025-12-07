import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRFPById, fetchVendors, sendRFP, analyzeRFP } from '../services/api';
import { Clock, CheckCircle, Send, Users, ChevronRight, BarChart2, DollarSign, Package, ArrowLeft, AlertTriangle, Trophy } from 'lucide-react';

const RFPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const rfpRes = await fetchRFPById(id);
      setRfp(rfpRes.data.rfp);
      setProposals(rfpRes.data.proposals || []);
      
      if (rfpRes.data.rfp.analysis) {
        setAnalysis({ analysis: rfpRes.data.rfp.analysis });
      }
      
      const vendorRes = await fetchVendors();
      setVendors(vendorRes.data.vendors || []);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) return;
    setSending(true);
    try {
      await sendRFP({ rfpId: id, vendorIds: selectedVendors });
      await loadData(); 
    } catch (error) {
      console.error("Error sending RFP", error);
      alert("Failed to send RFP");
    } finally {
      setSending(false);
    }
  };

  const handleAnalyze = async () => {
    if (analysis && rfp.analyzedProposalCount >= proposals.length) {
        alert("Analysis is up to date. No new proposals received since last analysis.");
        return;
    }

    setAnalyzing(true);
    try {
      const { data } = await analyzeRFP(id);
      setAnalysis(data);
      setRfp(prev => ({...prev, analyzedProposalCount: proposals.length}));
    } catch (error) {
      console.error("Error analyzing", error);
      alert("Analysis failed. Make sure there are proposals.");
    } finally {
      setAnalyzing(false);
    }
  };

  const uniqueVendors = Array.from(new Map(
    proposals
      .filter(p => p.vendor)
      .map(p => [p.vendor._id, p.vendor])
  ).values());

  const toggleVendor = (vId) => {
    setSelectedVendors(prev => 
      prev.includes(vId) ? prev.filter(i => i !== vId) : [...prev, vId]
    );
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading RFP details...</div>;
  if (!rfp) return <div className="p-8 text-center text-red-500">RFP Not Found</div>;

  const isDraft = rfp.status === 'Draft';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 mb-3 text-sm transition-colors">
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${isDraft ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
              {rfp.status}
            </span>
            <span className="text-slate-400 text-sm">Ref: {rfp._id}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{rfp.jsonData?.title || "Untitled Request"}</h1>
        </div>
        
        <div className="flex gap-3">
           {!isDraft && (
             <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-md shadow-purple-500/20"
             >
               <BarChart2 size={18} />
               {analyzing ? "Analyzing..." : (analysis ? "Re-Analyze Proposals" : "Analyze Proposals")}
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-blue-500" />
              Requirements
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Budget</div>
                  <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                    <DollarSign size={16} className="text-green-600" />
                    {rfp.jsonData?.budget?.toLocaleString()} {rfp.jsonData?.currency}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Deadline</div>
                  <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                    <Clock size={16} className="text-orange-500" />
                    {rfp.jsonData?.deadline}
                  </div>
                </div>
              </div>

              <div className="border rounded-xl overflow-hidden border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Specs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rfp.jsonData?.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-slate-500">{item.specs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
               <h3 className="text-sm font-semibold text-slate-700 mb-2">Original Request</h3>
               <p className="p-4 bg-slate-50 rounded-xl text-slate-600 italic text-sm border border-slate-100">
                 "{rfp.userRequest}"
               </p>
            </div>
          </div>

          {analysis && (
            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-md ring-4 ring-blue-50/50">
               <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart2 size={20} className="text-purple-500" />
                AI Analysis Report
              </h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-blue-100">
                  {analysis.analysis.recommendedVendorId ? (
                      <div className="space-y-6">
                          <div className="bg-white p-4 rounded-xl border-l-4 border-l-green-500 shadow-sm">
                             <div className="flex items-center gap-2 mb-2 text-green-700 font-bold uppercase text-xs tracking-wider">
                                <Trophy size={14} /> Recommended Vendor
                             </div>
                             <div className="text-xl font-bold text-slate-800 mb-1">
                                {analysis.analysis.rankings?.find(r => r.score >= 9)?.vendorName || "Top Choice Vendor"}
                             </div>
                             <p className="text-slate-600 text-sm italic">"{analysis.analysis.reasoning}"</p>
                          </div>

                          <div>
                              <h3 className="text-sm font-semibold text-slate-700 mb-3">Vendor Rankings</h3>
                              <div className="overflow-hidden rounded-lg border border-slate-200">
                                  <table className="w-full text-sm text-left">
                                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                                          <tr>
                                              <th className="px-4 py-2">Rank</th>
                                              <th className="px-4 py-2">Vendor</th>
                                              <th className="px-4 py-2">Score</th>
                                              <th className="px-4 py-2">Cost</th>
                                              <th className="px-4 py-2">Delivery</th>
                                              <th className="px-4 py-2">Notes</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 bg-white">
                                          {analysis.analysis.rankings?.map((rank, i) => (
                                              <tr key={i}>
                                                  <td className="px-4 py-2 font-medium text-slate-500">#{i + 1}</td>
                                                  <td className="px-4 py-2 font-medium text-slate-800">{rank.vendorName}</td>
                                                  <td className="px-4 py-2">
                                                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${Number(rank.score) >= 9 ? 'bg-green-100 text-green-700' : Number(rank.score) >= 7 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                          {rank.score}/10
                                                      </span>
                                                  </td>
                                                  <td className="px-4 py-2 text-slate-600 text-xs text-nowrap">{rank.cost ? `$${rank.cost}` : '-'}</td>
                                                  <td className="px-4 py-2 text-slate-600 text-xs">{rank.deliveryTime || '-'}</td>
                                                  <td className="px-4 py-2 text-slate-500 text-xs">{rank.note}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="whitespace-pre-wrap font-sans text-slate-700">{JSON.stringify(analysis.analysis, null, 2)}</div>
                  )}
              </div>
            </div>
          )}

        </div>

        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" />
              Target Vendors
            </h2>
            
            {isDraft ? (
               <div className="space-y-3">
                 <p className="text-xs text-slate-500 mb-2">Select vendors to send this RFP to:</p>
                 <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                   {vendors.map(vendor => (
                     <div 
                        key={vendor._id} 
                        onClick={() => toggleVendor(vendor._id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedVendors.includes(vendor._id) ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                     >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{vendor.name}</p>
                          <p className="text-xs text-slate-500">{vendor.email}</p>
                        </div>
                        {selectedVendors.includes(vendor._id) && <CheckCircle size={16} className="text-blue-600" />}
                     </div>
                   ))}
                 </div>
                 
                 <div className="pt-4 border-t border-slate-100 mt-4">
                    <button 
                      onClick={handleSendRFP}
                      disabled={sending || selectedVendors.length === 0}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {sending ? "Sending..." : "Send Request to Selected"}
                      <Send size={16} />
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-2">Will send emails to {selectedVendors.length} vendors</p>
                 </div>
               </div>
            ) : (
              <div className="space-y-3">
                 <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-700 text-sm font-medium">
                    <CheckCircle size={18} />
                    RFP Sent to Vendors
                 </div>
                 <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Participating Vendors</p>
                    <div className="space-y-2">
                    <div className="space-y-2">
                       {uniqueVendors.length > 0 ? (
                          uniqueVendors.map((vendor, index) => {
                            return (
                              <div key={vendor._id || index} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <p className="text-sm font-semibold text-slate-800">{vendor.name}</p>
                                <p className="text-xs text-slate-500">{vendor.email}</p>
                                <p className="text-xs text-slate-400 mt-1">Proposal Received</p>
                              </div>
                            );
                          })
                       ) : (
                          <p className="text-sm text-slate-400 italic">No proposals received yet.</p>
                       )}
                    </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFPDetails;
