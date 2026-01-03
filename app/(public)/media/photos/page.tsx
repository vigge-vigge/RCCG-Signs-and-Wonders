'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Album = {
  id: number;
  title: string;
  date: string;
  coverImage: string | null;
  photoCount: number;
  eventType: 'weekly' | 'special';
};

export default function PhotosPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'weekly' | 'special'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchAlbums();
  }, [filterType, sortOrder]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/albums?type=${filterType}&sort=${sortOrder}`);
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 pt-20">
      {/* Header */}
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Photo Gallery</h1>
              <p className="text-xl text-primary-200">
                Capturing moments of faith and fellowship
              </p>
            </div>
            <Link
              href="/media"
              className="mt-4 md:mt-0 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Back to Media
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter by Type */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Filter:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('weekly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'weekly'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Weekly Services
                </button>
                <button
                  onClick={() => setFilterType('special')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === 'special'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Special Events
                </button>
              </div>
            </div>

            {/* Sort by Date */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading albums...</p>
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/media/photos/${album.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-200">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      album.eventType === 'special'
                        ? 'bg-primary-600 text-white'
                        : 'bg-navy-900 text-white'
                    }`}>
                      {album.eventType === 'special' ? 'Special Event' : 'Weekly Service'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(album.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {album.photoCount} photos
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg mt-4">No photo albums yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for photos from our services and events!</p>
          </div>
        )}

        {/* Admin Note */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-2">
            📸 For Administrators
          </h3>
          <p className="text-gray-700">
            To create new photo albums and upload photos, please log in to the{' '}
            <Link href="/admin/login" className="text-primary-700 font-semibold hover:text-primary-800">
              admin dashboard
            </Link>
            . You can organize photos by date, create weekly service albums, or special event collections.
          </p>
        </div>
      </div>
    </div>
  );
}
