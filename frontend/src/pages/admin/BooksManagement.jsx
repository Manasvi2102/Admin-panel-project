import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiBook,
  FiBox,
  FiSettings,
  FiUploadCloud,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiDollarSign,
  FiArchive
} from 'react-icons/fi';

const BooksManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewType, setViewType] = useState('table');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    price: '',
    discount: '0',
    stock: '',
    description: '',
    coverImage: '',
    publisher: '',
    publishYear: new Date().getFullYear().toString(),
    pages: '',
    language: 'English',
    format: 'Paperback',
    featured: false,
    bestSeller: false,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchCategories(), fetchAuthors()]);
      setLoading(false);
    };
    loadInitialData();
  }, [isAdmin]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books?limit=100');
      setBooks(response.data.data);
    } catch (err) {
      setError('Database link interrupted.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      setAuthors(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount) || 0,
        stock: parseInt(formData.stock),
        publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
      };

      if (!data.author || !data.category) {
        toast.error('Identity & Classification required.');
        return;
      }

      const promise = editingBook
        ? api.put(`/books/${editingBook._id}`, data)
        : api.post('/books', data);

      await toast.promise(promise, {
        loading: 'Processing archive...',
        success: editingBook ? 'Item updated.' : 'New entry created.',
        error: (err) => err.response?.data?.message || 'Action failed.'
      });

      setShowForm(false);
      setEditingBook(null);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', author: '', category: '', isbn: '', price: '', discount: '0', stock: '',
      description: '', coverImage: '', publisher: '', publishYear: new Date().getFullYear().toString(),
      pages: '', language: 'English', format: 'Paperback',
      featured: false, bestSeller: false,
    });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author?._id || book.author || '',
      category: book.category?._id || book.category || '',
      isbn: book.isbn,
      price: book.price,
      discount: book.discount || 0,
      stock: book.stock,
      description: book.description,
      coverImage: book.coverImage || '',
      publisher: book.publisher || '',
      publishYear: book.publishYear || '',
      pages: book.pages || '',
      language: book.language || 'English',
      format: book.format || 'Paperback',
      featured: book.featured || false,
      bestSeller: book.bestSeller || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete entry permanently?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Record purged.');
      fetchBooks();
    } catch (error) {
      toast.error('Deletion restricted.');
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && books.length === 0) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loading size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">

        {/* Simplified Global Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory Dashboard</h1>
            <p className="text-slate-500 font-medium text-sm">Managing {books.length} unique titles in the catalog</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button onClick={() => setViewType('table')} className={`p-2 rounded-xl transition-all ${viewType === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                <FiList size={22} />
              </button>
              <button onClick={() => setViewType('grid')} className={`p-2 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                <FiGrid size={22} />
              </button>
            </div>
            <button
              onClick={() => { resetForm(); setEditingBook(null); setShowForm(true); }}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold text-sm flex items-center gap-3 shadow-lg shadow-blue-100"
            >
              <FiPlus strokeWidth={3} />
              Add Record
            </button>
          </div>
        </div>

        {/* Professional Search Interface */}
        <div className="relative">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by Title or ISBN identifier..."
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content Area */}
        {viewType === 'table' ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">General Info</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Metadata</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                    <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={book.coverImage || 'https://via.placeholder.com/150'} className="w-10 h-14 rounded-lg object-cover shadow-sm" alt="" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{book.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">ISBN: {book.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-700">{book.author?.name || 'Unknown'}</p>
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md uppercase tracking-widest">
                            {book.category?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-900">₹{book.price.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full ${book.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (book.stock / 50) * 100)}%` }}></div>
                          </div>
                          <span className={`text-[11px] font-bold ${book.stock < 10 ? 'text-rose-600' : 'text-slate-500'}`}>{book.stock} Units</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(book)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><FiEdit size={16} /></button>
                          <button onClick={() => handleDelete(book._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="relative mb-5 aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
                  <img src={book.coverImage || 'https://via.placeholder.com/300x400'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <button onClick={() => handleEdit(book)} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg"><FiEdit size={20} /></button>
                    <button onClick={() => handleDelete(book._id)} className="p-3 bg-white text-rose-500 rounded-xl shadow-lg"><FiTrash2 size={20} /></button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3">{book.author?.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-slate-900">₹{book.price.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${book.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>QTY:{book.stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PROFESSIONAL CENTERED DIALOG (UNIFIED ADD & EDIT) --- */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col scale-in relative my-auto max-h-[90vh]">

              {/* Fixed Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${editingBook ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'} rounded-2xl flex items-center justify-center shadow-inner`}>
                    {editingBook ? <FiSettings size={28} /> : <FiArchive size={28} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {editingBook ? 'Edit Book Record' : 'Create New Record'}
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                      Archive Synchronization System
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} className="p-3 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-2xl transition-all">
                  <FiX size={24} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">

                {/* Visual Preview & Core Identity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-1 space-y-4">
                    <div className="aspect-[3/4] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                      {formData.coverImage ? (
                        <img src={formData.coverImage} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <FiUploadCloud size={40} className="mx-auto text-slate-300" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image Preview Unavailable</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset URL</label>
                      <input type="text" name="coverImage" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.coverImage} onChange={handleChange} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Official Book Title</label>
                      <input type="text" name="title" required className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none" value={formData.title} onChange={handleChange} placeholder="e.g. The Quantum Librarian" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identifier (ISBN/UID)</label>
                        <input type="text" name="isbn" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono focus:ring-2 focus:ring-blue-600 outline-none" value={formData.isbn} onChange={handleChange} placeholder="978-0-..." />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Curator (Author)</label>
                        <select name="author" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer" value={formData.author} onChange={handleChange}>
                          <option value="">Select Author</option>
                          {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Archive Classification</label>
                        <select name="category" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer" value={formData.category} onChange={handleChange}>
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-6 h-full pt-4">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-0" />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Featured</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                          <input type="checkbox" name="bestSeller" checked={formData.bestSeller} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-orange-500 focus:ring-0" />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-orange-500 transition-colors uppercase tracking-tight">Bestseller</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock Grid */}
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-10">
                  <div className="flex-1 space-y-6 border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg"><FiDollarSign size={16} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Financials</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Market Price (₹)</label>
                        <input type="number" step="0.01" name="price" required className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-lg font-black focus:border-blue-500 outline-none" value={formData.price} onChange={handleChange} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Incentive Disc %</label>
                        <input type="number" name="discount" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-lg font-black focus:border-blue-500 outline-none" value={formData.discount} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block w-px bg-slate-200 my-4"></div>
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg"><FiBox size={16} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Inventory</h4>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Available Units</label>
                      <input type="number" name="stock" required className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-lg font-black focus:border-blue-500 outline-none" value={formData.stock} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Narrative & Deep Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Narrative Synopsis</label>
                    <textarea name="description" required rows="6" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Provide a detailed abstract for the title..." value={formData.description} onChange={handleChange}></textarea>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      Metadata Constants
                    </h5>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Pub Year</label>
                          <input type="number" name="publishYear" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" value={formData.publishYear} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Total Pages</label>
                          <input type="number" name="pages" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" value={formData.pages} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Native Lang</label>
                          <input type="text" name="language" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" value={formData.language} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Print Format</label>
                          <select name="format" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none" value={formData.format} onChange={handleChange}>
                            <option value="Paperback">Paperback</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="E-book">E-book</option>
                            <option value="Audiobook">Audiobook</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/50 flex-shrink-0 border-b-[2rem] border-transparent">
                <button type="button" onClick={() => setShowForm(false)} className="px-10 py-5 bg-white border border-slate-200 text-slate-600 font-bold uppercase tracking-[0.2em] text-[11px] rounded-[1.5rem] hover:bg-slate-50 transition-all shadow-sm">
                  Cancel Transaction
                </button>
                <button onClick={handleSubmit} className="px-16 py-5 bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-200/50">
                  {editingBook ? 'Sync Updates' : 'Commit Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredBooks.length === 0 && !loading && (
          <div className="bg-white rounded-[2rem] py-32 text-center border-2 border-dashed border-slate-100">
            <FiBox className="w-20 h-20 mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-800">No Inventory Found</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 tracking-tight">Try adjusting your search query or catalog identifiers.</p>
          </div>
        )}
      </div>

      <style>{`
        .scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </AdminLayout>
  );
};

export default BooksManagement;
