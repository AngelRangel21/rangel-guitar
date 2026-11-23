import type { JSX } from 'react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { LoginForm } from '@/components/login-form'

export default function LoginPage(): JSX.Element {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
