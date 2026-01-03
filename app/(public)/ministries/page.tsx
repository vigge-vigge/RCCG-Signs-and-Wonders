import Hero from '../../components/Hero';

export default function Ministries() {
  const ministries = [
    {
      id: 1,
      name: 'Children&apos;s Ministry',
      description: 'Nurturing the spiritual growth of our children through age-appropriate teaching and activities.',
      leader: 'Sister Mary Johnson',
    },
    {
      id: 2,
      name: 'Youth Ministry',
      description: 'Empowering young people to live for Christ and make a difference in their generation.',
      leader: 'Brother David Wilson',
    },
    {
      id: 3,
      name: 'Prayer Ministry',
      description: 'Committed to intercession and prayer for our church, community, and nations.',
      leader: 'Pastor Jane Smith',
    },
    {
      id: 4,
      name: 'Choir & Worship',
      description: 'Leading the congregation in praise and worship through music and song.',
      leader: 'Brother Michael Brown',
    },
    {
      id: 5,
      name: 'Evangelism & Outreach',
      description: 'Sharing the gospel and serving our community through practical acts of love.',
      leader: 'Sister Grace Thompson',
    },
    {
      id: 6,
      name: 'Women&apos;s Fellowship',
      description: 'Building strong Christian women through fellowship, teaching, and mutual support.',
      leader: 'Sister Elizabeth Davis',
    },
  ];

  return (
    <div className="pt-20">
      <Hero
        title="Our Ministries"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                  {ministry.name}
                </h3>
                <p className="text-gray-600 mb-4">{ministry.description}</p>
                {ministry.leader && (
                  <p className="text-sm text-primary-600 font-medium">
                    Led by: {ministry.leader}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-50 to-navy-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            Ready to Serve?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Contact us to learn more about how you can get involved in one of 
            our ministries and use your gifts to serve others.
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
