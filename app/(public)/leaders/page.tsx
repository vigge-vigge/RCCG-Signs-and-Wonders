import Image from 'next/image';

export default function LeadersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 pt-20">
      {/* Hero Section */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Leaders</h1>
          <p className="text-xl text-primary-200">
            Meet the spiritual shepherds guiding our congregation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* General Overseer Section */}
        <div className="mb-20">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="relative h-96 md:h-full">
                  <Image
                    src="/images/pastor-adeboye.jpg"
                    alt="Pastor Enoch Adejare Adeboye"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <div className="mb-4">
                  <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
                    General Overseer, RCCG Worldwide
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-6">
                  Pastor Enoch Adejare Adeboye
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    Pastor E. A. Adeboye is the General Overseer of the Redeemed Christian Church of God (RCCG), one of the fastest-growing churches in the world. Under his leadership, RCCG has grown from a few congregations in Nigeria to a global movement with millions of members across over 190 countries.
                  </p>
                  <p>
                    Born in 1942 in Ifewara, Osun State, Nigeria, Pastor Adeboye is a man of prayer and a teacher of God&apos;s Word. He holds a doctorate degree in Applied Mathematics from the University of Lagos and was a university lecturer before answering the call to full-time ministry in 1981.
                  </p>
                  <p>
                    Known affectionately as &quot;Daddy G.O.&quot; (General Overseer), Pastor Adeboye&apos;s ministry is characterized by deep reverence for God, passionate prayer, and a commitment to holiness. His monthly Holy Ghost Services attract hundreds of thousands of worshippers, and his teachings have transformed millions of lives globally.
                  </p>
                  <p>
                    Pastor Adeboye is married to Pastor (Mrs.) Folu Adeboye, and together they have been blessed with children and grandchildren. His vision continues to inspire churches worldwide to reach the lost and make disciples of all nations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parish Pastor Section */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex md:flex-row-reverse">
              <div className="md:w-1/3">
                <div className="relative h-96 md:h-full">
                  <Image
                    src="/images/pastor-akande.jpg"
                    alt="Pastor Abraham Akinyemi Akande"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <div className="mb-4">
                  <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">
                    Pastor in Charge of Zone 3 Europe Mainland Region 3
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-6">
                  Pastor Abraham Akinyemi Akande
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                  <p>
                    Pastor Abraham Akinyemi Akande is a trained engineer from the Federal College of Fisheries and Marine Technology. He had his postgraduate degree at the Federal University of Technology Owerri Nigeria and he is also a member of the Certified Institute of Shipping with close to two decades of experience in the shipping, oil and gas industry.
                  </p>
                  <p>
                    He is a dynamic minister of the gospel with almost 20 years as a pastor in RCCG. A graduate of the School of Disciples and RCCG Bible College, he loves the word of God, preaches and teaches it passionately to the understanding of his congregation.
                  </p>
                  <p>
                    Pastor Akinyemi Akande is the Shepherd leading the people of God in RCCG Signs and Wonders Jönköping to the Kingdom of God. God directed him to lead his people, as a missionary within Nigeria, and then to Sweden; afterwards blessing the works of his hands just as Joshua 1:8 said.
                  </p>
                  <p>
                    He is happily married to Deaconess Rebecca Folasade Akande and blessed with 3 children; Esther, Victor and Emmanuel.
                  </p>
                  <p className="font-semibold text-navy-800">
                    The family of God is working towards showing people THE LIGHT WHICH IS THE WAY (JESUS CHRIST) while growing and drawing people into the Kingdom of Heaven.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
