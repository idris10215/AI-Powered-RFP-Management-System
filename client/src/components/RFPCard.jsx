import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const RFPCard = ({ rfp }) => {
  const navigate = useNavigate();

  const statusColors = {
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Sent: "bg-blue-50 text-blue-600 border-blue-200",
    Closed: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <div 
      onClick={() => navigate(`/rfp/${rfp._id}`)}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[rfp.status] || statusColors.Draft}`}>
          {rfp.status}
        </span>
        <span className="text-xs text-slate-400">Ref: {rfp._id.slice(-6)}</span>
      </div>
      
      <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {rfp.jsonData?.title || rfp.userRequest.slice(0, 50) + "..."}
      </h3>

      <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
        {rfp.jsonData?.deadline && (
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{rfp.jsonData.deadline}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
           <span>{new Date(rfp.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default RFPCard;
