
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  role?: 'admin';
  uid?: string;
  email?: string;
};

export type Comment = {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  authorId?: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  content: string;
  author: User;
  createdAt: string;
  comments: Comment[];
  likes: number;
  authorId?: string;
};
