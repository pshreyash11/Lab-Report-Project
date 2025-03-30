import { AuthLayout } from "@/components/layouts/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your information to get started"
    >
      <SignupForm />
    </AuthLayout>
  )
}