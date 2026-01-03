'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Photo = {
  id: number;
  url: string;
  caption: string | null;
  createdAt: string;
};

type Album = {
  id: number;
  title: string;
  date: string;
  eventType: 'weekly' | 'special';
  photoCount: number;
  photos?: Photo[];
};

export default function AdminPhotosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [expandedAlbumId, setExpandedAlbumId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDate, setAlbumDate] = useState('');
  const [eventType, setEventType] = useState<'weekly' | 'special'>('weekly');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchAlbums();
    }
  }, [status, router]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/albums?type=all&sort=newest');
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

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: albumTitle, date: albumDate, eventType }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setAlbumTitle('');
        setAlbumDate('');
        setEventType('weekly');
        fetchAlbums(); // Refresh the list
      } else {
        alert('Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Error creating album');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (!confirm('Are you sure you want to delete this album and all its photos?')) {
      return;
    }

    try {
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAlbums(); // Refresh the list
      } else {
        alert('Failed to delete album');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Error deleting album');
    }
  };

  const toggleAlbumPhotos = async (albumId: number) => {
    if (expandedAlbumId === albumId) {
      setExpandedAlbumId(null);
      return;
    }

    // Fetch album details with photos if not already loaded
    const album = albums.find(a => a.id === albumId);
    if (!album?.photos) {
      try {
        const response = await fetch(`/api/albums/${albumId}`);
        if (response.ok) {
          const albumData = await response.json();
          setAlbums(albums.map(a => a.id === albumId ? albumData : a));
        }
      } catch (error) {
        console.error('Error fetching album photos:', error);
      }
    }
    setExpandedAlbumId(albumId);
  };

  const handleDeletePhoto = async (albumId: number, photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the album to show updated photos
        const albumResponse = await fetch(`/api/albums/${albumId}`);
        if (albumResponse.ok) {
          const albumData = await albumResponse.json();
          setAlbums(albums.map(a => a.id === albumId ? albumData : a));
        }
      } else {
        alert('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo');
    }
  };

  const handleAddPhotos = (albumId: number) => {
    setSelectedAlbumId(albumId);
    setShowPhotoModal(true);
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAlbumId) return;

    try {
      setUploadingPhoto(true);
      
      if (uploadMethod === 'file' && photoFiles.length > 0) {
        // Upload files to server
        const formData = new FormData();
        photoFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('albumId', selectedAlbumId.toString());

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          alert('Failed to upload files to server');
          setUploadingPhoto(false);
          return;
        }

        const { files } = await uploadResponse.json();
        
        // Add each uploaded file to the album
        let uploadedCount = 0;
        for (const file of files) {
          const response = await fetch(`/api/albums/${selectedAlbumId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: file.url,
              caption: photoCaption || null,
            }),
          });

          if (response.ok) {
            uploadedCount++;
          }
        }
        
        setPhotoFiles([]);
        setPhotoCaption('');
        setShowPhotoModal(false);
        alert(`Successfully uploaded ${uploadedCount} photo(s)!`);
        await fetchAlbums();
      } else if (uploadMethod === 'url' && photoUrl) {
        // Upload single URL
        const response = await fetch(`/api/albums/${selectedAlbumId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: photoUrl,
            caption: photoCaption || null,
          }),
        });

        if (response.ok) {
          setPhotoUrl('');
          setPhotoCaption('');
          setShowPhotoModal(false);
          alert('Photo added successfully!');
          await fetchAlbums();
        } else {
          alert('Failed to add photo');
        }
      } else {
        alert('Please select photos or provide a URL');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

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
              <h1 className="text-3xl font-serif font-bold text-gray-900">Photo Albums Management</h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              + Create New Album
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Albums List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Existing Albums</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading albums...</p>
            </div>
          ) : albums.length > 0 ? (
            <div className="divide-y">
              {albums.map((album) => (
                <div key={album.id} className="hover:bg-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleAlbumPhotos(album.id)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <svg
                              className={`w-5 h-5 transform transition-transform ${expandedAlbumId === album.id ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{album.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {album.photoCount} photos • {album.eventType === 'special' ? 'Special Event' : 'Weekly Service'} • {new Date(album.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={() => handleAddPhotos(album.id)}
                        >
                          Add Photos
                        </button>
                        <button 
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDeleteAlbum(album.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Photos View */}
                  {expandedAlbumId === album.id && album.photos && (
                    <div className="px-6 pb-6 pt-0">
                      {album.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                          {album.photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={photo.url}
                                  alt={photo.caption || 'Photo'}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {photo.caption && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{photo.caption}</p>
                              )}
                              <button
                                onClick={() => handleDeletePhoto(album.id, photo.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                title="Delete photo"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 mt-2">No photos in this album yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No albums created yet.</p>
              <p className="text-gray-500 mt-2">Click &quot;Create New Album&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Create New Album</h2>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div>
                <label htmlFor="albumTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Album Title
                </label>
                <input
                  type="text"
                  id="albumTitle"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Sunday Service - Nov 24, 2024"
                  required
                />
              </div>

              <div>
                <label htmlFor="albumDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  id="albumDate"
                  value={albumDate}
                  onChange={(e) => setAlbumDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="weekly"
                      checked={eventType === 'weekly'}
                      onChange={(e) => setEventType(e.target.value as 'weekly')}
                      className="mr-2"
                    />
                    <span>Weekly Service</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="special"
                      checked={eventType === 'special'}
                      onChange={(e) => setEventType(e.target.value as 'special')}
                      className="mr-2"
                    />
                    <span>Special Event</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
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
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photos Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Add Photos</h2>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoUrl('');
                  setPhotoCaption('');
                  setPhotoFiles([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadPhoto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Method
                </label>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="file"
                      checked={uploadMethod === 'file'}
                      onChange={(e) => setUploadMethod(e.target.value as 'file')}
                      className="mr-2"
                    />
                    <span>Upload from Device</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="url"
                      checked={uploadMethod === 'url'}
                      onChange={(e) => setUploadMethod(e.target.value as 'url')}
                      className="mr-2"
                    />
                    <span>Use URL</span>
                  </label>
                </div>
              </div>

              {uploadMethod === 'file' ? (
                <div>
                  <label htmlFor="photoFile" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Photos *
                  </label>
                  <input
                    type="file"
                    id="photoFile"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={uploadMethod === 'file'}
                  />
                  {photoFiles.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-green-600">
                        ✓ {photoFiles.length} file(s) selected
                      </p>
                      {photoFiles.map((file, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL *
                  </label>
                  <input
                    type="url"
                    id="photoUrl"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                    required={uploadMethod === 'url'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the URL of an image hosted online
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="photoCaption" className="block text-sm font-medium text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <textarea
                  id="photoCaption"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add a description..."
                />
                {uploadMethod === 'file' && photoFiles.length > 1 && (
                  <p className="text-xs text-gray-500 mt-1">
                    This caption will be applied to all selected photos
                  </p>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoModal(false);
                    setPhotoUrl('');
                    setPhotoCaption('');
                    setPhotoFiles([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={uploadingPhoto}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? 'Uploading...' : `Add Photo${photoFiles.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
