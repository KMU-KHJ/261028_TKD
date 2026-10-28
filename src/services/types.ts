import type { AppUser, Comment, Post, PostInput } from '../types';

/** 다음 페이지를 불러올 위치. 구현마다 내용이 달라서 화면에서는 그대로 돌려주기만 합니다. */
export type PageCursor = unknown;

export interface PostPage {
  posts: Post[];
  /** 더 불러올 글이 없으면 null */
  nextCursor: PageCursor | null;
}

export type TestRole = 'admin' | 'student';

export interface AuthService {
  /** 로그인 상태가 바뀔 때마다 호출됩니다. 반환된 함수를 호출하면 구독 해제. */
  onAuthChange(callback: (user: AppUser | null) => void): () => void;
  signInWithGoogle(): Promise<void>;
  /** 테스트 모드에서만 사용 */
  signInAsTestUser(role: TestRole): Promise<void>;
  signOut(): Promise<void>;
}

export interface PostService {
  listPosts(options: { pageSize: number; cursor?: PageCursor | null }): Promise<PostPage>;
  getPost(id: string): Promise<Post | null>;
  createPost(input: PostInput, author: AppUser): Promise<Post>;
  updatePost(id: string, input: PostInput): Promise<void>;
  deletePost(id: string): Promise<void>;
}

export interface CommentService {
  listComments(postId: string): Promise<Comment[]>;
  addComment(postId: string, text: string, author: AppUser): Promise<Comment>;
  deleteComment(postId: string, commentId: string): Promise<void>;
}
