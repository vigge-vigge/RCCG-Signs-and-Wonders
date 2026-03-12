'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function EnquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchEnquiries();
    }
  }, [status, router]);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) setEnquiries(await res.json());
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (enquiry: Enquiry) => {
    if (enquiry.read) return;
    await fetch(`/api/enquiries/${enquiry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, read: true } : e));
    setSelected(prev => prev?.id === enquiry.id ? { ...prev, read: true } : prev);
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    setEnquiries(prev => prev.filter(e => e.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openEnquiry = (enquiry: Enquiry) => {
    setSelected(enquiry);
    markRead(enquiry);
  };

  const unreadCount = enquiries.filter(e => !e.read).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-primary-600 hover:underline text-sm">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-serif font-bold text-gray-900">
                Contact Enquiries
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            No enquiries yet. Messages sent via the contact form will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-2">
              {enquiries.map(enquiry => (
                <button
                  key={enquiry.id}
                  onClick={() => openEnquiry(enquiry)}
                  className={`w-full text-left p-4 rounded-lg shadow border transition-colors ${
                    selected?.id === enquiry.id
                      ? 'border-primary-500 bg-primary-50'
                      : enquiry.read
                      ? 'bg-white border-gray-200 hover:border-gray-300'
                      : 'bg-white border-blue-300 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm truncate ${!enquiry.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {enquiry.name}
                    </span>
                    {!enquiry.read && (
                      <span className="ml-2 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{enquiry.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(enquiry.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selected.subject}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        From: <strong>{selected.name}</strong> &lt;{selected.email}&gt;
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(selected.createdAt).toLocaleString('en-GB')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <a
                        href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                        className="bg-primary-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Reply
                      </a>
                      <button
                        onClick={() => deleteEnquiry(selected.id)}
                        className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <hr className="mb-4" />
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
                  Select an enquiry to read it
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
