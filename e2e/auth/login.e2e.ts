import { expect, test } from '@playwright/test'
import {
  expectLoggedIn,
  expectLoggedOut,
  fillLoginForm,
  gotoLogin,
  LOGIN_PATH,
  loginAs,
  submitLogin
} from '../fixtures/auth'

test.describe('Login', () => {
  test('renderiza el formulario en español', async ({ page }) => {
    await gotoLogin(page)

    await expect(
      page.getByText('Ingresa tu correo electrónico para iniciar sesión.')
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Iniciar Sesión', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Iniciar sesión con Google/ })
    ).toBeVisible()
  })

  test('renderiza el formulario en inglés', async ({ page }) => {
    await page.goto('/en/login')

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Login', exact: true })
    ).toBeVisible()
  })

  test('valida el email y la contraseña antes de enviar', async ({ page }) => {
    await gotoLogin(page)

    await page.getByLabel('Correo Electrónico').fill('no-es-email')
    await page.getByLabel('Contraseña').fill('secret123')
    await submitLogin(page)

    await expect(
      page.getByText('Por favor, introduce un correo electrónico válido.')
    ).toBeVisible()
    await expect(page).toHaveURL(LOGIN_PATH)
  })

  test('muestra un error con credenciales inválidas', async ({ page }) => {
    await gotoLogin(page)
    await fillLoginForm(page, 'fail@example.test', 'wrong-password')
    await submitLogin(page)

    await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible()
    await expect(page).toHaveURL(LOGIN_PATH)
    await expect(
      page.getByRole('button', { name: 'Iniciar Sesión', exact: true })
    ).toBeEnabled()
  })

  test('inicia sesión, muestra el usuario y cierra sesión', async ({
    page
  }) => {
    await loginAs(page)

    await expect(
      page.getByText('¡Hola, E2E User! Bienvenido de nuevo.')
    ).toBeVisible()
    await expectLoggedIn(page)

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    await expectLoggedOut(page)
  })

  test('redirige a la home si ya hay sesión', async ({ page }) => {
    await loginAs(page)

    await page.goto(LOGIN_PATH)

    await expect(page).toHaveURL((url) => url.pathname === '/es')
  })

  test('inicia el flujo OAuth de Google', async ({ page }) => {
    await gotoLogin(page)

    await page
      .getByRole('button', { name: /Iniciar sesión con Google/ })
      .click()

    await expect(page).toHaveURL(/\/auth\/v1\/authorize\?provider=google/)
    await expect(page.getByText('Google OAuth mock')).toBeVisible()
  })

  test('mantiene la sesión tras recargar', async ({ page }) => {
    await loginAs(page)

    await page.reload()

    await expectLoggedIn(page)
    await expect(page.getByText('Cerrar sesión')).toBeVisible()
  })
})
