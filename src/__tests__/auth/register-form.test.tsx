import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '@/components/register-form'
import { renderWithIntl } from '../utils/render-with-intl'

const mocks = vi.hoisted(() => ({
  registerWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
  replace: vi.fn()
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    registerWithEmail: mocks.registerWithEmail,
    signInWithGoogle: mocks.signInWithGoogle
  })
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mocks.replace
  })
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    children: ReactNode
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validación', () => {
    it('exige un nombre de al menos dos caracteres', async () => {
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'A')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      expect(
        await screen.findByText('El nombre debe tener al menos 2 caracteres.')
      ).toBeInTheDocument()
      expect(mocks.registerWithEmail).not.toHaveBeenCalled()
    })

    it('muestra un error para un email inválido', async () => {
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(screen.getByLabelText('Correo Electrónico'), 'no-email')
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      expect(
        await screen.findByText(
          'Por favor, introduce un correo electrónico válido.'
        )
      ).toBeInTheDocument()
      expect(mocks.registerWithEmail).not.toHaveBeenCalled()
    })

    it('exige una contraseña de al menos seis caracteres', async () => {
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), '12345')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      expect(
        await screen.findByText(
          'La contraseña debe tener al menos 6 caracteres.'
        )
      ).toBeInTheDocument()
      expect(mocks.registerWithEmail).not.toHaveBeenCalled()
    })
  })

  describe('envío', () => {
    it('llama a registerWithEmail y navega al inicio', async () => {
      mocks.registerWithEmail.mockResolvedValue(true)
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      await waitFor(() => {
        expect(mocks.registerWithEmail).toHaveBeenCalledWith({
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'secret123'
        })
      })
      expect(mocks.replace).toHaveBeenCalledWith('/')
    })

    it('deshabilita el botón mientras se envía', async () => {
      let resolveRegister: () => void = () => {}
      mocks.registerWithEmail.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveRegister = resolve
        })
      )
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cargando/ })).toBeDisabled()
      })

      resolveRegister()
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Crear Cuenta' })
        ).toBeEnabled()
      })
    })

    it('mantiene el botón disponible si el registro falla', async () => {
      mocks.registerWithEmail.mockRejectedValue(
        new Error('User already registered')
      )
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Crear Cuenta' })
        ).toBeEnabled()
      })
      expect(mocks.replace).not.toHaveBeenCalled()
    })

    it('no navega si Supabase pide confirmar el correo', async () => {
      mocks.registerWithEmail.mockResolvedValue(false)
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.type(screen.getByLabelText('Nombre'), 'Ada Lovelace')
      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }))

      await waitFor(() => {
        expect(mocks.registerWithEmail).toHaveBeenCalled()
      })
      expect(mocks.replace).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Crear Cuenta' })).toBeEnabled()
    })
  })

  describe('Google', () => {
    it('inicia el flujo de Google', async () => {
      const user = userEvent.setup()
      renderWithIntl(<RegisterForm />)

      await user.click(
        screen.getByRole('button', { name: /Registrarse con Google/ })
      )

      expect(mocks.signInWithGoogle).toHaveBeenCalledOnce()
    })
  })

  describe('i18n', () => {
    it('renderiza en inglés', () => {
      renderWithIntl(<RegisterForm />, { locale: 'en' })

      expect(screen.getByText('Create an account')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })
  })
})
