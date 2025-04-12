import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BeakerIcon, FlaskConicalIcon, MicroscopeIcon } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div className="absolute inset-0 flex w-screen min-h-screen bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <div
          className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl animate-pulse"
          style={{ animationDuration: "15s" }}
        ></div>
        <div
          className="absolute top-[50%] -right-[300px] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl animate-pulse"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute -bottom-[300px] left-[40%] w-[600px] h-[600px] rounded-full bg-green-500/5 blur-3xl animate-pulse"
          style={{ animationDuration: "25s" }}
        ></div>

        {/* DNA helix decoration (simplified) */}
        <div className="hidden lg:block absolute top-16 right-16 opacity-10 dark:opacity-5">
          <div className="w-[2px] h-[300px] bg-primary relative">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 w-8 h-[2px] bg-primary"
                style={{
                  top: `${i * 20}px`,
                  transform:
                    i % 2 === 0 ? "translateX(0)" : "translateX(-32px)",
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Molecular decorations - left side */}
        <div className="hidden lg:block absolute bottom-10 left-10 w-32 h-32 opacity-10 dark:opacity-5">
          <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 left-1/2 w-5 h-5 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-5 h-5 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-5 h-5 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-5 h-5 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* Molecular decorations - right side (new) */}
        <div className="hidden lg:block absolute top-1/3 right-[15%] w-28 h-28 opacity-10 dark:opacity-5">
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
        </div>

        {/* Test tube decorations (new) */}
        <div className="hidden xl:block absolute left-[15%] top-20 opacity-10 dark:opacity-5">
          <div className="w-[4px] h-[120px] bg-blue-400 rounded-b-full relative">
            <div className="absolute -top-4 -left-[8px] w-[20px] h-[4px] bg-blue-400 rounded-full"></div>
            <div className="absolute -top-1 left-0 w-[4px] h-[80px] bg-green-400/40 rounded-b-full"></div>
          </div>
        </div>
      </div>

      {/* Theme toggle positioned in corner */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div
          className={cn(
            "w-full max-w-full md:max-w-lg px-6 py-6 z-10",
            className
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2 animate-bounce-slow">
              <FlaskConicalIcon size={28} className="text-primary mr-2" />
              <BeakerIcon size={28} className="text-primary ml-2" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight relative inline-block">
              {title}
              <span
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"
                style={{ animationDuration: "3s" }}
              ></span>
            </h1>

            {subtitle && (
              <p className="text-muted-foreground max-w-xs mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          <div className="relative mt-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-card border border-border/50 rounded-lg shadow-xl backdrop-blur-sm p-6 w-full">
              {children}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-6">
            <div className="flex items-center justify-center">
              <MicroscopeIcon size={14} className="mr-1" />
              <span>ReportLab — Advanced Lab Report Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
