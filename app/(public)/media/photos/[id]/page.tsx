'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Photo = {
  id: number;
  url: string;
  caption: string | null;
};

type Album = {
  title: string;
  date: string;
  eventType: string;
  photos: Photo[];
};

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.id as string;
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/albums/${albumId}`);
      if (response.ok) {
        const data = await response.json();
        setAlbum(data);
      } else {
        setAlbum(null);
      }
    } catch (error) {
      console.error('Error fetching album:', error);
      setAlbum(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading album...</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Album Not Found</h1>
          <Link href="/media/photos" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to Photo Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 pt-20">
      {/* Header */}
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/media/photos" className="text-primary-300 hover:text-primary-200 mb-4 inline-block">
            ← Back to Gallery
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{album.title}</h1>
          <div className="flex items-center gap-4 text-primary-200">
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(album.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {album.photos.length} photos
            </span>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {album.photos && album.photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {album.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                onClick={() => setSelectedPhoto(index)}
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {photo.caption && (
                  <div className="p-4">
                    <p className="text-gray-700 text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 text-lg mt-4">No photos in this album yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && album.photos && album.photos[selectedPhoto] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          
          {album.photos.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : album.photos.length - 1);
                }}
              >
                ‹
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-4xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(selectedPhoto < album.photos.length - 1 ? selectedPhoto + 1 : 0);
                }}
              >
                ›
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[80vh]">
              <Image
                src={album.photos[selectedPhoto].url}
                alt={album.photos[selectedPhoto].caption || 'Photo'}
                fill
                className="object-contain"
              />
            </div>
            {album.photos[selectedPhoto].caption && (
              <p className="text-white text-center mt-4 text-lg">
                {album.photos[selectedPhoto].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
