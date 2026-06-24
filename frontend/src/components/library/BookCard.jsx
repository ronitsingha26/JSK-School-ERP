import React from 'react';
import { BookOpen, Eye, CornerUpRight } from 'lucide-react';

export default function BookCard({ book, onIssue, onView }) {
  const getAvailabilityPill = () => {
    if (book.availableCopies === 0) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-semibold">❌ Fully Issued</span>;
    if (book.availableCopies <= 1) return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-semibold">⚠️ Low Stock (1)</span>;
    return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-semibold">✅ Available ({book.availableCopies})</span>;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group">
      {/* TOP SECTION */}
      <div 
        className="h-[100px] relative flex justify-center items-center"
        style={{ backgroundColor: `${book.coverColor}33` }} // 20% opacity approx
      >
        <BookOpen size={48} color={book.coverColor} className="opacity-90" />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 border border-slate-200/50">
          Cat: {book.categoryId}
        </div>
        <div className="absolute bottom-2 left-2">
          {getAvailabilityPill()}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug" title={book.title}>{book.title}</h3>
        <p className="text-xs text-slate-500 mt-1 truncate">{book.author}</p>
        <div className="inline-block bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-0.5 rounded-full mt-1 border border-blue-100">
          {book.bookId}
        </div>

        <div className="h-px w-full bg-slate-100 my-3"></div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-slate-600 mb-3">
          <div className="flex items-center gap-1"><span className="text-slate-400">📖 Pages:</span> <span className="font-medium text-slate-700">{book.pages}</span></div>
          <div className="flex items-center gap-1 truncate" title={book.publisher}><span className="text-slate-400">🏢 Pub:</span> <span className="font-medium text-slate-700 truncate">{book.publisher}</span></div>
          <div className="flex items-center gap-1"><span className="text-slate-400">🌐 Lang:</span> <span className="font-medium text-slate-700">{book.language}</span></div>
          <div className="flex items-center gap-1"><span className="text-slate-400">📍 Rack:</span> <span className="font-medium text-slate-700">{book.rack}</span></div>
          <div className="flex items-center gap-1"><span className="text-slate-400">💰 Price:</span> <span className="font-medium text-slate-700">₹{book.price}</span></div>
          <div className="flex items-center gap-1"><span className="text-slate-400">📅 Added:</span> <span className="font-medium text-slate-700">{new Date(book.addedOn).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}</span></div>
        </div>

        {/* COPIES ROW */}
        <div className="text-[10px] flex justify-between text-slate-500 mb-1 font-medium">
          <span>Total: {book.totalCopies}</span>
          <span>Avail: <span className="text-green-600">{book.availableCopies}</span></span>
          <span>Out: <span className="text-orange-600">{book.issuedCopies}</span></span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}></div>
          <div className="bg-slate-300 h-full transition-all" style={{ width: `${((book.totalCopies - book.availableCopies) / book.totalCopies) * 100}%` }}></div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 mt-4">
          <button 
            disabled={book.availableCopies === 0}
            onClick={() => onIssue(book)}
            className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CornerUpRight size={14} /> Issue
          </button>
          <button 
            onClick={() => onView(book)}
            className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Eye size={14} /> View
          </button>
        </div>
      </div>
    </div>
  );
}
