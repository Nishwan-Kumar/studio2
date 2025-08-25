
import type { Post, User } from './types';
import { auth, db } from './firebase';
import { getDoc, doc } from 'firebase/firestore';

const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100.png', role: 'admin' },
  { id: 'user-2', name: 'Jane Smith', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'Sam Wilson', avatarUrl: 'https://placehold.co/100x100.png' },
];

const posts: Post[] = [
  {
    id: 'post-1',
    title: 'The Art of Digital Storytelling',
    description: 'Exploring how technology shapes the narratives of our time.',
    content: `In the heart of the digital age, storytelling has found new canvases. From interactive web experiences to virtual reality, the ways we share and consume stories are evolving. This post delves into the tools, techniques, and philosophies behind modern digital narratives.

We'll look at how user interaction can create a more personal and immersive experience, breaking the fourth wall in ways traditional media never could. We will also explore the challenges, such as maintaining narrative coherence in a non-linear format and ensuring accessibility for all users. Join us on a journey through the pixels and code that are redefining the ancient art of the story.`,
    author: users[0],
    createdAt: '2024-05-10T14:48:00.000Z',
    likes: 12,
    comments: [
      { id: 'comment-1', text: 'A fascinating read! Really makes you think about the future of media.', author: users[1], createdAt: '2024-05-10T15:12:00.000Z' },
      { id: 'comment-2', text: 'I loved the examples you provided. The interactive documentary was mind-blowing.', author: users[2], createdAt: '2024-05-11T09:30:00.000Z' },
    ],
  },
  {
    id: 'post-2',
    title: 'Minimalism in Web Design',
    description: 'Why less is more when it comes to user experience.',
    content: `Cluttered interfaces are a thing of the past. Today's users demand clean, intuitive, and fast-loading websites. This is where minimalism comes in. By stripping away unnecessary elements, we can focus the user's attention on what truly matters: the content.
    
This approach isn't just about aesthetics; it's about functionality. A minimalist design often leads to better performance, easier navigation, and a more serene user experience. This article explores the principles of minimalist web design, showcases stunning examples, and provides practical tips for decluttering your own digital space without sacrificing personality or power.`,
    author: users[1],
    createdAt: '2024-05-12T11:20:00.000Z',
    likes: 25,
    comments: [
        { id: 'comment-3', text: 'Great points. I\'m currently redesigning my portfolio and this is super helpful.', author: users[0], createdAt: '2024-05-12T13:05:00.000Z' },
    ],
  },
  {
    id: 'post-3',
    title: 'A Deep Dive into Neural Networks',
    description: 'Unpacking the building blocks of artificial intelligence.',
    content: `Neural networks, inspired by the human brain, are the powerhouse behind many of today's AI breakthroughs. But how do they actually work? This post breaks down the complex topic into digestible parts.
    
We'll start with the basic unit, the neuron, and build up to multi-layered networks (deep learning). We'll cover concepts like activation functions, backpropagation, and gradient descent in an accessible way. Whether you're a budding data scientist or just curious about the technology that powers your favorite apps, this deep dive will provide a solid foundation in the world of neural networks.`,
    author: users[2],
    createdAt: '2024-05-14T08:55:00.000Z',
    likes: 8,
    comments: [],
  },
   {
    id: 'post-4',
    title: 'Sustainable Tech: Building a Greener Future',
    description: 'How the technology sector is tackling environmental challenges.',
    content: `The tech industry has a significant environmental footprint, from manufacturing to data centers. However, it also holds the key to innovative solutions. This post explores the rise of sustainable tech, covering everything from energy-efficient hardware and green cloud computing to using AI for climate modeling and conservation efforts.
    
We'll highlight companies leading the charge and discuss how developers and consumers can make more environmentally conscious choices. The path to a greener future is paved with smart, sustainable technology.`,
    author: users[0],
    createdAt: '2024-05-16T16:21:00.000Z',
    likes: 18,
    comments: [
      { id: 'comment-4', text: 'This is such an important topic. Glad to see it getting more attention.', author: users[2], createdAt: '2024-05-16T18:00:00.000Z' },
    ],
  },
];

export async function getPosts(): Promise<Post[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(posts);
}

export async function getPost(id: string): Promise<Post | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(posts.find((post) => post.id === id));
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  // In a real app, you would fetch this from Firestore based on the userId
  // For this demo, we'll filter the mock data.
  if (!userId) return [];
  const allPosts = await getPosts();
  // For demo, we let user-1 be an admin who can see all posts.
  if (userId === 'user-1') return allPosts;
  return allPosts.filter(p => p.author.id === userId);
}


// This function is intended for client-side use where auth.currentUser is available.
// It is not safe for server-side rendering as it can be null.
export async function getCurrentUser(): Promise<User> {
    const user = auth.currentUser;
    
    if (!user) {
        // This will be the case on the server or if the user is not logged in.
        // Return a default guest user to prevent crashes.
        return {
            id: 'guest',
            name: 'Guest',
            avatarUrl: '',
            role: undefined,
        };
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
            id: user.uid,
            name: userData.name,
            avatarUrl: userData.avatarUrl,
            role: userData.role
        };
    }

    // Fallback for users authenticated but without a DB record (should not happen in normal flow)
    return {
        id: user.uid,
        name: user.email || 'User',
        avatarUrl: 'https://placehold.co/100x100.png',
    };
}
