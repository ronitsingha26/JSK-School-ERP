import React, { useState } from 'react';
import { LayoutGrid, LayoutList, PlusCircle, Download, X, Search } from 'lucide-react';
import BookCard from './BookCard';
import BookTable from './BookTable';
import { bookCategories, publishers } from '../../data/dummyData';

export default function BookCatalog({ 
  books, setBooks, search, setSearch, filters, setFilters, 
  setShowAddModal, setTargetBook, setShowEditModal, setShowDetail, setActiveTab 
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const handleIssue = (book) => {
    // We would navigate to Issue Book tab and pre-select this book
    setTargetBook(book);
    setActiveTab('issue');
  };

  const handleView = (book) => {
    setTargetBook(book);
    setShowDetail(true);
  };

  const handleEdit = (book) => {
    setTargetBook(book);
    setShowEditModal(true);
  };

  // Filter books
  const filteredBooks = books.filter(b => {
    // Search
    if (search) {
      const q = search.toLowerCase();
      const matchSearch = b.title.toLowerCase().includes(q) || 
                          b.author.toLowerCase().includes(q) || 
                          b.isbn.toLowerCase().includes(q) ||
                          b.bookId.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }
    
    // Category
    if (filters.category && b.categoryId.toString() !== filters.category) return false;
    
    // Language
    if (filters.language && b.language.toLowerCase() !== filters.language.toLowerCase()) return false;
    
    // Publisher
    if (filters.publisher && b.publisherId.toString() !== filters.publisher) return false;
    
    // Availability
    if (filters.availability) {
      if (filters.availability === 'available' && b.availableCopies === 0) return false;
      if (filters.availability === 'fully_issued' && b.availableCopies > 0) return false;
      if (filters.availability === 'low_stock' && (b.availableCopies > 1 || b.availableCopies === 0)) return false;
    }
    
    // Rack
    if (filters.rack && !b.rack.startsWith(filters.rack)) return false;

    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-transparent">
        <h2 className="text-lg font-bold text-slate-800">Book Catalog ({filteredBooks.length} books)</h2>
        
        <div className="flex gap-3 items-center">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <LayoutList size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => { setTargetBook(null); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusCircle size={18} /> Add New Book
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative min-w-[250px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search title, author, ISBN, Book ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category */}
          <select 
            value={filters.category} 
            onChange={e => setFilters({...filters, category: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium min-w-[140px]"
          >
            <option value="">Category ▾</option>
            {bookCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Language */}
          <select 
            value={filters.language} 
            onChange={e => setFilters({...filters, language: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
          >
            <option value="">Language ▾</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Sanskrit">Sanskrit</option>
          </select>

          {/* Publisher */}
          <select 
            value={filters.publisher} 
            onChange={e => setFilters({...filters, publisher: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium max-w-[150px]"
          >
            <option value="">Publisher ▾</option>
            {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {/* Availability */}
          <select 
            value={filters.availability} 
            onChange={e => setFilters({...filters, availability: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
          >
            <option value="">Availability ▾</option>
            <option value="available">Available</option>
            <option value="fully_issued">Fully Issued</option>
            <option value="low_stock">Low Stock</option>
          </select>

          {/* Rack */}
          <select 
            value={filters.rack} 
            onChange={e => setFilters({...filters, rack: e.target.value})}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none font-medium"
          >
            <option value="">Rack ▾</option>
            {['A','B','C','D','E','F','G'].map(r => <option key={r} value={r}>Rack {r}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => { setSearch(""); setFilters({category:"", language:"", publisher:"", availability:"", rack:""}); }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <X size={16} /> Reset
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {viewMode === 'list' ? (
        <BookTable 
          books={filteredBooks} 
          onIssue={handleIssue} 
          onView={handleView} 
          onEdit={handleEdit} 
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onIssue={handleIssue} 
              onView={handleView} 
            />
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
               No books matched your criteria.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
