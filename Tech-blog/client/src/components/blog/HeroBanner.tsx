import heroImage from "@assets/generated_images/ai_cybersecurity_hero_banner.png";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
}

export default function HeroBanner({
  title = "Temp Box Mail Blog",
  subtitle = "Expert insights on AI, cybersecurity, and technology trends",
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden" data-testid="hero-banner">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Technology background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            data-testid="text-hero-title"
          >
            {title}
          </h1>
          <p
            className="text-lg sm:text-xl text-white/90"
            data-testid="text-hero-subtitle"
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
