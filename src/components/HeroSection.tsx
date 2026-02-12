interface HeroSectionProps {
  description: string;
}

export function HeroSection({ description }: HeroSectionProps) {
  return (
    <header className="hero">
      <h1>Stadt-Land-Fluss Zettel Generator</h1>
      <p>{description}</p>
    </header>
  );
}
