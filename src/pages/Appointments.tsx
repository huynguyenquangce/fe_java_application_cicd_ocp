
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, HospitalIcon, X } from 'lucide-react';
import { format, addMonths, subMonths, isToday, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { vi } from 'date-fns/locale';
import axios from 'axios';
import { AxiosError } from 'axios';
import { parseISO } from 'date-fns';

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const highlightedAppointmentId = searchParams.get('id');
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<any>(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState('');
  const userId = JSON.parse(localStorage.getItem('userId') || '[]');
  
  useEffect(() => {
    loadAppointments();
  }, []);
  
  const loadAppointments = async() => {
    try {
      const res = await axios.get(
        `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/appointments/user/${userId}`,
      );
      setAppointments(res.data);
    } catch (error: unknown) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          } else {
            toast.error("Lỗi không xác định");
          }
  };
  };
  
  const cancelAppointment = () => {
    if (!appointmentToCancel) return;
    
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Find the appointment to delete
    const updatedAppointments = savedAppointments.filter((app: any) => 
      app.id !== appointmentToCancel.id
    );
    
    // Save back to localStorage
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    // Update the current state
    setAppointments(prev => prev.filter(app => app.id !== appointmentToCancel.id));
    
    toast.success('Đã hủy lịch khám');
    setAppointmentToCancel(null);
  };
  
  const rescheduleAppointment = () => {
    if (!appointmentToReschedule || !rescheduleDate || !rescheduleTime) {
      toast.error('Vui lòng chọn ngày và giờ mới');
      return;
    }
    
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    
    // Parse the new date and time
    const [hours, minutes] = rescheduleTime.split(':').map(Number);
    const newDate = new Date(rescheduleDate);
    newDate.setHours(hours, minutes, 0, 0);
    
    // Update the appointment in localStorage
    const updatedAppointments = savedAppointments.map((app: any) => {
      if (app.id === appointmentToReschedule.id) {
        return {
          ...app,
          date: newDate.toISOString(),
          status: 'pending' // Reset status to pending for rescheduled appointments
        };
      }
      return app;
    });
    
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    // Update the current state
    setAppointments(prev => prev.map(app => {
      if (app.id === appointmentToReschedule.id) {
        return {
          ...app,
          date: newDate,
          status: 'pending'
        };
      }
      return app;
    }));
    
    toast.success('Đã đổi lịch khám thành công');
    setAppointmentToReschedule(null);
    setRescheduleDate(undefined);
    setRescheduleTime('');
  };
  
  const filteredAppointments = Array.isArray(appointments)
  ? appointments?.filter(appointment => {
    const matchesStatus =
      statusFilter === 'all' ||
      appointment.status === statusFilter;

    const matchesDate =
      !selectedDate ||
      isSameDay(parseISO(appointment.appointment_date), selectedDate);

    return matchesStatus && matchesDate;
  }) : [];
  
  const upcomingAppointments = filteredAppointments.filter(app => {
    const fullDateTime = new Date(`${app.appointment_date}T${app.appointment_time}`);
    return fullDateTime >= new Date();
  });
  
  
  const pastAppointments = filteredAppointments.filter(app => {
    const fullDateTime = new Date(`${app.appointment_date}T${app.appointment_time}`);
    return fullDateTime < new Date();
  });
  
  const appointmentDates = Array.isArray(appointments)
  ? appointments.map(app => new Date(app.appointment_date)) : [];
  
  const dayWithAppointment = (date: Date) => {
    return appointmentDates.some(appDate => isSameDay(appDate, date));
  };
  
  const translateStatus = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  
  // Available time slots for rescheduling
  const availableTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lịch Khám</h1>
            <p className="text-muted-foreground">
              Quản lý lịch hẹn khám bệnh của bạn
            </p>
          </div>
          <Button asChild className="btn-hover">
            <Link to="/appointments/new">
              <Clock className="mr-2 h-4 w-4" />
              Đặt Lịch Mới
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card lg:row-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lịch</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium px-2">
                    {format(currentDate, 'MMMM yyyy', { locale: vi })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="p-0 pointer-events-auto"
                locale={vi}
                modifiers={{
                  appointment: (date) => dayWithAppointment(date),
                }}
                modifiersStyles={{
                  appointment: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                  },
                }}
                components={{
                  DayContent: ({ date, activeModifiers }) => (
                    <div className="relative">
                      <div>{date.getDate()}</div>
                      {dayWithAppointment(date) && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ),
                }}
              />

              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Lịch khám hôm nay</div>
                {filteredAppointments.filter(app => isToday(new Date(app.date))).length > 0 ? (
                  filteredAppointments
                    .filter(app => isToday(new Date(app.date)))
                    .map(app => (
                      <div key={app.id} className="p-2 border border-border rounded-md text-sm">
                        <div className="font-medium">{app.specialty}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(app.date, 'HH:mm')}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground">Không có lịch khám nào hôm nay</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                          {selectedDate && (
                            <X className="h-4 w-4 opacity-70" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(undefined);
                            }} />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={vi}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="completed">Đã hoàn thành</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  Sắp tới ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Đã qua ({pastAppointments.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-4 space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      type="upcoming" 
                      translateStatus={translateStatus}
                      highlight={highlightedAppointmentId === appointment.id?.toString()}
                      onReschedule={() => setAppointmentToReschedule(appointment)}
                      onCancel={() => setAppointmentToCancel(appointment)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không có lịch khám sắp tới</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link to="/appointments/new">Đặt Lịch Khám</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-4 space-y-4">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      type="past" 
                      translateStatus={translateStatus}
                      highlight={highlightedAppointmentId === appointment.id?.toString()}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không có lịch khám đã qua</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog open={!!appointmentToCancel} onOpenChange={(open) => !open && setAppointmentToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy lịch khám</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy lịch khám chuyên khoa {appointmentToCancel?.specialty} vào{' '}
              {appointmentToCancel?.date && format(new Date(appointmentToCancel.date), 'dd/MM/yyyy HH:mm')}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentToCancel(null)}>
              Quay lại
            </Button>
            <Button variant="destructive" onClick={cancelAppointment}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={!!appointmentToReschedule} onOpenChange={(open) => !open && setAppointmentToReschedule(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi lịch khám</DialogTitle>
            <DialogDescription>
              Chọn ngày và giờ mới cho lịch khám chuyên khoa {appointmentToReschedule?.specialty}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Chọn ngày mới</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, 'dd/MM/yyyy', { locale: vi }) : "Chọn ngày khám"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    locale={vi}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Chọn giờ mới</p>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giờ khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" disabled>Chọn giờ khám</SelectItem>
                  {availableTimeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentToReschedule(null)}>
              Hủy
            </Button>
            <Button onClick={rescheduleAppointment} disabled={!rescheduleDate || !rescheduleTime}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

interface AppointmentCardProps {
  appointment: {
    appointment_id: number;
    appointment_date: string; 
    appointment_time: string; 
    created_at: string;
    department: {
      department_id: number;
      department_name: string;
    }
    hospital: {
      hospital_id: number;
      hospital_name: string;
    }
    notes: string;
    status: string;
    userId: number;
  };
  type: 'upcoming' | 'past';
  translateStatus: (status: string) => string;
  highlight?: boolean;
  onReschedule?: () => void;
  onCancel?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  type, 
  translateStatus,
  highlight = false,
  onReschedule,
  onCancel
}) => {
  return (
    <Card className={`hover-scale glass-card ${highlight ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-4 flex-1">
            <div className="rounded-full h-12 w-12 overflow-hidden bg-primary/10 flex items-center justify-center">
              <HospitalIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{appointment.department.department_name}</h3>
              <p className="text-sm text-muted-foreground">{appointment.hospital.hospital_name}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    {format(new Date(appointment.appointment_date), 'EEE, dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`), 'HH:mm')} 30 phút
                  </span>
                </div>
              </div>
              
              {appointment.notes && (
                <p className="text-xs bg-muted/50 p-2 rounded-md">{appointment.notes}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 md:items-end justify-center">
            {type === 'past' && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" asChild>
                  <Link to={`/appointments/new?hospital=${appointment.hospital.hospital_id}`}>
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

export default Appointments;
