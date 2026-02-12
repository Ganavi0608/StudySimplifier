import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import ChatBox from './ChatBox';

export default function Dashboard({ user, onLogout }) {
  const { documents, setDocuments, addDocument, updateDocument, deleteDocument } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [aiResult, setAiResult] = useState('');
  const [aiSource, setAiSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const q = query(collection(db, 'documents'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleCreate = async () => {
    if (!title || !content) {
      alert('Please fill in both title and content');
      return;
    }
    
    setLoading(true);
    try {
     
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const docRef = await addDoc(collection(db, 'documents'), {
        title,
        content,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      
      addDocument({ 
        id: docRef.id, 
        title, 
        content, 
        userId: user.uid, 
        createdAt: new Date() 
      });
      
      setTitle('');
      setContent('');
      alert('Document created!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleAI = async (type) => {
    if (!selectedDoc) return;
    setAiLoading(true);
    setAiResult('');
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedDoc.content, type }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert('AI Error: ' + data.error);
      } else {
        setAiResult(data.result);
        setAiSource(data.source || 'AI');
      }
    } catch (error) {
      console.error('AI Error:', error);
      alert('Failed to generate AI response: ' + error.message);
    }
    
    setAiLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      await deleteDoc(doc(db, 'documents', id));
      deleteDocument(id);
    } catch (error) {
      alert('Delete error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-teal-600">StudySimplify</h1>
          <p className="text-xs text-slate-500">Your study companion</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-700">{user.email}</span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6 grid grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Add Study Material</h2>
          
          <input
            type="text"
            placeholder="Title (e.g., Chapter 5: Photosynthesis)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            placeholder="Paste your study content from PDFs, notes, or articles here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded mb-3 h-32 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 disabled:bg-slate-400"
          >
            {loading ? 'Adding...' : 'Add Material'}
          </button>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-slate-900">My Study Materials</h2>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50 hover:border-teal-500 transition"
                onClick={() => setSelectedDoc(doc)}
              >
                <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                <p className="text-sm text-slate-600 truncate">{doc.content}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.id);
                  }}
                  className="text-red-500 text-sm mt-2 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

     
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-slate-900">AI Simplification</h2>
          {selectedDoc ? (
            <>
              <h3 className="font-semibold mb-2 text-slate-900">{selectedDoc.title}</h3>
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleAI('summary')}
                  className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 disabled:bg-slate-400"
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Simplifying...' : '📝 Simplify Content'}
                </button>
                <button
                  onClick={() => handleAI('insights')}
                  className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 disabled:bg-slate-400"
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Analyzing...' : '💡 Study Insights'}
                </button>
              </div>
              {aiLoading && <p className="text-slate-600">AI is thinking...</p>}
              {aiResult && (
                <div className="p-4 bg-slate-50 rounded mt-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-teal-600">{aiSource}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-slate-700">{aiResult}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-600">Select study material to simplify</p>
          )}
        </div>
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition z-40"
      >
        💬
      </button>

    
      <ChatBox isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}


DashBoard.js
