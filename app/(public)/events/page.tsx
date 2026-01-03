'use client';

import { useState, useEffect } from 'react';
import Hero from '../../components/Hero';
import Card from '../../components/Card';

type Post = {
  id: number | string;
  title: string;
  content: string;
  type: 'testimony' | 'news';
  author?: string;
  imageUrl?: string;
  date: string;
};

export default function Events() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'testimony' | 'news'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?type=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <Hero
        title="Testimonies & News"
        subtitle="Celebrating God's faithfulness in our lives"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 md:mb-0">
              Recent Updates
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('testimony')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'testimony'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Testimonies
              </button>
              <button
                onClick={() => setFilter('news')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'news'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                News
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {post.imageUrl && (
                    <div className="h-48 bg-gray-200 relative">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        post.type === 'testimony' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.type === 'testimony' ? 'Testimony' : 'News'}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                    {post.author && (
                      <p className="text-sm text-gray-500 mb-2">By {post.author}</p>
                    )}
                    <p className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No {filter === 'all' ? 'posts' : filter === 'testimony' ? 'testimonies' : 'news'} yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            Share Your Testimony
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Has God done something amazing in your life? We would love to hear 
            your testimony and share it to encourage others.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Submit Your Testimony
          </a>
        </div>
      </section>
    </div>
  );
}
