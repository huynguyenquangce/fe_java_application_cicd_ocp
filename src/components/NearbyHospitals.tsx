
import React, { useState, useEffect } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { hospitals } from '@/data/vietnameseData';

interface NearbyHospitalsProps {
  onSelectHospital?: (hospitalId: string) => void;
  className?: string;
}

const NearbyHospitals: React.FC<NearbyHospitalsProps> = ({ onSelectHospital, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Array<{
    id: number;
    name: string;
    location: string;
    distance: number;
    lat: number;
    lng: number;
  }>>([]);

  const findNearbyHospitals = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          
          // Calculate distance for each hospital
          const hospitalsWithDistance = hospitals.map(hospital => {
            // Calculate distance using Haversine formula
            const distance = calculateDistance(
              latitude, longitude, 
              hospital.lat, hospital.lng
            );
            
            return {
              ...hospital,
              distance
            };
          });
          
          // Sort by distance and take the 5 closest
          const closest = hospitalsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
          
          setNearbyHospitals(closest);
          setIsLoading(false);
          toast.success("Đã tìm thấy các bệnh viện gần bạn");
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          // Fallback to random hospitals
          const randomHospitals = [...hospitals]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map(h => ({
              ...h,
              distance: Math.random() * 10
            }));
          
          setNearbyHospitals(randomHospitals);
          toast.error("Không thể xác định vị trí của bạn. Hiển thị kết quả ngẫu nhiên.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setIsLoading(false);
      toast.error("Trình duyệt của bạn không hỗ trợ định vị.");
      // Fallback to random hospitals
      const randomHospitals = [...hospitals]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(h => ({
          ...h,
          distance: Math.random() * 10
        }));
      
      setNearbyHospitals(randomHospitals);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  return (
    <Card className={`glass-card animate-fade-in ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Bệnh Viện Gần Bạn</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={findNearbyHospitals} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Compass className="h-4 w-4" />
            <span>{isLoading ? "Đang tìm..." : "Tìm gần đây"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {nearbyHospitals.length > 0 ? (
          <div className="space-y-3">
            {nearbyHospitals.map((hospital) => (
              <div 
                key={hospital.id} 
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onSelectHospital && onSelectHospital(hospital.id.toString())}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{hospital.name}</h4>
                    <p className="text-xs text-muted-foreground">{hospital.location}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {hospital.distance.toFixed(1)} km
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Nhấn vào nút "Tìm gần đây" để tìm các bệnh viện gần bạn
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyHospitals;
