import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getDb } from '../../lib/firebase';
import type { Comment } from '../../types';
import type { CommentService } from '../types';
import { toComment } from './convert';

// 한 글에서 읽어오는 최대 댓글 수 (무료 한도 보호용 안전장치)
const MAX_COMMENTS = 300;

export const firebaseCommentService: CommentService = {
  async listComments(postId) {
    const q = query(
      collection(getDb(), 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc'),
      limit(MAX_COMMENTS),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => toComment(d.id, postId, d.data()));
  },

  async addComment(postId, text, author) {
    const ref = await addDoc(collection(getDb(), 'posts', postId, 'comments'), {
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      text,
      createdAt: serverTimestamp(),
    });
    // 다시 조회하지 않고 화면에 바로 붙일 수 있도록 만들어 돌려줍니다.
    const comment: Comment = {
      id: ref.id,
      postId,
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      text,
      createdAt: new Date(),
    };
    return comment;
  },

  async deleteComment(postId, commentId) {
    await deleteDoc(doc(getDb(), 'posts', postId, 'comments', commentId));
  },
};
