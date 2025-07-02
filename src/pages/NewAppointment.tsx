
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar,  
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  CalendarIcon, 
  CheckCircle,
  ArrowRight,
  Compass,
  Search,
  HospitalIcon,
  StethoscopeIcon
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { specialties, generateAvailableTimeSlots } from '@/data/vietnameseData';
import { vi } from 'date-fns/locale';
import axios, { AxiosError } from 'axios';

// Mock function to save appointment
const saveAppointment = async(appointmentData: any) => {
  const accessToken = JSON.parse(localStorage.getItem('token') || '[]');

  try {
    await axios.post(
      "https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/appointments/create",
      appointmentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}` // nếu có token
        }
      }
    );
  } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        } else {
          toast.error("Lỗi không xác định");
        }
};
}

const NewAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialHospitalId = searchParams.get('hospital');
  const initialSpecialtyId = searchParams.get('specialty');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [busyTimeSlots, setBusyTimeSlots] = useState<string[]>([]);
  
  const [viewNearby, setViewNearby] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [specialtyAvailableDates, setSpecialtyAvailableDates] = useState<any[]>([]);
  
  const [displayedHospitals, setDisplayedHospitals] = useState([]);
  const [hospitalsOrigin, setHospitalsOrigin] = useState([])
  const [specialties, setSpecialities] = useState([])

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(`https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/hospitals`);
        setDisplayedHospitals(response.data.data);
        setHospitalsOrigin(response.data.data);
      } 
      catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);
  
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  // Initialize with first available week
  useEffect(() => {
    const startDate = startOfWeek(new Date());
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    setVisibleDates(weekDates);
    
    // Simulate nearby hospitals
    const sortedByDistance = [...displayedHospitals].sort(() => Math.random() - 0.5).slice(0, 5);
    setNearbyHospitals(sortedByDistance);
  }, []);
  
  // Filter hospitals based on search
  useEffect(() => {
    const filtered = hospitalsOrigin.filter(hospital => 
      hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      hospital.address.toLowerCase().includes(hospitalSearch.toLowerCase())
    ).slice(0, 10);
    
    setDisplayedHospitals(filtered);
    }, [hospitalSearch, hospitalsOrigin]);
  
  // Set initial values if provided in URL
  useEffect(() => {
    if (initialHospitalId) {
      setSelectedHospital(initialHospitalId);
      setCurrentStep(2); // Skip to specialty selection
    }
    
    if (initialSpecialtyId) {
      const selectedSpecialtyData = specialties.find(s => s.id.toString() === initialSpecialtyId);
      if (selectedSpecialtyData) {
        setSelectedSpecialty(selectedSpecialtyData.id);
        // Skip to date selection step if hospital is also selected
        if (selectedHospital) {
          setCurrentStep(3);
        }
      }
    }
  }, [initialHospitalId, initialSpecialtyId, selectedHospital]);
  
  // Update available time slots when specialty and hospital change
  useEffect(() => {
    if (selectedHospital && selectedSpecialty) {
      const hospitalId = parseInt(selectedHospital);
      const specialtyId = specialties.find(s => s.name === selectedSpecialty)?.id || 1;
      
      // Generate available slots for this specialty at this hospital
      const availableDates = generateAvailableTimeSlots(specialtyId, hospitalId);
      setSpecialtyAvailableDates(availableDates);
      
      // Set available slots for the selected date
      updateAvailableSlotsForDate(selectedDate, availableDates);
    }
  }, [selectedHospital, selectedSpecialty, selectedDate]);
  
  const updateAvailableSlotsForDate = (date: Date, availableDates: any[] = specialtyAvailableDates) => {
    if (availableDates.length > 0) {
      const dateData = availableDates.find(d => 
        isSameDay(new Date(d.date), new Date(date))
      );
      
      if (dateData) {
        setAvailableTimeSlots(dateData.slots);
        setBusyTimeSlots(dateData.busySlots || []);
      } else {
        setAvailableTimeSlots([]);
        setBusyTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
      setBusyTimeSlots([]);
    }
    
    // Reset time slot if not available on new date
    setSelectedTimeSlot("");
  };
  
  const handleNextDays = () => {
    const nextStartDate = addDays(visibleDates[0], 7);
    const nextDates = Array.from({ length: 7 }, (_, i) => addDays(nextStartDate, i));
    setVisibleDates(nextDates);
  };
  
  const handlePrevDays = () => {
    const prevStartDate = addDays(visibleDates[0], -7);
    const prevDates = Array.from({ length: 7 }, (_, i) => addDays(prevStartDate, i));
    setVisibleDates(prevDates);
  };
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    updateAvailableSlotsForDate(date);
  };
  
  const handleContinue = () => {
    if (currentStep === 1 && !selectedHospital) {
      toast.error("Vui lòng chọn bệnh viện");
      return;
    }
    
    if (currentStep === 2 && !selectedSpecialty) {
      toast.error("Vui lòng chọn chuyên khoa");
      return;
    }
    
    if (currentStep === 3 && !selectedTimeSlot) {
      toast.error("Vui lòng chọn thời gian khám");
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit appointment
      const selectedHospitalData = displayedHospitals.find(h => h.id.toString() === selectedHospital);
      
      if (selectedHospitalData) {
        // Create appointment date object from selected date and time
        const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
        const appointmentDate = new Date(selectedDate);
        appointmentDate.setHours(hours, minutes, 0, 0);

        const userId = JSON.parse(localStorage.getItem('userId') || '[]');
        
        // Create appointment data
        const appointmentData = {
          user_id: userId,
          department_id: selectedSpecialty,
          hospital_id: selectedHospitalData.id,
          appointment_date: appointmentDate,
          appointment_time: selectedTimeSlot,
          notes: notes,
          status: 'pending',
        };
        
        // Save appointment and get ID
        saveAppointment(appointmentData);
        
        toast.success("Đặt lịch khám thành công!");
        navigate("/appointments");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const findNearbyHospitals = () => {
    setViewNearby(true);
    // In a real app, we would use geolocation to find nearby hospitals
    toast.success("Đã tìm thấy các bệnh viện gần bạn");
  };

  useEffect(() => {
    if (!selectedHospital) return;

    const controller = new AbortController();
    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(
          `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/hospitals/${selectedHospital}/departments`,
          { signal: controller.signal }
        );
        setSpecialities(response.data.departments);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching specialties:', error);
        }
      }
    };

    fetchSpecialities();

    return () => controller.abort();
  }, [selectedHospital]);
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Chọn Bệnh Viện</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewNearby ? "nearby" : "all"} onValueChange={(val) => setViewNearby(val === "nearby")}>
                
                <TabsContent value="all">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm bệnh viện..."
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <RadioGroup value={selectedHospital} onValueChange={setSelectedHospital} className="space-y-4">
                    {displayedHospitals.map(hospital => (
                      <div key={hospital.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={hospital.id.toString()} id={`hospital-${hospital.id}`} />
                        <Label htmlFor={`hospital-${hospital.id}`} className="flex flex-col cursor-pointer">
                          <span className="font-medium">{hospital.name}</span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {hospital.address}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {hospitalSearch && displayedHospitals.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">Không tìm thấy bệnh viện phù hợp</p>
                  )}
                </TabsContent>
                
                {/* <TabsContent value="nearby">
                  <RadioGroup value={selectedHospital} onValueChange={setSelectedHospital} className="space-y-4">
                    {nearbyHospitals.map(hospital => (
                      <div key={hospital.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={hospital.id.toString()} id={`nearby-hospital-${hospital.id}`} />
                        <Label htmlFor={`nearby-hospital-${hospital.id}`} className="flex flex-col cursor-pointer">
                          <span className="font-medium">{hospital.name}</span>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {hospital.address}
                            </span>
                            <Badge variant="outline" className="ml-2">
                              {(Math.random() * 5).toFixed(1)} km
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>
        );
        
      case 2:
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Chọn Chuyên Khoa</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedSpecialty} onValueChange={setSelectedSpecialty} className="space-y-4">
                {specialties.map(specialty => (
                  <div key={specialty.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={specialty.id} id={`specialty-${specialty.id}`} />
                    <Label htmlFor={`specialty-${specialty.id}`} className="flex flex-col cursor-pointer">
                      <span className="font-medium">{specialty.name}</span>
                      <span className="text-sm text-muted-foreground">{specialty.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      
      case 3:
        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Chọn Ngày & Giờ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selector */}
              <div>
                <h3 className="text-sm font-medium mb-3">Các Ngày Có Sẵn</h3>
                <div className="flex items-center justify-between mb-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevDays}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-sm font-medium">
                    {format(visibleDates[0], 'dd/MM')} - {format(visibleDates[6], 'dd/MM/yyyy')}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextDays}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {visibleDates.map((date, index) => {
                    const hasSlots = specialtyAvailableDates.some(d => isSameDay(new Date(d.date), date));
                    
                    return (
                      <Button
                        key={index}
                        variant={isSameDay(date, selectedDate) ? "default" : "outline"}
                        className={`flex flex-col p-2 h-auto min-h-[64px] ${!hasSlots ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => hasSlots && handleSelectDate(date)}
                        disabled={!hasSlots}
                      >
                        <span className="text-xs">{format(date, 'EEE', { locale: vi })}</span>
                        <span className="text-lg font-bold">{format(date, 'd')}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              {/* Time Slots */}
              <div>
                <h3 className="text-sm font-medium mb-3">Thời Gian Khám</h3>
                {availableTimeSlots.length > 0 || busyTimeSlots.length > 0 ? (
                  <div>
                    <div className="flex gap-2 mb-3">
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary"></div>
                        <span>Còn trống</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span>Đã đặt</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {/* Morning slots */}
                      <div className="col-span-full text-xs font-medium text-muted-foreground mt-2 mb-1">Buổi sáng</div>
                      {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'].map((time) => {
                        const isAvailable = availableTimeSlots.includes(time);
                        const isBusy = busyTimeSlots.includes(time);
                        
                        return (
                          <Button
                            key={time}
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            className={`flex items-center justify-center gap-1 ${
                              isBusy ? 'bg-muted text-muted-foreground cursor-not-allowed' : 
                              !isAvailable && !isBusy ? 'invisible' : ''
                            }`}
                            onClick={() => isAvailable && !isBusy && setSelectedTimeSlot(time)}
                            disabled={!isAvailable || isBusy}
                          >
                            <Clock className="h-3 w-3" />
                            {time}
                          </Button>
                        );
                      })}
                      
                      {/* Afternoon slots */}
                      <div className="col-span-full text-xs font-medium text-muted-foreground mt-4 mb-1">Buổi chiều</div>
                      {['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map((time) => {
                        const isAvailable = availableTimeSlots.includes(time);
                        const isBusy = busyTimeSlots.includes(time);
                        
                        return (
                          <Button
                            key={time}
                            variant={selectedTimeSlot === time ? "default" : "outline"}
                            className={`flex items-center justify-center gap-1 ${
                              isBusy ? 'bg-muted text-muted-foreground cursor-not-allowed' : 
                              !isAvailable && !isBusy ? 'invisible' : ''
                            }`}
                            onClick={() => isAvailable && !isBusy && setSelectedTimeSlot(time)}
                            disabled={!isAvailable || isBusy}
                          >
                            <Clock className="h-3 w-3" />
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Không có khung giờ khám cho ngày đã chọn.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      
      case 4: {
        const selectedHospitalData = displayedHospitals.find(h => h.id.toString() === selectedHospital);

        return (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">Xác Nhận Lịch Khám</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full h-12 w-12 overflow-hidden bg-primary/10 flex items-center justify-center">
                    <StethoscopeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedSpecialty}</h3>
                    <p className="text-sm text-muted-foreground">Chuyên khoa</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Ngày & Giờ</div>
                      <div className="text-sm text-muted-foreground">
                        {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })} lúc {selectedTimeSlot}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <HospitalIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Bệnh Viện</div>
                      <div className="text-sm text-muted-foreground">{selectedHospitalData?.name}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Ghi Chú Thêm</Label>
                <Textarea
                  id="notes"
                  placeholder="Các vấn đề cụ thể hoặc thông tin cần biết"
                  className="mt-1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );
      }
        
      
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-6 space-y-6 animate-fade-in">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Button>
        
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6 px-2">
          {['Bệnh viện', 'Chuyên khoa', 'Lịch khám', 'Xác nhận'].map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`rounded-full flex items-center justify-center w-8 h-8 
                  ${currentStep > index + 1 ? 'bg-primary text-primary-foreground' : 
                    currentStep === index + 1 ? 'bg-primary/20 border-2 border-primary text-primary' : 
                    'bg-muted text-muted-foreground'}`}>
                  {currentStep > index + 1 ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </div>
              
              {index < 3 && (
                <div className={`w-full h-px max-w-[40px] ${currentStep > index + 1 ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step Content */}
        {renderStepContent()}
        
        {/* Navigation */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleBack}>
            Quay lại
          </Button>
          <Button onClick={handleContinue}>
            {currentStep === 4 ? 'Xác Nhận Đặt Lịch' : 'Tiếp tục'}
            {currentStep < 4 && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewAppointment;
