import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import Layout from "@/components/Layout";
import axios, { AxiosError } from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://be-route-huy-nguyenquang116-dev.apps.rm1.0a51.p1.openshiftapps.com/api/auth/login",
        formData
      );

      // Lưu token vào localStorage nếu cần
      console.log(response.data.accessToken);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("userId", response.data.userId);

      // Điều hướng đến dashboard hoặc trang chính
      navigate("/dashboard");
      toast.success("Đăng nhập thành công");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      } else {
        toast.error("Lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <Card className="glass-card mx-auto max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Chào mừng trở lại</CardTitle>
            <CardDescription>
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usernameOrEmail">
                  Tên đăng nhập hoặc Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Tên đăng nhập hoặc email"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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
              <Button
                type="submit"
                className="w-full btn-hover"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
