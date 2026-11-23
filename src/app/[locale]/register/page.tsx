import type { JSX } from 'react'
import { AuthLayout } from '@/components/layout/auth-layout'
import { RegisterForm } from '@/components/register-form'

/** Página de registro de nuevos usuarios. */
export default function RegisterPage(): JSX.Element {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
