
import React from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/Layout';
import NearbyHospitals from '@/components/NearbyHospitals';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import axios from 'axios';
const Hospitals = () => {
  const navigate = useNavigate();
  
  const [hospitals, setHospitals] = useState([])

  const handleSelectHospital = (hospitalId: string) => {
    // Navigate to appointment creation with selected hospital
    navigate(`/appointments/new?hospital=${hospitalId}`);
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/hospitals');
        setHospitals(response.data.data); 
        
        
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, [hospitals]);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bệnh Viện</h1>
          <p className="text-muted-foreground">
            Tìm các bệnh viện phù hợp gần bạn
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bệnh viện..."
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Các Bệnh Viện Hàng Đầu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hospitals.map(hospital => (
                <div 
                  key={hospital.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectHospital(hospital.id.toString())}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{hospital.name}</h4>
                      <p className="text-xs text-muted-foreground">{hospital.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs">{hospital.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {hospital.specialty}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <NearbyHospitals onSelectHospital={handleSelectHospital} />
        </div>
      </div>
    </Layout>
  );
};

export default Hospitals;
