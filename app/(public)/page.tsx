"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '../components/Hero';

type Album = {
  id: number;
  title: string;
  date: string;
  coverImage: string | null;
  photoCount: number;
  eventType: string;
};

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/albums?type=all&sort=newest');
      if (res.ok) {
        const data = await res.json();
        setAlbums(data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching albums:', err);
    } finally {
      setLoading(false);
    }
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
              <p className="text-gray-600">18:00 - 19:00</p>
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

      {/* Recent Albums */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-12">
            Recent Photos & Albums
          </h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading albums...</div>
          ) : albums.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No photo albums available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/media/photos/${album.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-56 bg-gray-200">
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-navy-900 mb-1 group-hover:text-primary-600 transition-colors">{album.title}</h3>
                    <div className="text-sm text-gray-600 flex items-center justify-between">
                      <span>{new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{album.photoCount} photos</span>
                    </div>
                  </div>
                </Link>
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
          <div className="mx-auto w-full sm:w-[560px] md:w-[760px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="RCCG Signs & Wonders - Map"
              src="https://www.google.com/maps?q=Vastra%20Storgatan%2012%2C%20553%2015%20Jonkoping&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
