import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  className 
}: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className={cn("w-full max-w-md space-y-6", className)}>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}