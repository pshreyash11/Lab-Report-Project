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
import { motion } from "framer-motion";
import {
  CalendarIcon,
  UserIcon,
  AtSignIcon,
  KeyIcon,
  UserPlusIcon,
  UserCircleIcon,
  Mars,
  Venus,
} from "lucide-react";
import { format } from "date-fns";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    fullname: z
      .string()
      .min(2, { message: "Fullname must be at least 2 characters" }),
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

const inputFields = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.05 * i,
      ease: "easeOut",
    },
  }),
};

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <motion.div
              custom={1}
              variants={inputFields}
              initial="hidden"
              animate="show"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground/80">
                      <UserIcon className="h-4 w-4 text-primary" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="JohnDoe123"
                          {...field}
                          className="pl-8 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30"
                        />
                        <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <div
                          className="absolute bottom-0 left-0 h-[2px] bg-primary/40 rounded-full transition-all"
                          style={{
                            width: field.value
                              ? `${Math.min(100, field.value.length * 7)}%`
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
              custom={2}
              variants={inputFields}
              initial="hidden"
              animate="show"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground/80">
                      <AtSignIcon className="h-4 w-4 text-primary" />
                      Email
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
              custom={3}
              variants={inputFields}
              initial="hidden"
              animate="show"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground/80">
                      <UserCircleIcon className="h-4 w-4 text-primary" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="pl-8 bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30"
                        />
                        <UserCircleIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                custom={4}
                variants={inputFields}
                initial="hidden"
                animate="show"
              >
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-foreground/80">
                        {field.value === "Male" ? (
                          <Mars className="h-4 w-4 text-blue-500" />
                        ) : field.value === "Female" ? (
                          <Venus className="h-4 w-4 text-pink-500" />
                        ) : (
                          <div className="h-4 w-4 text-purple-500">⚧</div>
                        )}
                        Gender
                      </FormLabel>
                      <div className="relative">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="Male"
                              className="flex items-center"
                            >
                              <div className="flex items-center gap-2">
                                <Mars className="h-4 w-4 text-blue-500" />
                                <span>Male</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Female">
                              <div className="flex items-center gap-2">
                                <Venus className="h-4 w-4 text-pink-500" />
                                <span>Female</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Other">
                              <div className="flex items-center gap-2">
                                <span className="text-purple-500">⚧</span>
                                <span>Other</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/20 rounded-full"></div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                custom={5}
                variants={inputFields}
                initial="hidden"
                animate="show"
              >
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-foreground/80">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Date Of Birth
                      </FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-8 text-left font-normal bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                        <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary/20 rounded-full"></div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div
              custom={6}
              variants={inputFields}
              initial="hidden"
              animate="show"
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
              custom={7}
              variants={inputFields}
              initial="hidden"
              animate="show"
            >
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground/80">
                      <KeyIcon className="h-4 w-4 text-primary" />
                      Confirm Password
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-4 w-4" />
                    Create account
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center mt-6 pt-6 border-t border-border/20"
      >
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-primary hover:text-primary/80 relative group"
            onClick={() => navigate("/auth/login")}
          >
            Sign in
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </Button>
        </p>
      </motion.div>
    </motion.div>
  );
}
