import { isFirebaseConfigured } from '../lib/config';
import { firebaseAuthService } from './firebase/authService';
import { firebaseCommentService } from './firebase/commentService';
import { firebasePostService } from './firebase/postService';
import { mockAuthService } from './mock/authService';
import { mockCommentService } from './mock/commentService';
import { mockPostService } from './mock/postService';
import type { AuthService, CommentService, PostService } from './types';

export type { AuthService, CommentService, PostService, PageCursor, PostPage, TestRole } from './types';

/** true면 Firebase 없이 이 브라우저(localStorage)에만 저장하는 테스트 모드 */
export const isMockMode = !isFirebaseConfigured;

export const authService: AuthService = isMockMode ? mockAuthService : firebaseAuthService;
export const postService: PostService = isMockMode ? mockPostService : firebasePostService;
export const commentService: CommentService = isMockMode ? mockCommentService : firebaseCommentService;
