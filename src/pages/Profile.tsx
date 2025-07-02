
import React, { useState } from 'react';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Lock, Calendar, FileText, Bell, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from '@/components/Layout';

import axios from 'axios';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
  });
  // Retrieve user ID from localStorage and fetch user data
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Simulate an API call to fetch user data using the user ID
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/users/${userId}`);
          if (response.status === 200) {
            const userData = response.data;
            if (userData.fullname) {
              const nameParts = userData.fullname.split(' ');
              userData.firstName = nameParts.pop() || '';
              userData.lastName = nameParts.join(' ');
            }
            setPersonalInfo((prev) => ({
              ...prev,
              firstName: userData.firstName || prev.firstName,
              lastName: userData.lastName || prev.lastName,
              email: userData.email || prev.email,
              phone: userData.phone || prev.phone,
              dob: userData.dob || prev.dob,
              gender: userData.gender || prev.gender,
              address: userData.address || prev.address,
            }));
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, []);
  
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: 'Penicillin, peanuts',
    medications: 'Lisinopril 10mg daily',
    conditions: 'Hypertension, Seasonal allergies',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
    emergencyRelation: 'Spouse',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    app: true,
    reminders: true,
    marketing: false,
    updates: true,
  });
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMedicalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
  
    if (!userId) {
      toast.error('User ID is missing. Please log in again.');
      setIsLoading(false);
      return;
    }
  
    if (!token) {
      toast.error('Authorization token is missing. Please log in again.');
      setIsLoading(false);
      return;
    }
    console.log("token", token)

  
    const updatedPersonalInfo = {
      ...personalInfo,
      fullname: `${personalInfo.lastName} ${personalInfo.firstName}`,
    };
    delete updatedPersonalInfo.firstName;
    delete updatedPersonalInfo.lastName;
    console.log(updatedPersonalInfo)
    try {
      const response = await axios.put(
        `https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/users/${userId}`,
        updatedPersonalInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          }
        }
      );
      console.log("User updated successfully:", response.data);
  
      if (response.status === 200) {
        toast.success('Personal information updated successfully');
      } else {
        toast.error('Failed to update personal information');
      }
    } catch (error: any) {
      console.error('Error updating personal information:', error);
  
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Unauthorized! Please log in again.');
        } else {
          toast.error(`Error: ${error.response.data.message || 'An error occurred'}`);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password updated successfully');
      setPassword({
        current: '',
        new: '',
        confirm: '',
      });
    }, 1000);
  };
  
  const handleSaveMedicalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Medical information updated successfully');
    }, 1000);
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Notification preferences updated successfully');
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        {/* User Info Card */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h2>
                <p className="text-muted-foreground">{personalInfo.email}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center md:justify-start">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Member since Oct 2023</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>5 appointments</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" className="gap-1 w-full">
                  <User className="h-4 w-4" />
                  Edit Photo
                </Button>
                <Button size="sm" variant="ghost" className="gap-1 text-destructive hover:text-destructive w-full">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Personal Information */}
          <TabsContent value="personal">
            <Card className="glass-card">
              <form onSubmit={handleSavePersonalInfo}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        placeholder="dd/mm/yyyy"
                        value={personalInfo.dob}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={personalInfo.gender}
                        onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        className="pl-10 min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border py-6 px-6">
                  <Button type="submit" className="ml-auto btn-hover" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Security */}
          <TabsContent value="security">
            <Card className="glass-card">
              <form onSubmit={handleSavePassword}>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Update your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="current"
                        name="current"
                        type={showPassword ? "text" : "password"}
                        value={password.current}
                        onChange={handlePasswordChange}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new">New password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new"
                        name="new"
                        type={showPassword ? "text" : "password"}
                        value={password.new}
                        onChange={handlePasswordChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm new password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm"
                        name="confirm"
                        type={showPassword ? "text" : "password"}
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  {/* Password requirements */}
                  <div className="space-y-2 rounded-lg bg-muted p-3">
                    <p className="text-xs font-medium">Password requirements:</p>
                    <ul className="space-y-1">
                      {[
                        { text: "At least 8 characters", check: password.new.length >= 8 },
                        { text: "At least one uppercase letter", check: /[A-Z]/.test(password.new) },
                        { text: "At least one number", check: /[0-9]/.test(password.new) },
                        { text: "At least one special character", check: /[^A-Za-z0-9]/.test(password.new) },
                        { text: "Passwords match", check: password.new === password.confirm && password.new !== '' }
                      ].map((req, i) => (
                        <li key={i} className="text-xs flex items-center gap-1">
                          <CheckCircle className={`h-3 w-3 ${req.check ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={req.check ? 'text-foreground' : 'text-muted-foreground'}>
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="text-lg font-medium">Two-factor authentication</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable 2FA</div>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border py-6 px-6">
                  <Button type="submit" className="ml-auto btn-hover" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Medical Information */}
          <TabsContent value="medical">
            <Card className="glass-card">
              <form onSubmit={handleSaveMedicalInfo}>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>
                    Update your medical information for better care
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      placeholder="List any allergies you have"
                      value={medicalInfo.allergies}
                      onChange={handleMedicalInfoChange}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      name="medications"
                      placeholder="List any medications you're currently taking"
                      value={medicalInfo.medications}
                      onChange={handleMedicalInfoChange}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Textarea
                      id="conditions"
                      name="conditions"
                      placeholder="List any medical conditions you have"
                      value={medicalInfo.conditions}
                      onChange={handleMedicalInfoChange}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-lg font-medium mb-4">Emergency Contact</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Name</Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={medicalInfo.emergencyContact}
                          onChange={handleMedicalInfoChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Phone</Label>
                        <Input
                          id="emergencyPhone"
                          name="emergencyPhone"
                          value={medicalInfo.emergencyPhone}
                          onChange={handleMedicalInfoChange}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="emergencyRelation">Relationship</Label>
                      <Input
                        id="emergencyRelation"
                        name="emergencyRelation"
                        value={medicalInfo.emergencyRelation}
                        onChange={handleMedicalInfoChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border py-6 px-6">
                  <div className="text-sm text-muted-foreground mr-auto max-w-md">
                    Your medical information is encrypted and only shared with healthcare providers when you book an appointment.
                  </div>
                  <Button type="submit" className="btn-hover" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="glass-card">
              <form onSubmit={handleSaveNotifications}>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 'email',
                        title: 'Email Notifications',
                        description: 'Receive appointment confirmations and reminders via email',
                        checked: notifications.email
                      },
                      {
                        id: 'sms',
                        title: 'SMS Notifications',
                        description: 'Receive text message alerts for appointments',
                        checked: notifications.sms
                      },
                      {
                        id: 'app',
                        title: 'App Notifications',
                        description: 'Receive push notifications on your mobile device',
                        checked: notifications.app
                      },
                      {
                        id: 'reminders',
                        title: 'Appointment Reminders',
                        description: 'Get notified 24 hours before your scheduled appointments',
                        checked: notifications.reminders
                      },
                      {
                        id: 'updates',
                        title: 'Health Updates',
                        description: 'Receive updates about your health records and test results',
                        checked: notifications.updates
                      },
                      {
                        id: 'marketing',
                        title: 'Marketing Communications',
                        description: 'Receive promotional offers and healthcare tips',
                        checked: notifications.marketing
                      }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between space-x-2">
                        <div className="flex-1">
                          <Label
                            htmlFor={item.id}
                            className="font-medium flex flex-col gap-1"
                          >
                            {item.title}
                            <span className="font-normal text-sm text-muted-foreground">
                              {item.description}
                            </span>
                          </Label>
                        </div>
                        <Switch
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={(checked) => handleNotificationChange(item.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="text-lg font-medium">Notification Schedule</div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationTime">Preferred notification time</Label>
                      <Select defaultValue="morning">
                        <SelectTrigger id="notificationTime">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                          <SelectItem value="evening">Evening (5:00 PM - 9:00 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        We'll send notifications during your preferred time whenever possible.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border py-6 px-6">
                  <div className="text-sm text-muted-foreground mr-auto max-w-md">
                    You can change your notification preferences at any time.
                  </div>
                  <Button type="submit" className="btn-hover" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
