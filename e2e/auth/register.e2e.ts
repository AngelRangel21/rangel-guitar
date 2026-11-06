import { expect, test } from '@playwright/test'
import {
  expectLoggedIn,
  expectLoggedOut,
  gotoLogin,
  gotoRegister,
  REGISTER_PATH,
  submitLogin
} from '../fixtures/auth'

const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`

test.describe('Registro', () => {
  test('renderiza el formulario en español', async ({ page }) => {
    await gotoRegister(page)

    await expect(
      page.getByText('Ingresa tus datos para crear tu cuenta.')
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Crear Cuenta', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Registrarse con Google/ })
    ).toBeVisible()
  })

  test('renderiza el formulario en inglés', async ({ page }) => {
    await page.goto('/en/register')

    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Create Account', exact: true })
    ).toBeVisible()
  })

  test('valida nombre, email y contraseña', async ({ page }) => {
    await gotoRegister(page)

    await page.getByLabel('Nombre').fill('A')
    await page.getByLabel('Correo Electrónico').fill('no-email')
    await page.getByLabel('Contraseña').fill('123')
    await page
      .getByRole('button', { name: 'Crear Cuenta', exact: true })
      .click()

    await expect(
      page.getByText('El nombre debe tener al menos 2 caracteres.')
    ).toBeVisible()
    await expect(
      page.getByText('Por favor, introduce un correo electrónico válido.')
    ).toBeVisible()
    await expect(
      page.getByText('La contraseña debe tener al menos 6 caracteres.')
    ).toBeVisible()
    await expect(page).toHaveURL(REGISTER_PATH)
  })

  test('registra un usuario nuevo y lo deja autenticado', async ({ page }) => {
    const email = uniqueEmail('nuevo')
    await gotoRegister(page)

    await page.getByLabel('Nombre').fill('Ada Lovelace')
    await page.getByLabel('Correo Electrónico').fill(email)
    await page.getByLabel('Contraseña').fill('Password123!')
    await page
      .getByRole('button', { name: 'Crear Cuenta', exact: true })
      .click()

    await expect(page).toHaveURL((url) => url.pathname === '/es')
    await expectLoggedIn(page)
  })

  test('muestra un error si el email ya existe', async ({ page }) => {
    await gotoRegister(page)

    await page.getByLabel('Nombre').fill('Ada Lovelace')
    await page.getByLabel('Correo Electrónico').fill('duplicate@example.test')
    await page.getByLabel('Contraseña').fill('Password123!')
    await page
      .getByRole('button', { name: 'Crear Cuenta', exact: true })
      .click()

    await expect(page.getByText('Error al crear la cuenta')).toBeVisible()
    await expect(page).toHaveURL(REGISTER_PATH)
    await expect(
      page.getByRole('button', { name: 'Crear Cuenta', exact: true })
    ).toBeEnabled()
  })

  test('no navega si Supabase pide confirmar el correo', async ({ page }) => {
    await gotoRegister(page)

    await page.getByLabel('Nombre').fill('Ada Lovelace')
    await page.getByLabel('Correo Electrónico').fill('confirm@example.test')
    await page.getByLabel('Contraseña').fill('Password123!')
    await page
      .getByRole('button', { name: 'Crear Cuenta', exact: true })
      .click()

    await expect(
      page.getByText('¡Cuenta creada! Revisa tu correo para confirmar.')
    ).toBeVisible()
    await expect(page).toHaveURL(REGISTER_PATH)
    await expectLoggedOut(page)
  })

  test('el usuario registrado puede iniciar sesión después', async ({
    page
  }) => {
    const email = uniqueEmail('login')
    await gotoRegister(page)

    await page.getByLabel('Nombre').fill('Ada Lovelace')
    await page.getByLabel('Correo Electrónico').fill(email)
    await page.getByLabel('Contraseña').fill('Password123!')
    await page
      .getByRole('button', { name: 'Crear Cuenta', exact: true })
      .click()

    await expect(page).toHaveURL((url) => url.pathname === '/es')
    await expectLoggedIn(page)

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expectLoggedOut(page)

    await gotoLogin(page)
    await page.getByLabel('Correo Electrónico').fill(email)
    await page.getByLabel('Contraseña').fill('Password123!')
    await submitLogin(page)

    await expect(page).toHaveURL((url) => url.pathname === '/es')
    await expectLoggedIn(page)
  })

  test('inicia el flujo OAuth de Google', async ({ page }) => {
    await gotoRegister(page)

    await page.getByRole('button', { name: /Registrarse con Google/ }).click()

    await expect(page).toHaveURL(/\/auth\/v1\/authorize\?provider=google/)
    await expect(page.getByText('Google OAuth mock')).toBeVisible()
  })
})
