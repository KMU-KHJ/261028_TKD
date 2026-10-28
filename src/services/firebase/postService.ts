import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  writeBatch,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getDb } from '../../lib/firebase';
import type { Post } from '../../types';
import type { PostService } from '../types';
import { toPost } from './convert';

// 무료 한도를 아끼기 위해 onSnapshot(실시간 구독) 대신 필요할 때만 getDocs로 읽습니다.
export const firebasePostService: PostService = {
  async listPosts({ pageSize, cursor }) {
    const postsRef = collection(getDb(), 'posts');
    const q = cursor
      ? query(postsRef, orderBy('createdAt', 'desc'), startAfter(cursor as QueryDocumentSnapshot), limit(pageSize))
      : query(postsRef, orderBy('createdAt', 'desc'), limit(pageSize));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map((d) => toPost(d.id, d.data()));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    return { posts, nextCursor: snapshot.docs.length === pageSize ? lastDoc : null };
  },

  async getPost(id) {
    const snapshot = await getDoc(doc(getDb(), 'posts', id));
    return snapshot.exists() ? toPost(snapshot.id, snapshot.data()) : null;
  },

  async createPost(input, author) {
    const ref = await addDoc(collection(getDb(), 'posts'), {
      ...input,
      authorName: author.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const now = new Date();
    const post: Post = { ...input, id: ref.id, authorName: author.displayName, createdAt: now, updatedAt: now };
    return post;
  },

  async updatePost(id, input) {
    await updateDoc(doc(getDb(), 'posts', id), { ...input, updatedAt: serverTimestamp() });
  },

  async deletePost(id) {
    // Firestore는 글을 지워도 하위 댓글이 남기 때문에 댓글을 먼저 지웁니다.
    // (배치 1회 최대 500건이므로 나눠서 처리)
    const db = getDb();
    const comments = await getDocs(collection(db, 'posts', id, 'comments'));
    for (let i = 0; i < comments.docs.length; i += 450) {
      const batch = writeBatch(db);
      comments.docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    await deleteDoc(doc(db, 'posts', id));
  },
};
