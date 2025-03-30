import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import UserContext from "@/context/UserContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        // Update user context with logged in user data
        const userData = response.data.data.user;
        userContext?.setUser({
          id: userData._id,
          username: userData.username,
          fullname: userData.fullname,
          email: userData.email,
          dateOfBirth: new Date(userData.dateOfBirth),
        });

        userContext?.setIsLoggedIn(true);

        // Navigate to dashboard
        navigate("/dashboard");

        toast.success("Login successful", {
          description: "Welcome to ReportLab!"
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/auth/signup")}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
