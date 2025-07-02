
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, StethoscopeIcon, HospitalIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vi } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: {
    id: number;
    specialty: string;
    hospital: string;
    date: Date;
    duration: number;
    status: string;
    notes?: string;
  };
  onCancel?: (id: number) => void;
  onReschedule?: (id: number) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onCancel, 
  onReschedule 
}) => {
  const isPast = new Date(appointment.date) < new Date();
  const isCompleted = appointment.status === 'completed';
  
  const statusColors = {
    confirmed: 'default',
    pending: 'outline',
    completed: 'secondary',
    cancelled: 'destructive'
  } as const;

  const statusTranslations = {
    confirmed: 'Đã xác nhận',
    pending: 'Chờ xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy'
  };
  
  return (
    <Card className="hover-scale glass-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-4 flex-1">
            <div className="rounded-full h-12 w-12 overflow-hidden bg-primary/10 flex items-center justify-center">
              <StethoscopeIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{appointment.specialty}</h3>
              <p className="text-sm text-muted-foreground">{appointment.hospital}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(appointment.date, 'EEE, dd/MM/yyyy', { locale: vi })}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{format(appointment.date, 'HH:mm')} ({appointment.duration} phút)</span>
                </div>
              </div>
              
              {appointment.notes && (
                <p className="text-xs bg-muted/50 p-2 rounded-md mt-2">{appointment.notes}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end justify-center">
            <Badge variant={statusColors[appointment.status as keyof typeof statusColors] || 'default'}>
              {statusTranslations[appointment.status as keyof typeof statusTranslations] || appointment.status}
            </Badge>
            
            {!isPast && !isCompleted && (
              <div className="flex gap-2 mt-2">
                {appointment.status !== 'cancelled' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onReschedule?.(appointment.id)}
                  >
                    Đổi lịch
                  </Button>
                )}
                {appointment.status !== 'cancelled' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onCancel?.(appointment.id)}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            )}
            
            {(isPast || isCompleted) && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/appointments/${appointment.id}`}>
                    Xem kết quả
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/appointments/new?hospital=${appointment.hospital}`}>
                    Đặt lại
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
