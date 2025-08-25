
import type { Post, User } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, serverTimestamp, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// Helper to fetch a user by ID
async function getUser(userId: string): Promise<User | null> {
    if (!userId) return null;
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return { id: userDocSnap.id, ...userDocSnap.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

// Helper to convert Firestore timestamp to string
const convertTimestamp = (timestamp: Timestamp | Date | string | undefined): string => {
    if (!timestamp) return new Date().toISOString();
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    }
    if (timestamp instanceof Date) {
        return timestamp.toISOString();
    }
    return timestamp;
};

export async function getPosts(): Promise<Post[]> {
  try {
    const postsCol = collection(db, 'posts');
    const q = query(postsCol, orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const postsWithAuthors = await Promise.all(postsList.map(async (post) => {
      const author = await getUser(post.authorId);
      return {
        ...post,
        author: author || { id: 'unknown', name: 'Unknown User', avatarUrl: '' },
        createdAt: convertTimestamp(post.createdAt as Timestamp),
        comments: post.comments || [],
        likes: post.likes || 0,
      } as Post;
    }));

    return postsWithAuthors;
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

export async function getPost(id: string): Promise<Post | undefined> {
  try {
    const postDocRef = doc(db, 'posts', id);
    const postDocSnap = await getDoc(postDocRef);

    if (postDocSnap.exists()) {
      const postData = postDocSnap.data();
      const author = await getUser(postData.authorId);
      
      // Fetch comments' authors
      const commentsWithAuthors = await Promise.all((postData.comments || []).map(async (comment: any) => {
        const commentAuthor = await getUser(comment.authorId);
        return {
          ...comment,
          author: commentAuthor || { id: 'unknown', name: 'Unknown User', avatarUrl: '' },
          createdAt: convertTimestamp(comment.createdAt as Timestamp),
        };
      }));

      return {
        id: postDocSnap.id,
        ...postData,
        author: author || { id: 'unknown', name: 'Unknown User', avatarUrl: '' },
        createdAt: convertTimestamp(postData.createdAt as Timestamp),
        comments: commentsWithAuthors,
        likes: postData.likes || 0,
      } as Post;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    return undefined;
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  if (!userId) return [];
  try {
    const postsCol = collection(db, 'posts');
    const q = query(postsCol, where("authorId", "==", userId), orderBy('createdAt', 'desc'));
    const postsSnapshot = await getDocs(q);
    const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const author = await getUser(userId);
    
    const postsWithAuthors = postsList.map((post) => {
      return {
        ...post,
        author: author || { id: 'unknown', name: 'Unknown User', avatarUrl: '' },
        createdAt: convertTimestamp(post.createdAt as Timestamp),
        comments: post.comments || [],
        likes: post.likes || 0,
      } as Post;
    });

    return postsWithAuthors;
  } catch (error) {
    console.error("Error fetching user posts: ", error);
    return [];
  }
}
