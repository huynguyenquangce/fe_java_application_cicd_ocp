import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Pill, 
  Stethoscope, 
  Building2,
  MapPin,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import NearbyHospitals from '@/components/NearbyHospitals';
import axios from 'axios';
import { AxiosError } from 'axios';

const features = [
  {
    title: 'Kiểm tra triệu chứng',
    description: 'Phân tích các triệu chứng của bạn để giúp bạn hiểu vấn đề sức khỏe tiềm ẩn.',
    icon: <BarChart3 className="h-12 w-12 text-primary" />,
    link: '/symptom-checker',
    color: 'from-blue-500/20 to-cyan-400/20'
  },
  {
    title: 'Tìm bệnh viện',
    description: 'Tìm kiếm bệnh viện gần bạn hoặc theo chuyên khoa cụ thể.',
    icon: <Building2 className="h-12 w-12 text-primary" />,
    link: '/hospitals',
    color: 'from-indigo-500/20 to-purple-400/20'
  },
  {
    title: 'Đặt lịch khám',
    description: 'Đặt lịch hẹn với bác sĩ một cách nhanh chóng và thuận tiện.',
    icon: <Calendar className="h-12 w-12 text-primary" />,
    link: '/appointments/new',
    color: 'from-green-500/20 to-emerald-400/20'
  },
  {
    title: 'Tìm bác sĩ',
    description: 'Tìm kiếm bác sĩ phù hợp với nhu cầu sức khỏe của bạn.',
    icon: <Stethoscope className="h-12 w-12 text-primary" />,
    link: '/doctors',
    color: 'from-orange-500/20 to-amber-400/20'
  }
];

const quickActions = [
  {
    title: 'Kiểm tra triệu chứng',
    icon: <Pill className="h-4 w-4" />,
    link: '/symptom-checker'
  },
  {
    title: 'Đặt lịch khám',
    icon: <Calendar className="h-4 w-4" />,
    link: '/appointments/new'
  },
  {
    title: 'Tìm bác sĩ',
    icon: <Stethoscope className="h-4 w-4" />,
    link: '/doctors'
  },
  {
    title: 'Bệnh viện gần tôi',
    icon: <MapPin className="h-4 w-4" />,
    link: '/hospitals?nearby=true'
  }
];

