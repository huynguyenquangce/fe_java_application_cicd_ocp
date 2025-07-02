import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/Layout";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success(response.data.message || "Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully");
      navigate("/login");
    }, 1500);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <Card className="glass-card mx-auto max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              {step === 1 ? (
                <User className="h-6 w-6 text-primary" />
              ) : (
                <Lock className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              {step === 1
                ? "Enter your information to get started"
                : "Create a secure password"}
            </CardDescription>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`h-2 w-8 rounded-full ${
                  step >= 1 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
              <div
                className={`h-2 w-8 rounded-full ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">User Name</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
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
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleChange}
                        required
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

                  {/* Password requirements */}
                  {/* <div className="space-y-2 rounded-lg bg-muted p-3">
                    <p className="text-xs font-medium">
                      Password requirements:
                    </p>
                    <ul className="space-y-1">
                      {[
                        {
                          text: "At least 8 characters",
                          check: formData.password.length >= 8,
                        },
                        {
                          text: "At least one uppercase letter",
                          check: /[A-Z]/.test(formData.password),
                        },
                        {
                          text: "At least one number",
                          check: /[0-9]/.test(formData.password),
                        },
                        {
                          text: "At least one special character",
                          check: /[^A-Za-z0-9]/.test(formData.password),
                        },
                      ].map((req, i) => (
                        <li key={i} className="text-xs flex items-center gap-1">
                          <CheckCircle
                            className={`h-3 w-3 ${
                              req.check
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span
                            className={
                              req.check
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div> */}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        privacy policy
                      </Link>
                    </label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full btn-hover"
                disabled={isLoading}
              >
                {step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : isLoading ? (
                  "Creating Account..."
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {step === 1 && (
              <>
                <div className="relative my-2 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline" className="w-full btn-hover">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full btn-hover">
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"></path>
                    </svg>
                    Apple
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <Button
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setStep(1)}
              >
                Back to previous step
              </Button>
            )}

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
