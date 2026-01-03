interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: 'small' | 'medium' | 'large';
  backgroundPosition?: string;
}

export default function Hero({
  title,
  subtitle,
  backgroundImage,
  height = 'large',
  backgroundPosition = 'center',
}: HeroProps) {
  const heightClasses = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-[600px]',
  };

  return (
    <div
      className={`relative ${heightClasses[height]} flex items-center justify-center`}
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`
          : 'linear-gradient(135deg, #102a43 0%, #243b53 50%, #334e68 100%)',
        backgroundSize: 'cover',
        backgroundPosition: backgroundPosition,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