const LandingPage = () => {
  return (
    <>
      <div className="px-4 py-12 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-fade-up">
              Chăm sóc sức khỏe thông minh
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-1">
              Hệ thống y tế điện tử toàn diện cho phép bạn quản lý sức khỏe một cách dễ dàng và hiệu quả.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up animation-delay-2">
              <Button asChild size="lg">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up animation-delay-3">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="no-underline">
                <Card className="hover:shadow-lg transition-all hover-scale overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} -z-10 opacity-50`}></div>
                  <CardHeader>
                    <div className="rounded-full w-14 h-14 flex items-center justify-center bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex items-center text-sm text-primary">
                      <span>Khám phá</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-6 pt-8 animate-fade-up animation-delay-4">
            <p className="text-center text-muted-foreground">
              Khám phá các tính năng đầy đủ của ứng dụng chăm sóc sức khỏe thông minh
            </p>
            <Button asChild>
              <Link to="/register" className="flex items-center gap-1">
                Bắt đầu ngay <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const processedAppointments = savedAppointments.map((app: any) => ({
      ...app,
      date: new Date(app.date)
    }));
    
    // Add only upcoming appointments
    const upcomingAppointments = processedAppointments
      .filter((app: any) => new Date(app.date) >= new Date())
      .sort((a: any, b: any) => a.date - b.date)
      .slice(0, 3);
    
    if (upcomingAppointments.length === 0) {
      // If no saved appointments, show sample appointments
      setAppointments([
        {
          id: 1,
          specialty: "Tim mạch",
          hospital: "Bệnh viện Chợ Rẫy",
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          status: "confirmed"
        },
        {
          id: 2,
          specialty: "Da liễu",
          hospital: "Bệnh viện Đại học Y Dược TPHCM",
          date: new Date(new Date().setDate(new Date().getDate() + 5)),
          status: "pending"
        }
      ]);
    } else {
      setAppointments(upcomingAppointments);
    }
  }, []);
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <section className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Xin chào, Minh</h1>
            <p className="text-muted-foreground">
              Trang quản lý sức khỏe và lịch hẹn khám bệnh của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="btn-hover">
              <Link to="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Lịch Khám
              </Link>
            </Button>
            <Button asChild className="btn-hover">
              <Link to="/symptom-checker">
                <Search className="mr-2 h-4 w-4" />
                Kiểm Tra Triệu Chứng
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Tình Trạng Sức Khỏe", icon: Activity, value: "Tốt", desc: "Dựa trên kết quả khám gần đây" },
            { 
              title: "Lịch Khám Tiếp Theo", 
              icon: Calendar, 
              value: upcomingAppointments.length > 0 ? new Date(upcomingAppointments[0].date).toLocaleDateString('vi-VN') : "Không có", 
              desc: upcomingAppointments.length > 0 ? 
                `${new Date(upcomingAppointments[0].date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} tại ${upcomingAppointments[0].hospital}` : 
                "Không có lịch khám sắp tới" 
            },
            { title: "Hoạt Động Gần Đây", icon: ClipboardEdit, value: "Xét Nghiệm Máu", desc: "Kết quả được tải lên 3 ngày trước" }
          ].map((item, i) => (
            <Card key={i} className="hover-scale glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-1">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Thao Tác Nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  title: "Tìm Bác Sĩ", 
                  desc: "Tìm theo chuyên khoa, tên, hoặc bệnh lý", 
                  icon: StethoscopeIcon, 
                  link: "/doctors" 
                },
                { 
                  title: "Đặt Lịch Khám", 
                  desc: "Đặt lịch khám với bác sĩ chuyên khoa", 
                  icon: Calendar, 
                  link: "/appointments/new" 
                },
                { 
                  title: "Kiểm Tra Triệu Chứng", 
                  desc: "Phân tích triệu chứng bằng AI", 
                  icon: Search, 
                  link: "/symptom-checker" 
                },
                { 
                  title: "Bệnh Viện Gần Đây", 
                  desc: "Tìm cơ sở y tế gần bạn", 
                  icon: MapPin, 
                  link: "/hospitals" 
                }
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
          
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Lịch Khám Sắp Tới</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link to="/appointments">
                  Xem Tất Cả
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="rounded-full bg-primary/10 p-3 h-12 w-12 flex items-center justify-center">
                          <StethoscopeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.specialty}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.hospital}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {typeof appointment.date === 'string' 
                                  ? appointment.time 
                                  : new Date(appointment.date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {typeof appointment.date === 'string' 
                                  ? appointment.date 
                                  : new Date(appointment.date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{appointment.hospital}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                          {appointment.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
                        </Badge>
                        <Link to={`/appointments?id=${appointment.id}`}>
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Đổi Lịch
                          </Button>
                        </Link>
                      </div>
                    </div>
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
        
        <NearbyHospitals className="mb-6" />
      </div>
    </Layout>
  );
};

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = React.useState<any[]>([]);

  const loadAppointments = async() => {
      try {
        const res = await axios.get(
          `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/appointments/user/${userId}`,
        );
        setAppointments(res.data);
      } catch (error: unknown) {
    };
  }
  
  React.useEffect(() => {
    
    // Add only upcoming appointments
    const upcomingAppointments = appointments
      .filter((app: any) => new Date(app.date) >= new Date())
      .sort((a: any, b: any) => a.date - b.date)
      .slice(0, 3);
    setAppointments(upcomingAppointments);
  }, []);
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có lịch khám sắp tới</p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link to="/appointments/new">Đặt lịch khám</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover-scale">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{appointment.specialty}</h4>
                <p className="text-sm text-muted-foreground">{appointment.hospital}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(appointment.date), 'EEEE, dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(appointment.date), 'HH:mm')}
                  </span>
                </div>
              </div>
              <Badge variant={
                appointment.status === 'confirmed' ? 'default' :
                appointment.status === 'pending' ? 'outline' : 'secondary'
              }>
                {appointment.status === 'confirmed' ? 'Đã xác nhận' :
                 appointment.status === 'pending' ? 'Chờ xác nhận' : 'Đã hoàn thành'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

const format = (date: Date, formatStr: string, options?: any) => {
  const { vi } = require('date-fns/locale');
  const { format } = require('date-fns');
  return format(date, formatStr, { ...(options || {}), locale: vi });
};

const Index = () => {
  const isLoggedIn = localStorage.getItem('user') !== null;
  
  return isLoggedIn ? <Dashboard /> : <LandingPage />;
};

export default Index;
