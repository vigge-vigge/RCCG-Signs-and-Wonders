'use client';

import { useEffect, useState } from 'react';
import Hero from '../../components/Hero';

type Department = {
  id: string;
  name: string;
  description: string;
  leader: string | null;
  imageUrl: string | null;
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
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

  return (
    <div className="pt-20">
      <Hero
        title="Our Departments"
        subtitle="Serving God and building His Kingdom together"
        height="medium"
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Get Involved
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover your gifts and find a place to serve. Every member is 
              valuable in God&apos;s kingdom work.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading departments...</p>
            </div>
          ) : departments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {department.imageUrl && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={department.imageUrl}
                        alt={department.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                      {department.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{department.description}</p>
                    {department.leader && (
                      <p className="text-sm text-primary-600 font-medium">
                        Led by: {department.leader}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No departments available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-50 to-navy-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            Ready to Serve?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Contact us to learn more about how you can get involved in one of 
            our departments and use your gifts to serve others.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
