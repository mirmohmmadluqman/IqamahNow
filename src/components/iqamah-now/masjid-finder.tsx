'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { detectNearestMasjid, type DetectNearestMasjidOutput } from '@/ai/flows/detect-nearest-masjid';
import { MapPin, Loader2, LocateFixed } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

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
             <CardContent className="p-4">
                <div className="relative mb-4 h-40 w-full overflow-hidden rounded-md">
                    <Image src="https://placehold.co/600x400.png" layout="fill" objectFit="cover" alt="Map placeholder" data-ai-hint="map city" />
                    <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-destructive" />
                </div>
              <h3 className="font-bold text-lg">{masjid.masjidName}</h3>
              <p className="text-muted-foreground">{masjid.masjidAddress}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
