import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }
  
  const q = query(collection(db, 'documents'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return NextResponse.json(documents);
}

export async function POST(request) {
  const { title, content, userId } = await request.json();
  
  if (!title || !content || !userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const docRef = await addDoc(collection(db, 'documents'), {
    title,
    content,
    userId,
    createdAt: new Date().toISOString(),
  });
  
  return NextResponse.json({ id: docRef.id, success: true }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  await deleteDoc(doc(db, 'documents', id));
  return NextResponse.json({ success: true });
}
