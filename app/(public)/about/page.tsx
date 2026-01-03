import Hero from '../../components/Hero';

export default function About() {
  return (
    <div className="pt-20">
      <Hero
        title="About Us"
        subtitle="The Redeemed Christian Church of God - Signs and Wonders"
        backgroundImage="/images/children.jpg"
        height="large"
        backgroundPosition="center 30%"
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Redeemed Christian Church of God (RCCG) Signs and Wonders Parish 
              is a vibrant Christian community located in Jönköping, Sweden. We are 
              part of the global RCCG family, a Pentecostal denomination with millions 
              of members worldwide.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our parish is committed to spreading the gospel of Jesus Christ and 
              demonstrating God&apos;s love through practical ministry to our community. 
              We believe in the power of prayer, the authority of Scripture, and 
              the transforming work of the Holy Spirit.
            </p>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 mt-12">
              Our Mission
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>To make heaven.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>To take as many people with us.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>To have a member of RCCG in every family of all nations.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>To accomplish No. 1 above, holiness will be our lifestyle.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>To accomplish No. 2 and 3 above, we will plant churches within five minutes walking distance in every city and town of developing countries and within five minutes driving distance in every city and town of developed countries.</span>
              </li>
            </ul>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 mt-12">
              Our Beliefs
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in the Holy Trinity - God the Father, God the Son, and God the Holy Spirit</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in the divinity of Jesus Christ, His virgin birth, sinless life, death, and resurrection</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in salvation through faith in Jesus Christ alone</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in the baptism of the Holy Spirit and the manifestation of spiritual gifts</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in the power of prayer and divine healing</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>We believe in living a holy life as commanded in Scripture</span>
              </li>
            </ul>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 mt-12">
              Join Our Family
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Whether you are new to the Christian faith or a long-time believer, 
              you are welcome to join our church family. We offer various programs 
              for spiritual growth, fellowship, and service. Come and experience 
              the love of God with us!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
