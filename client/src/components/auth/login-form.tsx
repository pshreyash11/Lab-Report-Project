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
import { toast } from "sonner";
import UserContext from "@/context/UserContext";
import { AtSignIcon, KeyIcon, LogInIcon } from "lucide-react";
import { motion } from "framer-motion";

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
          description: "Welcome to ReportLab!",
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground/80">
                    <AtSignIcon className="h-4 w-4 text-primary" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="your@email.com"
                        {...field}
                        className="pl-8 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30"
                      />
                      <AtSignIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <div
                        className="absolute bottom-0 left-0 h-[2px] bg-primary/40 rounded-full transition-all"
                        style={{
                          width: field.value
                            ? `${Math.min(100, field.value.length * 5)}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground/80">
                    <KeyIcon className="h-4 w-4 text-primary" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="pl-8 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30"
                      />
                      <KeyIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <div
                        className="absolute bottom-0 left-0 h-[2px] bg-primary/40 rounded-full transition-all"
                        style={{
                          width: field.value
                            ? `${Math.min(100, field.value.length * 8)}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="pt-2"
          >
            <Button
              type="submit"
              className="w-full relative group overflow-hidden"
              disabled={isLoading}
              size="lg"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogInIcon className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </form>
      </Form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mt-6 pt-6 border-t border-border/20"
      >
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-primary hover:text-primary/80 relative group"
            onClick={() => navigate("/auth/signup")}
          >
            Sign up
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </p>
      </motion.div>
    </motion.div>
  );
}
