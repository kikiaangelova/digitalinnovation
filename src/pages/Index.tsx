import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-lg px-4">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl sim-gradient shadow-lg">
            <Play className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-foreground">DigiInnov Case Lab</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Run a virtual startup over 8 weeks. Make strategic decisions, watch your KPIs evolve, and learn by doing.
        </p>
        <Button asChild size="lg" className="sim-gradient border-0 text-base px-8">
          <Link to="/simulator">
            Enter Simulator
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
