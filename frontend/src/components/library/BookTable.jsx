import React from 'react';
import { BookOpen, Eye, Pencil, CornerUpRight, Trash2 } from 'lucide-react';
import { bookCategories } from '../../data/dummyData';

export default function BookTable({ books, onIssue, onView, onEdit }) {
  const getCatStr = (cid) => bookCategories.find(c => c.id === cid);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-4 pl-5 w-12 text-center">#</th>
            <th className="p-4">Book</th>
            <th className="p-4">Book ID</th>
            <th className="p-4">Category</th>
            <th className="p-4">Copies</th>
            <th className="p-4">Rack</th>
            <th className="p-4">Availability</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-8 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center">
                  <BookOpen size={48} className="text-slate-200 mb-3" />
                  <p className="text-sm font-medium text-slate-600">No books found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            books.map((book, idx) => {
              const cat = getCatStr(book.categoryId);
              
              const getAvailabilityPill = () => {
                if (book.availableCopies === 0) return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">❌ Fully Issued</span>;
                if (book.availableCopies === 1) return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-semibold">⚠️ Low Stock (1)</span>;
                return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">✅ Available ({book.availableCopies})</span>;
              };

              return (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 pl-5 text-sm text-slate-500 text-center">{idx + 1}</td>
                  <td className="p-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${book.coverColor}20` }}>
                        <BookOpen size={20} color={book.coverColor} />
                      </div>
                      <div className="max-w-[200px]">
                        <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight" title={book.title}>{book.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{book.author} · {book.edition}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ISBN: {book.isbn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold px-2 py-1 rounded-md border border-blue-100">
                      {book.bookId}
                    </span>
                  </td>
                  <td className="p-4">
                    {cat && (
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        📚 {cat.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-[13px] font-medium text-slate-700 mb-1">{book.totalCopies} Total</div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(book.availableCopies/book.totalCopies)*100}%` }}></div>
                        <div className="bg-slate-300 h-full transition-all" style={{ width: `${((book.totalCopies-book.availableCopies)/book.totalCopies)*100}%` }}></div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">{book.availableCopies} left</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200 whitespace-nowrap">
                      {book.rack} / {book.shelf}
                    </span>
                  </td>
                  <td className="p-4">
                    {getAvailabilityPill()}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onView(book)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(book)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit Book">
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => onIssue(book)} 
                        disabled={book.availableCopies === 0}
                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                        title="Issue Book"
                      >
                        <CornerUpRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
