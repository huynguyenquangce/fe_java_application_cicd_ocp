
import React from 'react';
import { Link } from 'react-router-dom';
import { StethoscopeIcon, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  specialty: {
    id: number;
    name: string;
    description: string;
  };
  hospital: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ specialty, hospital }) => {
  return (
    <Card className="hover-scale glass-card overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full h-16 w-16 overflow-hidden bg-primary/10 flex items-center justify-center">
                <StethoscopeIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{specialty.name}</h3>
                <p className="text-sm text-muted-foreground">{specialty.description}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{hospital}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between gap-2">
        <Button size="sm" className="gap-1 btn-hover" asChild>
          <Link to={`/appointments/new?specialty=${specialty.id}&hospital=${hospital}`}>
            <Clock className="h-4 w-4" />
            Đặt Lịch Ngay
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
