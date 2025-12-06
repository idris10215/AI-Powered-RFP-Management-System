import React, { useEffect, useState } from 'react';
import { fetchVendors } from '../services/api';
import { Users, Mail, Tag, Search } from 'lucide-react';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const { data } = await fetchVendors();
      setVendors(data.vendors || []);
    } catch (error) {
      console.error("Failed to load vendors", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.category && vendor.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Vendor Directory</h1>
          <p className="text-slate-500 mt-1">Manage your supply chain partners.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
             <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
             </div>
        </div>

        {loading ? (
             <div className="p-8 text-center text-slate-500">Loading directory...</div>
        ) : filteredVendors.length === 0 ? (
            <div className="p-12 text-center">
                <Users size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-700">No Vendors Found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">
                    {searchTerm ? "Try adjusting your search terms." : "It seems you haven't added any vendors to the database yet."}
                </p>
            </div>
        ) : (
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                <tr>
                <th className="px-6 py-4 border-b border-slate-100">Company Name</th>
                <th className="px-6 py-4 border-b border-slate-100">Contact Email</th>
                <th className="px-6 py-4 border-b border-slate-100">Category</th>
                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {vendor.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{vendor.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            {vendor.email}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <Tag size={12} />
                            {vendor.category || "General"}
                         </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default VendorList;
