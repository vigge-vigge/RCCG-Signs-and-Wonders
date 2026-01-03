'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Department = {
  id: string;
  name: string;
  description: string;
  leader: string | null;
  imageUrl: string | null;
};

export default function AdminDepartmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchDepartments();
    }
  }, [status, router]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
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

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '', leader: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      leader: department.leader || '',
      imageUrl: department.imageUrl || '',
    });
    setImageFile(null);
    setImagePreview(department.imageUrl || '');
    setShowModal(true);
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
      setSaving(true);
      
      let imageUrl = formData.imageUrl;
      
      // Upload image if a new file was selected
      if (imageFile) {
        setUploadingImage(true);
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('folder', 'departments');
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          imageUrl = url;
        } else {
          alert('Failed to upload image');
          setUploadingImage(false);
          setSaving(false);
          return;
        }
        setUploadingImage(false);
      }
      
      const url = editingDepartment 
        ? `/api/departments/${editingDepartment.id}`
        : '/api/departments';
      const method = editingDepartment ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl || null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', description: '', leader: '', imageUrl: '' });
        setImageFile(null);
        setImagePreview('');
        fetchDepartments();
      } else {
        alert('Failed to save department');
      }
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Error saving department');
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDepartments();
      } else {
        alert('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Error deleting department');
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
              <h1 className="text-3xl font-serif font-bold text-gray-900">Departments Management</h1>
            </div>
            <button
              onClick={handleCreate}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              + Add New Department
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Departments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">All Departments</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading departments...</p>
            </div>
          ) : departments.length > 0 ? (
            <div className="divide-y">
              {departments.map((department) => (
                <div key={department.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{department.description}</p>
                      {department.leader && (
                        <p className="text-sm text-primary-600 font-medium mt-2">
                          Led by: {department.leader}
                        </p>
                      )}
                      {department.imageUrl && (
                        <p className="text-xs text-gray-500 mt-1">
                          Image: {department.imageUrl}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(department)}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(department.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-600 text-lg mt-4">No departments created yet.</p>
              <p className="text-gray-500 mt-2">Click &quot;Add New Department&quot; to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              {editingDepartment ? 'Edit Department' : 'Add New Department'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Children's Ministry"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the department's mission and activities..."
                  required
                />
              </div>

              <div>
                <label htmlFor="leader" className="block text-sm font-medium text-gray-700 mb-2">
                  Leader (Optional)
                </label>
                <input
                  type="text"
                  id="leader"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Sister Mary Johnson"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Department Image (Optional)
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image from your device
                </p>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-auto rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={saving || uploadingImage}
                >
                  {uploadingImage ? 'Uploading Image...' : saving ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
