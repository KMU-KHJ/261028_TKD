import type { Post } from '../../types';
import type { PostService } from '../types';
import { createId, delay, loadComments, loadPosts, saveComments, savePosts } from './storage';

function sortNewestFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const mockPostService: PostService = {
  async listPosts({ pageSize, cursor }) {
    await delay();
    const start = typeof cursor === 'number' ? cursor : 0;
    const all = sortNewestFirst(loadPosts());
    const posts = all.slice(start, start + pageSize);
    const next = start + pageSize;
    return { posts, nextCursor: next < all.length ? next : null };
  },

  async getPost(id) {
    await delay();
    return loadPosts().find((p) => p.id === id) ?? null;
  },

  async createPost(input, author) {
    await delay();
    const now = new Date();
    const post: Post = {
      ...input,
      id: createId(),
      authorName: author.displayName,
      createdAt: now,
      updatedAt: now,
    };
    savePosts([...loadPosts(), post]);
    return post;
  },

  async updatePost(id, input) {
    await delay();
    const posts = loadPosts();
    if (!posts.some((p) => p.id === id)) throw new Error('글을 찾을 수 없습니다.');
    savePosts(posts.map((p) => (p.id === id ? { ...p, ...input, updatedAt: new Date() } : p)));
  },

  async deletePost(id) {
    await delay();
    savePosts(loadPosts().filter((p) => p.id !== id));
    saveComments(loadComments().filter((c) => c.postId !== id));
  },
};
