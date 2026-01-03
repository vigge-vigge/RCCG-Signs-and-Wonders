'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Settings = {
  churchName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

export default function Footer() {
  const [settings, setSettings] = useState({
    churchName: 'RCCG Signs & Wonders',
    address: 'Västra storgatan 12',
    city: 'Jönköping, Sweden',
    phone: '+46 72 767 7358, +46 73 978 1777',
    email: 'rccgsignsandwondersjonkoping@yahoo.com',
    facebookUrl: 'https://www.facebook.com/rccgsignsandwonders.jonkoping',
    instagramUrl: 'https://instagram.com/rccgsaw',
    youtubeUrl: 'https://youtube.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Church Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">
              {settings.churchName}
            </h3>
            <p className="text-gray-300 mb-4">
              The Redeemed Christian Church of God
            </p>
            <p className="text-gray-300 text-sm">
              Jönköping, Sweden
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <p>{settings.address}</p>
              <p>{settings.city}</p>
              <p className="mt-4">
                Phone: {settings.phone}
              </p>
              <p className="mt-2">
                <a href={`mailto:${settings.email}`} className="hover:text-primary-400 transition-colors">
                  {settings.email}
                </a>
              </p>
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Service Times</h3>
            <div className="space-y-2 text-gray-300">
              <p>Wednesday Bible Study</p>
              <p className="text-sm">18:00 - 19:30</p>
              <p className="mt-3">Saturday Prayer Meeting</p>
              <p className="text-sm">12:00 - 13:00</p>
              <p className="mt-3">Sunday Service</p>
              <p className="text-sm">11:00 - 13:00</p>
              <p className="text-sm">Refreshments: 13:00 - 14:00</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-navy-700">
          <div className="flex justify-center space-x-6 mb-4">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Facebook
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Instagram
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                YouTube
              </a>
            )}
          </div>
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {settings.churchName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
