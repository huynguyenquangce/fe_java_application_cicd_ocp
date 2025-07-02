
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, X, ArrowRight, Brain, StethoscopeIcon, HospitalIcon, MessageSquare, PlusCircle, Loader2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Layout from '@/components/Layout';
import { commonSymptoms, hospitals, mockAnalysisResults, specialties } from '@/data/vietnameseData';
import axios from 'axios';
import { AxiosError } from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hospitalsOrigin, setHospitalsOrigin] = useState([])
  // type Hospital = {
  //   id: number;
  //   name: string;
  //   address: string;
  // };
  
  // type Result = {
  //   specialty: string[];
  //   urgency: 'thấp' | 'trung bình' | 'cao';
  //   recommendations: string;
  //   hospitals: Hospital[];
  // };
  
  const [result, setResult] = useState<any>(null);  
  
  // Filtered suggestions based on input
  const filteredSuggestions = commonSymptoms.filter(
    symptom => symptom.toLowerCase().includes(inputValue.toLowerCase()) && !symptoms.includes(symptom)
  );

  const handleAddSymptom = (symptom: string) => {
    if (symptom.trim() && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
      setInputValue('');
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddSymptom(inputValue.trim());
    }
  };

  const analyzeSymptom = async () => {
    try {
      const response = await axios.get(`https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/hospitals`);
      const hospitalsOrigin = response.data.data;
  
      const res = await axios.get(
        `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/medical/advice?symptom=${symptoms}`
      );
  
      console.log(res);
  
      const mockResult = {
        specialty: res.data.suggested_departments,
        urgency: "thấp" as const,
        recommendations: res.data.advice,
        hospitals: hospitalsOrigin.filter(hospital =>
          res.data.hospital_ids.includes(hospital.id)
        ),
      };
  
      setResult(mockResult);
    } catch (error) {
      const err = error as AxiosError<any>;
  
      const message =
        err.response?.data?.message ||
        err.message ||
        "Lỗi không xác định";
  
      toast.error(message);
    }
  };

  const handleAnalyze = () => {
    if (symptoms.length === 0) {
      toast.error('Vui lòng thêm ít nhất một triệu chứng');
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate API call delay
    setTimeout(() => {
      
      analyzeSymptom();
      
      setIsAnalyzing(false);
    }, 3000);
  };

  const clearAll = () => {
    setSymptoms([]);
    setDescription('');
    setResult(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Kiểm tra triệu chứng</h1>
          <p className="text-muted-foreground">
            Mô tả triệu chứng của bạn để nhận thông tin sơ bộ và tìm chuyên khoa phù hợp
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Mô tả triệu chứng của bạn</CardTitle>
            <CardDescription>
              Nhập triệu chứng bên dưới để phân tích. Đây không phải là chẩn đoán y tế.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Symptom Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thêm triệu chứng</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập triệu chứng và nhấn Enter"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>

              {/* Suggestions */}
              {inputValue && filteredSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filteredSuggestions.slice(0, 5).map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleAddSymptom(suggestion)}
                    >
                      <PlusCircle className="mr-1 h-3 w-3" />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Selected Symptoms */}
              <div className="flex flex-wrap gap-2 mt-4">
                {symptoms.map((symptom, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {symptom}
                    <button
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveSymptom(symptom)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {symptoms.length === 0 && (
                  <p className="text-sm text-muted-foreground">Chưa thêm triệu chứng nào</p>
                )}
              </div>
            </div>

            {/* Additional Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thông tin thêm (không bắt buộc)</label>
              <Textarea
                placeholder="Cung cấp thêm chi tiết về triệu chứng của bạn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearAll} disabled={isAnalyzing}>
              Xóa tất cả
            </Button>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || symptoms.length === 0} className="ml-2 btn-hover">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Phân tích triệu chứng
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Analysis Results */}
        {result && (
          <Card className="glass-card animate-fade-in">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Kết Quả Phân Tích</CardTitle>
                  <CardDescription>
                    Dựa trên các triệu chứng bạn đã mô tả
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recommended Specialty */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Chuyên Khoa Đề Xuất</h3>
                {result.specialty.map((spec) => (
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-full p-2">
                      <StethoscopeIcon className="h-5 w-5 text-primary" />
                    </div>
                      <p className="font-medium">{spec}</p>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Khuyến Nghị</h3>
                <ul className="space-y-2">
                  {result.recommendations}
                </ul>
              </div>

              {/* Nearby Hospitals */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Bệnh Viện Phù Hợp</h3>
                <div className="space-y-3">
                  {result.hospitals.map((hospital) => (
                    <div 
                      key={hospital.id} 
                      className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <HospitalIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{hospital.name}</h4>
                          </div>
                        </div>
                        <Button asChild size="sm" className="btn-hover">
                          <Link to={`/appointments/new?hospital=${hospital.id}`}>
                            Đặt Lịch
                          </Link>
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{hospital.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full btn-hover">
                <Link to="/appointments/new">
                  Đặt Lịch Khám
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Chat with AI Assistant */}
        {/* <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle>Cần hỗ trợ?</CardTitle>
            <CardDescription>
              Trò chuyện với trợ lý AI về sức khỏe để được hướng dẫn
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full gap-2 btn-hover" variant="outline" asChild>
              <Link to="/chat">
                <MessageSquare className="h-4 w-4" />
                Trò Chuyện Với Trợ Lý Sức Khỏe
              </Link>
            </Button>
          </CardFooter>
        </Card> */}
      </div>
    </Layout>
  );
};

export default SymptomChecker;
