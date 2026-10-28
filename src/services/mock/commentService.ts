import type { Comment } from '../../types';
import type { CommentService } from '../types';
import { createId, delay, loadComments, saveComments } from './storage';

export const mockCommentService: CommentService = {
  async listComments(postId) {
    await delay();
    return loadComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async addComment(postId, text, author) {
    await delay(150);
    const comment: Comment = {
      id: createId(),
      postId,
      authorUid: author.uid,
      authorName: author.displayName,
      authorPhotoURL: author.photoURL,
      text,
      createdAt: new Date(),
    };
    saveComments([...loadComments(), comment]);
    return comment;
  },

  async deleteComment(_postId, commentId) {
    await delay(150);
    saveComments(loadComments().filter((c) => c.id !== commentId));
  },
};
