import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { students, teachersData } from '../../data/dummyData';
import { toast } from 'react-hot-toast';

export default function AddMemberModal({ isOpen, onClose, onAdd, allMembers, settings }) {
  const [type, setType] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  nextYear.setMonth(2); // March
  nextYear.setDate(31); 
  const defaultDate = nextYear.toISOString().split('T')[0];

  const [maxBooks, setMaxBooks] = useState(settings?.maxBooksStudent || 3);
  const [validUntil, setValidUntil] = useState(defaultDate);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    setSearchTerm('');
    setSelectedPerson(null);
    setMaxBooks(newType === 'student' ? settings.maxBooksStudent : settings.maxBooksTeacher);
  };

  const getResults = () => {
    if (!searchTerm) return [];
    const q = searchTerm.toLowerCase();
    if (type === 'student') {
      return students.filter(s => 
        s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q)
      ).slice(0, 5);
    } else {
      return teachersData.filter(t => 
        t.name.toLowerCase().includes(q) || t.empId.toLowerCase().includes(q)
      ).slice(0, 5);
    }
  };

  const results = getResults();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPerson) {
      toast.error('Please select a student or teacher');
      return;
    }

    // Auto generate ID
    const maxId = allMembers.reduce((max, m) => {
      const num = parseInt(m.memberId.replace('LIB-M-', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newId = `LIB-M-${String(maxId + 1).padStart(4, '0')}`;

    const newMember = {
      id: Date.now(),
      memberId: newId,
      memberType: type,
      refId: selectedPerson.id,
      name: selectedPerson.name,
      classOrDesig: type === 'student' ? `Adm: ${selectedPerson.admNo}` : `Emp: ${selectedPerson.empId}`,
      mobile: selectedPerson.mobile,
      maxBooksAllowed: Number(maxBooks),
      currentIssued: 0,
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: validUntil,
      fineBalance: 0,
      isActive: true,
      avatar: selectedPerson.avatar,
      avatarColor: selectedPerson.avatarColor
    };

    onAdd(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scale-in">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Add Library Member</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <form id="add-member-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Member Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={type === 'student'} onChange={() => handleTypeChange('student')} className="accent-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={type === 'teacher'} onChange={() => handleTypeChange('teacher')} className="accent-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Teacher</span>
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Search {type === 'student' ? 'Student' : 'Teacher'} *</label>
              {!selectedPerson ? (
                 <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder={`Search by name or ${type === 'student' ? 'Admission No' : 'Emp ID'}...`}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                   />
                   
                   {/* Dropdown */}
                   {searchTerm && results.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
                        {results.map(p => (
                          <div 
                            key={p.id} 
                            onClick={() => setSelectedPerson(p)}
                            className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: p.avatarColor }}>{p.avatar}</div>
                            <div>
                               <p className="text-sm font-bold text-slate-800">{p.name}</p>
                               <p className="text-xs text-slate-500">{type==='student'? p.admNo : p.empId}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   )}
                 </div>
              ) : (
                 <div className="flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: selectedPerson.avatarColor }}>{selectedPerson.avatar}</div>
                      <div>
                          <p className="text-sm font-bold text-slate-800">{selectedPerson.name}</p>
                          <p className="text-xs text-slate-500">{type==='student'? selectedPerson.admNo : selectedPerson.empId}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedPerson(null)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Change</button>
                 </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Books Allowed *</label>
                  <input type="number" value={maxBooks} onChange={(e) => setMaxBooks(e.target.value)} required min={1} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Valid Until *</label>
                  <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
               </div>
            </div>

            <div>
               <label className="block text-xs font-semibold text-slate-600 mb-1">MEMBER ID</label>
               <div className="bg-slate-100 border border-slate-200 text-slate-500 text-sm font-mono px-3 py-2 rounded-lg cursor-not-allowed">
                  Auto-generated on save
               </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="add-member-form" className="px-5 py-2 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            Add Member →
          </button>
        </div>

      </div>
    </div>
  );
}
