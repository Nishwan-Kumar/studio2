
import type { Post, User, Comment } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, serverTimestamp, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

const sampleAuthor: User = {
    id: 'sample-author-id',
    name: 'Jane Doe',
    avatarUrl: 'https://placehold.co/100x100.png',
};

const sampleComments: Comment[] = [
    {
        id: 'comment-1',
        text: 'This is a truly insightful post. Thanks for sharing!',
        author: { id: 'commenter-1', name: 'Alex', avatarUrl: 'https://placehold.co/100x100.png' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
        id: 'comment-2',
        text: 'I had never thought about it this way. Great perspective.',
        author: { id: 'commenter-2', name: 'Maria', avatarUrl: 'https://placehold.co/100x100.png' },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    }
]

const samplePosts: Post[] = [
  {
    id: 'sample-1',
    title: 'Exploring the Wonders of the Cosmos',
    description: 'A deep dive into the mysteries of our universe, from distant galaxies to the smallest particles.',
    content: 'The universe is a vast and awe-inspiring place. For centuries, humans have looked to the stars and wondered about our place in the cosmos. In this post, we will explore some of the most fascinating aspects of space, from the birth of stars to the enigmatic nature of dark matter.\n\nJoin us on a journey through space and time as we uncover the secrets of the universe.',
    author: sampleAuthor,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    comments: sampleComments,
    likes: 42,
  },
  {
    id: 'sample-2',
    title: 'The Art of Mindful Programming',
    description: 'How to write better code by staying present and focused.',
    content: 'In the fast-paced world of software development, it\'s easy to get lost in a sea of deadlines and feature requests. Mindful programming is a practice that encourages developers to slow down, focus on the task at hand, and write code that is not only functional but also clean, readable, and maintainable.\n\nThis approach can lead to fewer bugs, better collaboration, and a more enjoyable coding experience. We\'ll cover techniques like single-tasking, deliberate practice, and the importance of taking breaks.',
    author: sampleAuthor,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    comments: [],
    likes: 18,
  },
  {
    id: 'sample-3',
    title: 'A Culinary Adventure: The Perfect Sourdough',
    description: 'Master the art and science of baking delicious sourdough bread at home.',
    content: 'Baking sourdough bread is a rewarding experience that combines science, patience, and a little bit of magic. From nurturing your own starter to achieving that perfect crispy crust and chewy crumb, this guide will walk you through every step of the process.\n\nWe will demystify the terminology, explain the science behind fermentation, and provide a foolproof recipe that will have you baking like a pro in no time.',
    author: sampleAuthor,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    comments: [],
    likes: 73,
  },
];


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

    if (postsSnapshot.empty) {
        return samplePosts;
    }

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
    // Return sample posts on error to avoid a blank page
    return samplePosts;
  }
}

export async function getPost(id: string): Promise<Post | undefined> {
  // If the ID is a sample ID, return the sample post
  const samplePost = samplePosts.find(p => p.id === id);
  if (samplePost) {
    return samplePost;
  }

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
