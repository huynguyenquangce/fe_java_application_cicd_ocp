
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Search, Activity, StethoscopeIcon, ClipboardEdit, Clock, MapPin, HospitalIcon, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/Layout';
import { format, addMonths, subMonths, isToday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';
import { AxiosError } from 'axios';
import { toast } from "sonner";

const Dashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const userId = JSON.parse(localStorage.getItem('userId') || '[]');

  const loadAppointments = async() => {
    try {
      const res = await axios.get(
        `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/appointments/user/${userId}`,
      );
      const upcoming = Array.isArray(res.data)
      ? res.data?.filter(app => 
        new Date(`${app.appointment_date}T${app.appointment_time}`) >= new Date()
      ) : [];
      setUpcomingAppointments(upcoming);
    } catch (error: unknown) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          } else {
            toast.error("Lỗi không xác định");
          }
  };}

  // Load appointments from localStorage
  useEffect(() => {
    loadAppointments();
   upcomingAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, []);

  // Mock data for recommended specialists
  const recommendedSpecialists = [
    {
      id: 1,
      name: "BS.CK2. Phạm Minh Hoa",
      specialty: "Thần kinh",
      rating: 4.9,
      reviews: 124,
      hospital: "Bệnh viện Chợ Rẫy",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "PGS.TS. Lê Văn Tâm",
      specialty: "Chỉnh hình",
      rating: 4.8,
      reviews: 98,
      hospital: "Bệnh viện Đại học Y Dược TPHCM",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "BS.CK1. Trần Thị Mai",
      specialty: "Nhi khoa",
      rating: 4.7,
      reviews: 112,
      hospital: "Bệnh viện Nhi Đồng 1",
      image: "/placeholder.svg"
    }
  ];

  const translateStatus = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Xin chào,</h1>
            <p className="text-muted-foreground">
              Trang quản lý sức khỏe và lịch hẹn khám bệnh của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="btn-hover">
              <Link to="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Lịch khám
              </Link>
            </Button>
            <Button asChild className="btn-hover">
              <Link to="/symptom-checker">
                <Search className="mr-2 h-4 w-4" />
                Kiểm tra triệu chứng
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick Actions & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Thao Tác Nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  title: "Đặt lịch khám", 
                  desc: "Đặt lịch khám với bác sĩ chuyên khoa", 
                  icon: Calendar, 
                  link: "/appointments/new" 
                },
                { 
                  title: "Kiểm tra triệu chứng", 
                  desc: "Phân tích triệu chứng bằng AI", 
                  icon: Search, 
                  link: "/symptom-checker" 
                },
              ].map((action, i) => (
                <Link key={i} to={action.link}>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="rounded-full bg-primary/10 p-2">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          
          {/* Upcoming Appointments */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Lịch khám sắp tới</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link to="/appointments">
                  Xem tất cả
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <Card key={appointment.id} className="hover-scale glass-card">
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
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Chưa có lịch khám sắp tới</p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link to="/appointments/new">Đặt Lịch Khám</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recommended Specialists */}
      </div>
    </Layout>
  );
};

export default Dashboard;
