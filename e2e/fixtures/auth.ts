import { expect, type Page } from '@playwright/test'

export const AUTH_USER = {
  email: 'e2e@example.test',
  password: 'Password123!',
  name: 'E2E User'
}

export const LOGIN_PATH = '/es/entrar'
export const REGISTER_PATH = '/es/registrarse'
export const HOME_PATH = '/es'

export async function gotoLogin(page: Page): Promise<void> {
  await page.goto(LOGIN_PATH)
  await expect(page.getByLabel('Correo Electrónico')).toBeVisible()
}

export async function gotoRegister(page: Page): Promise<void> {
  await page.goto(REGISTER_PATH)
  await expect(page.getByLabel('Nombre')).toBeVisible()
}

export async function fillLoginForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.getByLabel('Correo Electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(password)
}

export async function submitLogin(page: Page): Promise<void> {
  await page
    .getByRole('button', { name: 'Iniciar Sesión', exact: true })
    .click()
}

export async function loginAs(
  page: Page,
  credentials: { email: string; password: string } = AUTH_USER
): Promise<void> {
  await gotoLogin(page)
  await fillLoginForm(page, credentials.email, credentials.password)
  await submitLogin(page)

  // La redirección tras el login puede tardar más en `next dev` mientras se
  // compila la home por primera vez.
  await expect(page).toHaveURL((url) => url.pathname === HOME_PATH, {
    timeout: 15_000
  })
  await expectLoggedIn(page)
}

/** Con sesión, el header muestra el menú de cuenta (avatar). */
export async function expectLoggedIn(page: Page): Promise<void> {
  await expect(
    page.getByRole('button', { name: 'Menú de cuenta', exact: true })
  ).toBeVisible()
}

/** Abre el menú de cuenta del header y cierra la sesión. */
export async function logout(page: Page): Promise<void> {
  await page
    .getByRole('button', { name: 'Menú de cuenta', exact: true })
    .click()
  await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click()
}

export async function expectLoggedOut(page: Page): Promise<void> {
  await expect(
    page.getByRole('link', { name: 'Iniciar sesión', exact: true })
  ).toBeVisible()
}
