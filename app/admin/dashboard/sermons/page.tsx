'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export default function AdminSermonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    speaker: '',
    scripture: '',
    videoUrl: '',
    audioUrl: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchSermons();
    }
  }, [status, router]);

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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      
      let thumbnailUrl = formData.thumbnailUrl;
      
      // Upload thumbnail if a new file was selected
      if (thumbnailFile) {
        setUploadingThumbnail(true);
        const imageFormData = new FormData();
        imageFormData.append('file', thumbnailFile);
        imageFormData.append('folder', 'sermons');
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          thumbnailUrl = url;
        } else {
          alert('Failed to upload thumbnail');
          setUploadingThumbnail(false);
          setCreating(false);
          return;
        }
        setUploadingThumbnail(false);
      }
      
      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          videoUrl: formData.videoUrl || null,
          audioUrl: formData.audioUrl || null,
          thumbnailUrl: thumbnailUrl || null,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          date: '',
          speaker: '',
          scripture: '',
          videoUrl: '',
          audioUrl: '',
          thumbnailUrl: '',
        });
        setThumbnailFile(null);
        setThumbnailPreview('');
        fetchSermons();
      } else {
        alert('Failed to create sermon');
      }
    } catch (error) {
      console.error('Error creating sermon:', error);
      alert('Error creating sermon');
    } finally {
      setCreating(false);
      setUploadingThumbnail(false);
    }
  };

  const handleDelete = async (sermonId: number | string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sermons/${sermonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSermons();
      } else {
        alert('Failed to delete sermon');
      }
    } catch (error) {
      console.error('Error deleting sermon:', error);
      alert('Error deleting sermon');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/dashboard" className="text-primary-600 hover:text-primary-700 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Sermon Management</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              + Add New Sermon
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">All Sermons</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading sermons...</p>
            </div>
          ) : sermons.length > 0 ? (
            <div className="divide-y">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{sermon.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sermon.description}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📅 {new Date(sermon.date).toLocaleDateString()}</span>
                        <span>👤 {sermon.speaker}</span>
                        <span>📖 {sermon.scripture}</span>
                      </div>
                      {(sermon.videoUrl || sermon.audioUrl) && (
                        <div className="mt-2 flex gap-3 text-sm">
                          {sermon.videoUrl && <span className="text-green-600">✓ Video</span>}
                          {sermon.audioUrl && <span className="text-blue-600">✓ Audio</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(sermon.id)}
                      className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No sermons created yet.</p>
              <p className="text-gray-500 mt-2">Click &quot;Add New Sermon&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Sermon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add New Sermon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker *
                  </label>
                  <input
                    type="text"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  value={formData.scripture}
                  onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., John 3:16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio URL
                </label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a thumbnail image from your device
                </p>
                {thumbnailPreview && (
                  <div className="mt-3">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-32 w-auto rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={creating || uploadingThumbnail}
                >
                  {uploadingThumbnail ? 'Uploading Image...' : creating ? 'Creating...' : 'Create Sermon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
