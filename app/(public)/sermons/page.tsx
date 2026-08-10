'use client';

import Hero from '../../components/Hero';
import PhotosPage from '../media/photos/page';

export default function Sermons() {
  return (
    <div className="pt-20">
      <Hero
        title="Media & Sermons"
        subtitle="Be encouraged and strengthened through the Word of God"
        backgroundImage="/images/sermon.jpg"
        backgroundPosition="center 30%"
        height="medium"
      />

      {/* Photo gallery as main content */}
      <section className="bg-gradient-to-b from-white to-primary-50">
        <PhotosPage />
      </section>

      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Subscribe to Our Channel</h2>
          <p className="text-xl text-gray-300 mb-8">Don&apos;t miss our latest sermons and teachings. Subscribe to our YouTube channel for weekly uploads.</p>
          <a
            href="https://www.youtube.com/@rccgsignsandwondersjonkopi3277"
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
