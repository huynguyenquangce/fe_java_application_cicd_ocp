
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { specialists, specialties } from '@/data/vietnameseData';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecialists, setFilteredSpecialists] = useState(specialists || []);

  useEffect(() => {
    const filtered = specialists.filter(specialist => 
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpecialists(filtered);
  }, [searchTerm]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chuyên Khoa</h1>
            <p className="text-muted-foreground">Tìm và đặt lịch với chuyên khoa phù hợp</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, chuyên khoa, bệnh viện..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSpecialists.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Không tìm thấy chuyên khoa nào phù hợp</p>
            </div>
          ) : (
            filteredSpecialists.map((specialist, index) => (
              <Card key={index} className="p-4 hover-scale">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{specialist.name}</h3>
                    <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{specialist.hospital}</p>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-medium">{specialist.rating}</span>
                      <span className="text-xs text-muted-foreground">({specialist.reviews} đánh giá)</span>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="icon">
                    <Link to={`/appointments/new?specialist=${specialist.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Specialties Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Chuyên Khoa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialties.map((specialty, index) => (
              <Link key={index} to={`/appointments/new?specialty=${specialty.id}`}>
                <Card className="p-4 hover-scale">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 h-12 w-12 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{specialty.name}</h3>
                      <p className="text-sm text-muted-foreground">{specialty.description}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;
