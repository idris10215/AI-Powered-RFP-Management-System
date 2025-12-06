import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRFP } from '../services/api';
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const CreateRFP = () => {
  const navigate = useNavigate();
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data } = await createRFP({ userRequest: request });
      if (data && data.rfp) {
        navigate(`/rfp/${data.rfp._id}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create RFP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create New RFP</h1>
        <p className="text-slate-500 mt-2">Just describe what you need, and our AI will structure it for you.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="request" className="block text-sm font-semibold text-slate-700 mb-2">
              Your Requirement
            </label>
            <div className="relative">
              <textarea
                id="request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="E.g., I need 20 MacBook Pros with M3 chips for our design team. Budget is around $50,000. Delivery needed by next month."
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder:text-slate-400"
                required
              />
              <div className="absolute bottom-4 right-4 text-slate-400 text-xs">
                {request.length} chars
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
               <Sparkles size={16} className="text-purple-500" />
               <span>AI-Powered Parsing</span>
            </div>
            
            <button
              type="submit"
              disabled={loading || !request.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate RFP
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
            "Hardware Procurement",
            "Software Licenses",
            "Office Furniture"
        ].map(ex => (
            <button 
                key={ex}
                onClick={() => setRequest(prev => prev + (prev ? " " : "") + `I need to procure ${ex.toLowerCase()}...`)}
                className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all text-left"
            >
                <div className="font-semibold mb-1">Example</div>
                "{ex}..."
            </button>
        ))}
      </div>
    </div>
  );
};

export default CreateRFP;
