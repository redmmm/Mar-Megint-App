import FloatingNav from '@/components/FloatingNav';
import PremiumBackground from '@/components/PremiumBackground';
import { WeatherCheck } from '@/components/WeatherCheck';
import { CloudSun } from 'lucide-react';

const WeatherPage = () => {
  return (
    <div className="min-h-screen relative">
      <PremiumBackground />

      <main className="relative z-10 pt-8 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 animate-fade-in text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent text-accent-foreground mb-6">
              <CloudSun className="w-4 h-4" />
              <span>IDŐJÁRÁS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gradient mb-4">
              Időjárás
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Ellenőrizd az időjárást és megtudod, hogy érdemes-e deszkázni ma!
            </p>
          </div>

          {/* Weather Check Component */}
          <WeatherCheck />
        </div>
      </main>

      <FloatingNav />
    </div>
  );
};

export default WeatherPage;
