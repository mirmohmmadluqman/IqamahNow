'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { detectNearestMasjid, type DetectNearestMasjidOutput } from '@/ai/flows/detect-nearest-masjid';
import { MapPin, Loader2, LocateFixed, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MasjidFinder() {
  const [masjid, setMasjid] = useState<DetectNearestMasjidOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDetectMasjid = () => {
    setLoading(true);
    setError(null);
    setMasjid(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await detectNearestMasjid({ latitude, longitude });
          setMasjid(result);
        } catch (e) {
          setError('Could not find a nearby masjid. Please try again.');
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Could not find a nearby masjid. Please try again.',
          });
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Unable to retrieve your location. Please enable location services.',
        });
        setLoading(false);
      }
    );
  };
  
  const getGoogleMapsUrl = (lat: number, lng: number) => {
      return `https://www.google.com/maps?q=${lat},${lng}&ll=${lat},${lng}&z=15`;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span>Smart Masjid Detection</span>
        </CardTitle>
        <CardDescription>Find the nearest masjid based on your current location.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button onClick={handleDetectMasjid} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Detecting...' : 'Find Nearest Masjid'}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
        
        {masjid && (
          <Card className="w-full overflow-hidden bg-secondary/30">
             <CardContent className="p-4 space-y-4">
                <div className="relative h-48 w-full overflow-hidden rounded-md border">
                    <iframe
                        className="h-full w-full"
                        src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${masjid.masjidLocation.latitude},${masjid.masjidLocation.longitude}`}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
              <div>
                <h3 className="font-bold text-lg">{masjid.masjidName}</h3>
                <p className="text-muted-foreground text-sm">{masjid.masjidAddress}</p>
              </div>
                <Button asChild className="w-full">
                    <a href={getGoogleMapsUrl(masjid.masjidLocation.latitude, masjid.masjidLocation.longitude)} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                    </a>
                </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
