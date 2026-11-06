import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginForm } from '@/components/login-form'
import { renderWithIntl } from '../utils/render-with-intl'

const mocks = vi.hoisted(() => ({
  signInWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
  replace: vi.fn()
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signInWithEmail: mocks.signInWithEmail,
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

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validación', () => {
    it('muestra un error para un email inválido', async () => {
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'no-es-email'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

      expect(
        await screen.findByText(
          'Por favor, introduce un correo electrónico válido.'
        )
      ).toBeInTheDocument()
      expect(mocks.signInWithEmail).not.toHaveBeenCalled()
    })

    it('exige la contraseña', async () => {
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

      expect(
        await screen.findByText('La contraseña es obligatoria.')
      ).toBeInTheDocument()
      expect(mocks.signInWithEmail).not.toHaveBeenCalled()
    })
  })

  describe('envío', () => {
    it('llama a signInWithEmail y navega al inicio', async () => {
      mocks.signInWithEmail.mockResolvedValue(undefined)
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

      await waitFor(() => {
        expect(mocks.signInWithEmail).toHaveBeenCalledWith({
          email: 'ada@example.com',
          password: 'secret123'
        })
      })
      expect(mocks.replace).toHaveBeenCalledWith('/')
    })

    it('deshabilita el botón mientras se envía', async () => {
      let resolveSignIn: () => void = () => {}
      mocks.signInWithEmail.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveSignIn = resolve
        })
      )
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cargando/ })).toBeDisabled()
      })

      resolveSignIn()
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Iniciar Sesión' })
        ).toBeEnabled()
      })
    })

    it('mantiene el botón disponible si el login falla', async () => {
      mocks.signInWithEmail.mockRejectedValue(new Error('Invalid credentials'))
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.type(
        screen.getByLabelText('Correo Electrónico'),
        'ada@example.com'
      )
      await user.type(screen.getByLabelText('Contraseña'), 'wrong-password')
      await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Iniciar Sesión' })
        ).toBeEnabled()
      })
      expect(mocks.replace).not.toHaveBeenCalled()
    })
  })

  describe('Google', () => {
    it('inicia el flujo de Google', async () => {
      const user = userEvent.setup()
      renderWithIntl(<LoginForm />)

      await user.click(
        screen.getByRole('button', { name: /Iniciar sesión con Google/ })
      )

      expect(mocks.signInWithGoogle).toHaveBeenCalledOnce()
    })
  })

  describe('i18n', () => {
    it('renderiza en inglés', () => {
      renderWithIntl(<LoginForm />, { locale: 'en' })

      expect(screen.getByText('Login to your account')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
    })
  })
})
