'use client';

import { useState, useEffect } from 'react';
import Hero from '../../components/Hero';
import Card from '../../components/Card';
import Link from 'next/link';

type Sermon = {
  id: number | string;
  title: string;
  description: string;
  date: string;
  speaker: string;
  scripture: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
};

export default function Sermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sermons');
      if (response.ok) {
        const data = await response.json();
        setSermons(data);
      }
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <Hero
        title="Media & Sermons"
        subtitle="Be encouraged and strengthened through the Word of God"
        backgroundImage="/images/sermon.jpg"
        backgroundPosition="center 30%"
        height="medium"
      />

      {/* Photos Section Link */}
      <section className="py-8 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-2xl font-serif font-bold mb-2">Photo Gallery</h3>
              <p className="text-primary-100">Browse our collection of photos from services and events</p>
            </div>
            <Link
              href="/media/photos"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Photos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Recent Sermons</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading sermons...</p>
            </div>
          ) : sermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon) => (
                <div key={sermon.id}>
                  <Card
                    title={sermon.title}
                    description={sermon.description}
                    date={sermon.date}
                  />
                  <div className="mt-4 text-sm text-gray-600 px-2">
                    <p className="font-medium">Speaker: {sermon.speaker}</p>
                    <p className="italic">Scripture: {sermon.scripture}</p>
                    {(sermon.videoUrl || sermon.audioUrl) && (
                      <div className="mt-2 flex gap-2">
                        {sermon.videoUrl && (
                          <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                            Watch Video
                          </a>
                        )}
                        {sermon.audioUrl && (
                          <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                            Listen Audio
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No sermons available yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for inspiring messages!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Subscribe to Our Channel
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Don&apos;t miss our latest sermons and teachings. Subscribe to our YouTube 
            channel for weekly uploads.
          </p>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Subscribe on YouTube
          </a>
        </div>
      </section>
    </div>
  );
}
