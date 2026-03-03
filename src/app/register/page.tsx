import { RegisterForm } from '@/components/register-form'
import { JSX } from 'react'

/**
 * Página de registro de nuevos usuarios.
 * Muestra el formulario para que los usuarios puedan crear una nueva cuenta.
 * @returns {JSX.Element} La página de registro.
 */
export default function RegisterPage (): JSX.Element {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='grow flex items-center justify-center container mx-auto px-4 py-8'>
        {/* Componente que contiene la lógica y la interfaz del formulario de registro. */}
        <RegisterForm />
      </main>
    </div>
  )
}
