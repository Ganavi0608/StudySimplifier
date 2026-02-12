import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  documents: [],
  loading: false,
  
  setUser: (user) => set({ user }),
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    )
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
}));
