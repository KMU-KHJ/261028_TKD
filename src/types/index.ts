export type Category = 'research' | 'course';

export interface PostLink {
  label: string;
  url: string;
}

export interface Post {
  id: string;
  title: string;
  category: Category;
  summary: string;
  content: string;
  tags: string[];
  links: PostLink[];
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

/** 글 작성·수정 폼에서 입력받는 값 (id, 작성자, 날짜는 서비스가 채움) */
export type PostInput = Pick<Post, 'title' | 'category' | 'summary' | 'content' | 'tags' | 'links'>;

export interface Comment {
  id: string;
  postId: string;
  authorUid: string;
  authorName: string;
  authorPhotoURL: string;
  text: string;
  createdAt: Date;
}

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isAdmin: boolean;
}
