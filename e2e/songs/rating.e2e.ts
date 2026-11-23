import { expect, test } from '@playwright/test'
import { loginAs } from '../fixtures/auth'

const SONG_PATH = '/es/cancion/cancion-e2e'

test.describe('Valoración de la canción', () => {
  test('sin sesión muestra la media e invita a entrar', async ({ page }) => {
    await page.goto(SONG_PATH)

    const section = page.getByRole('region', { name: 'Valoración' })
    await expect(section).toBeVisible()
    await expect(
      section.getByText('Inicia sesión para valorar esta canción.')
    ).toBeVisible()
    await expect(section.getByRole('radio')).toHaveCount(0)
  })

  test('valora, cambia y quita la valoración', async ({ page }) => {
    await loginAs(page)
    await page.goto(SONG_PATH)

    const section = page.getByRole('region', { name: 'Valoración' })
    const prompt = section.getByText('¿Qué te pareció esta canción?')
    const remove = section.getByRole('button', { name: 'Quitar mi valoración' })

    // El mock guarda estado entre ejecuciones: parte siempre sin valoración.
    await expect(prompt.or(remove)).toBeVisible()
    if (await remove.isVisible()) await remove.click()
    await expect(prompt).toBeVisible()

    // Valorar con 4 estrellas
    // Clic en la estrella visible (el radio está oculto visualmente).
    await section
      .locator('label')
      .filter({ has: page.getByRole('radio', { name: '4 estrellas' }) })
      .click()
    await expect(section.getByText('Tu valoración: 4 estrellas')).toBeVisible()
    await expect(
      section.getByText('1 valoración', { exact: true })
    ).toBeVisible()
    await expect(
      section.getByRole('img', { name: '4,0 de 5 estrellas' })
    ).toBeVisible()

    // Cambiar a 5 con el teclado y comprobar que persiste
    await section
      .getByRole('radio', { name: '4 estrellas' })
      .press('ArrowRight')
    await expect(section.getByText('Tu valoración: 5 estrellas')).toBeVisible()
    await page.reload()
    await expect(section.getByText('Tu valoración: 5 estrellas')).toBeVisible()
    await expect(
      section.getByRole('radio', { name: '5 estrellas' })
    ).toBeChecked()

    // Quitar
    await section.getByRole('button', { name: 'Quitar mi valoración' }).click()
    await expect(
      section.getByText('¿Qué te pareció esta canción?')
    ).toBeVisible()
    await expect(
      section.getByText('Aún nadie la ha valorado. ¡Sé el primero!')
    ).toBeVisible()
  })
})
