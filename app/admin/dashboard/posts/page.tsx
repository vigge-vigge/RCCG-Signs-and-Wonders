'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = {
  id: number | string;
  title: string;
  content: string;
  type: 'testimony' | 'news';
  author?: string;
  imageUrl?: string;
  date: string;
};

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'testimony' | 'news'>('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'testimony' as 'testimony' | 'news',
    author: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchPosts();
    }
  }, [status, router, filter]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);

      // Upload image if selected
      let uploadedImageUrl = formData.imageUrl;
      if (imageFile) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('folder', 'posts');

        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        uploadedImageUrl = uploadData.url;
        setUploadingImage(false);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          author: formData.author || null,
          imageUrl: uploadedImageUrl || null,
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          content: '',
          type: 'testimony',
          author: '',
          imageUrl: '',
        });
        setImageFile(null);
        setImagePreview(null);
        fetchPosts();
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setCreating(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (postId: number | string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
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
              <h1 className="text-3xl font-serif font-bold text-gray-900">Testimonies & News Management</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              + Add New Post
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
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
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="divide-y">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          post.type === 'testimony' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {post.type === 'testimony' ? 'Testimony' : 'News'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                        {post.author && <span>👤 {post.author}</span>}
                        {post.imageUrl && <span className="text-green-600">✓ Image</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No posts created yet.</p>
              <p className="text-gray-500 mt-2">Click &quot;Add New Post&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="testimony"
                      checked={formData.type === 'testimony'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'testimony' })}
                      className="mr-2"
                    />
                    <span>Testimony</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="news"
                      checked={formData.type === 'news'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'news' })}
                      className="mr-2"
                    />
                    <span>News</span>
                  </label>
                </div>
              </div>

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
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author {formData.type === 'testimony' ? '(Optional)' : ''}
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={formData.type === 'testimony' ? 'e.g., Sister Grace' : 'e.g., Church Admin'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a featured image from your device
                </p>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Image preview"
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
                  disabled={creating || uploadingImage}
                >
                  {uploadingImage ? 'Uploading Image...' : creating ? 'Creating...' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
