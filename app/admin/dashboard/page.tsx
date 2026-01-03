'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSermons: 0,
    totalAlbums: 0,
    totalPosts: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const [sermonsRes, albumsRes, postsRes] = await Promise.all([
        fetch('/api/sermons'),
        fetch('/api/albums'),
        fetch('/api/posts?type=all'),
      ]);

      const sermons = sermonsRes.ok ? await sermonsRes.json() : [];
      const albums = albumsRes.ok ? await albumsRes.json() : [];
      const posts = postsRes.ok ? await postsRes.json() : [];

      setStats({
        totalSermons: sermons.length,
        totalAlbums: albums.length,
        totalPosts: posts.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-serif font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session.user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Sermons
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalSermons}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Photo Albums
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalAlbums}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Testimonies & News
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">{stats.totalPosts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Manage Sermons
              </h2>
              <p className="text-gray-600 mb-4">
                Add, edit, or delete sermon recordings and transcripts.
              </p>
              <Link
                href="/admin/dashboard/sermons"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Sermons
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Photo Albums
              </h2>
              <p className="text-gray-600 mb-4">
                Create albums and upload photos from services and events.
              </p>
              <Link
                href="/admin/dashboard/photos"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Photos
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Manage Events
              </h2>
              <p className="text-gray-600 mb-4">
                Create and manage upcoming church events and activities.
              </p>
              <Link
                href="/admin/dashboard/events"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Events
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Testimonies & News
              </h2>
              <p className="text-gray-600 mb-4">
                Create and manage testimonies and church news updates.
              </p>
              <Link
                href="/admin/dashboard/posts"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Posts
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Departments
              </h2>
              <p className="text-gray-600 mb-4">
                Create and manage church departments and ministry groups.
              </p>
              <Link
                href="/admin/dashboard/departments"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Manage Departments
              </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Settings
              </h2>
              <p className="text-gray-600 mb-4">
                Update church information and website settings.
              </p>
              <Link
                href="/admin/dashboard/settings"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Open Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
