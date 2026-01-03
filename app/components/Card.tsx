import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
  href?: string;
  tag?: string;
}

export default function Card({
  title,
  description,
  date,
  imageUrl,
  href,
  tag,
}: CardProps) {
  const content = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {imageUrl && (
        <div className="relative h-48 bg-gray-200">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        {tag && (
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full mb-3 self-start">
            {tag}
          </span>
        )}
        {date && (
          <p className="text-sm text-gray-500 mb-2">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 flex-1 line-clamp-3">{description}</p>
        {href && (
          <div className="mt-4">
            <span className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center">
              Learn more
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
