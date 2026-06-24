import React from 'react';
import { Users, PlusCircle, Search, Eye, Pencil, CornerUpRight, Trash2, IndianRupee } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MembersTab({
  members, setMembers, search, setSearch, filters, setFilters,
  setShowAddModal, setTargetMember, setShowDetail, setActiveTab
}) {

  const handleIssue = (member) => {
    if (member.fineBalance > 0) {
      toast.error('Clear outstanding fine before issuing new books.');
      return;
    }
    if (member.currentIssued >= member.maxBooksAllowed) {
      toast.error('Maximum book limit reached.');
      return;
    }
    setTargetMember(member);
    setActiveTab('issue');
  };

  const handleView = (member) => {
    setTargetMember(member);
    setShowDetail(true);
  };

  const handleEdit = (member) => {
    toast('Edit member coming soon', { icon: '✏️' });
  };
  
  const handleRemove = () => {
    if(window.confirm('Are you sure you want to remove this member?')) {
      toast.success('Member removed');
    }
  }

  // Filter
  const filteredMembers = members.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && 
          !m.memberId.toLowerCase().includes(q) && 
          !m.mobile.includes(q)) return false;
    }
    if (filters.type && m.memberType !== filters.type) return false;
    
    // Status
    if (filters.status) {
      const today = new Date().toISOString().split("T")[0];
      const expired = m.expiryDate < today;
      if (filters.status === 'active' && (!m.isActive || expired)) return false;
      if (filters.status === 'expired' && !expired) return false;
      if (filters.status === 'inactive' && m.isActive) return false;
    }

    if (filters.hasFine) {
      if (filters.hasFine === 'yes' && m.fineBalance <= 0) return false;
      if (filters.hasFine === 'no' && m.fineBalance > 0) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Library Members ({filteredMembers.length})</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <PlusCircle size={18} /> Add Member
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="relative min-w-[250px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name, member ID, mobile..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select 
          value={filters.type} 
          onChange={e => setFilters({...filters, type: e.target.value})}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
        >
          <option value="">Type ▾</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <select 
          value={filters.status} 
          onChange={e => setFilters({...filters, status: e.target.value})}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
        >
          <option value="">Status ▾</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>
        <select 
          value={filters.hasFine} 
          onChange={e => setFilters({...filters, hasFine: e.target.value})}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
        >
          <option value="">Has Fine ▾</option>
          <option value="yes">With Fine</option>
          <option value="no">No Fine</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 pl-5 w-12 text-center">#</th>
              <th className="p-4">Member</th>
              <th className="p-4">Member ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Books</th>
              <th className="p-4">Fine</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMembers.length === 0 ? (
               <tr>
                 <td colSpan="9" className="p-8 text-center text-slate-500">
                   <div className="flex flex-col items-center justify-center">
                     <Users size={48} className="text-slate-200 mb-3" />
                     <p className="text-sm font-medium text-slate-600">No members found</p>
                   </div>
                 </td>
               </tr>
            ) : (
              filteredMembers.map((m, idx) => {
                const today = new Date().toISOString().split("T")[0];
                const dFuture = new Date(m.expiryDate);
                const dToday = new Date(today);
                const daysDiff = Math.ceil((dFuture - dToday) / (1000*60*60*24));
                const isExpired = daysDiff < 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-5 text-sm text-slate-500 text-center">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm" style={{ backgroundColor: m.avatarColor }}>
                          {m.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-500">{m.classOrDesig} · {m.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold px-2 py-1 rounded-md border border-blue-100">
                        {m.memberId}
                      </span>
                    </td>
                    <td className="p-4">
                      {m.memberType === 'student' ? (
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">🎓 Student</span>
                      ) : (
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold">👨‍🏫 Teacher</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-[13px] font-medium text-slate-700 mb-1">{m.currentIssued} / {m.maxBooksAllowed}</div>
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className="bg-blue-500 h-full" style={{ width: `${(m.currentIssued/m.maxBooksAllowed)*100}%` }}></div>
                      </div>
                      {m.currentIssued >= m.maxBooksAllowed && <div className="text-[10px] text-red-600 font-semibold">⚠️ Limit Reached</div>}
                    </td>
                    <td className="p-4">
                      {m.fineBalance === 0 ? (
                        <span className="text-emerald-600 font-medium text-sm">₹0</span>
                      ) : (
                        <div>
                          <p className="text-red-600 font-bold text-sm">₹{m.fineBalance}</p>
                          <p className="text-[10px] bg-red-100 text-red-700 rounded px-1 mt-0.5 inline-block font-semibold">Outstanding</p>
                          <button 
                            className="mt-1 flex items-center justify-center gap-1 w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[10px] text-orange-700 font-bold py-0.5 rounded transition-colors"
                            onClick={() => toast.success(`Fine collected for ${m.name}`)}
                          >
                            <IndianRupee size={10} /> Collect
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-700">{new Date(m.expiryDate).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}</p>
                      {isExpired ? (
                        <span className="bg-red-100 text-red-700 px-1.5 rounded text-[10px] font-bold mt-1 inline-block">Expired</span>
                      ) : (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Expires in {daysDiff} days</p>
                      )}
                    </td>
                    <td className="p-4">
                      {!m.isActive ? <span className="text-slate-500 text-xs font-semibold">● Inactive</span> :
                       isExpired  ? <span className="text-red-600 text-xs font-semibold">● Expired</span> :
                                    <span className="text-emerald-600 text-xs font-semibold">● Active</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleView(m)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(m)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bgemerald-50 rounded transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleIssue(m)} 
                          disabled={m.currentIssued >= m.maxBooksAllowed || m.fineBalance > 0 || isExpired}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                          title="Issue Book"
                        >
                          <CornerUpRight size={16} />
                        </button>
                        <button onClick={handleRemove} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
