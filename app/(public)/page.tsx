'use client';

import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';

type Post = {
  id: number;
  title: string;
  content: string;
  type: string;
  author?: string;
  imageUrl?: string;
  date: string;
};

export default function Home() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?type=all');
      if (response.ok) {
        const data = await response.json();
        // Get the 3 most recent posts
        setRecentPosts(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostTag = (post: Post) => {
    if (post.type === 'testimony') return 'Testimony';
    return 'News';
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="pt-20">
      <Hero
        title="Welcome to RCCG Signs and Wonders"
        subtitle="The Redeemed Christian Church of God - Jönköping Sweden"
        backgroundImage="/images/congregation.jpg"
      />

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
              A Place to Belong, Believe, and Become
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to The Redeemed Christian Church of God, Signs and Wonders Parish. 
              We are a vibrant community of believers dedicated to worshipping God, 
              growing in faith, and serving our community in Jönköping, Sweden.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you are seeking spiritual growth, community fellowship, or simply 
              want to experience the transforming power of God&apos;s love, you are welcome here. 
              Join us as we worship together, study God&apos;s Word, and witness His signs and wonders.
            </p>
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Join Us for Worship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Wednesday Bible Study</h3>
              <p className="text-gray-600">18:00 - 19:30</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Saturday Prayer Meeting</h3>
              <p className="text-gray-600">12:00 - 13:00</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-primary-600 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Sunday Service</h3>
              <p className="text-gray-600">11:00 - 13:00</p>
              <p className="text-sm text-gray-500 mt-2">Refreshments: 13:00 - 14:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Recent Posts & Testimonies
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading posts...</div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No posts available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card
                  key={post.id}
                  title={post.title}
                  description={truncateContent(post.content)}
                  date={new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  tag={getPostTag(post)}
                  href="/testimonies-news"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Come Experience God&apos;s Presence
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We would love to meet you! Join us this Sunday for worship and fellowship.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Get Directions
          </a>
        </div>
      </section>
    </div>
  );
}
