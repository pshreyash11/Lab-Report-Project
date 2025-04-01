import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import UserContext from "@/context/UserContext";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    fullname: z
      .string()
      .min(2, { message: " Fullname must be at least 2 characters" }),
    gender: z.enum(["Male", "Female", "Other"]),
    dateOfBirth: z.date().refine((date) => date <= new Date(), {
      message: "Date can't be in future.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      fullname: "",
      gender: "Male",
      dateOfBirth: new Date(),
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        {
          username: data.username,
          email: data.email,
          fullname: data.fullname,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth.toISOString(),
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
        // Set user context with the registered user data
        const userData = response.data.data.user;
        userContext?.setUser({
          id: userData._id,
          username: userData.username,
          fullname: userData.fullname,
          email: userData.email,
          dateOfBirth: new Date(userData.dateOfBirth),
        });

        userContext?.setIsLoggedIn(true);

        toast.success("Account created successfully!", {
          description: "Welcome to ReportLab!",
        });

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);

      toast.error("Registration failed", {
        description:
          error.response?.data?.message || "Could not create account",
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="JohnDoe123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </CardContent>
    <CardFooter className="flex justify-center border-t px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => navigate("/auth/login")}
        >
          Sign in
        </Button>
      </p>
    </CardFooter>
  </Card>
);
}
