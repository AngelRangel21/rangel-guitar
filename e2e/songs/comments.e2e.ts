import { expect, test } from '@playwright/test'
import { AUTH_USER, loginAs } from '../fixtures/auth'

const SONG_PATH = '/es/cancion/cancion-e2e'

test.describe('Comentarios de la canción', () => {
  test('sin sesión invita a entrar y no muestra el formulario', async ({
    page
  }) => {
    await page.goto(SONG_PATH)

    const section = page.getByRole('region', { name: 'Comentarios' })
    await expect(section).toBeVisible()
    await expect(
      section.getByText('Inicia sesión para dejar un comentario.')
    ).toBeVisible()
    await expect(
      section.getByRole('link', { name: 'Iniciar sesión' })
    ).toBeVisible()
    await expect(section.getByLabel('Tu comentario')).toHaveCount(0)
  })

  test('publica, edita y elimina un comentario', async ({ page }) => {
    const text = `Muy buena cifra ${Date.now()}`
    const edited = `${text} (editado)`

    await loginAs(page)
    await page.goto(SONG_PATH)

    const section = page.getByRole('region', { name: 'Comentarios' })
    const input = section.getByLabel('Tu comentario')
    const publish = section.getByRole('button', { name: 'Publicar' })

    // El botón se habilita solo con texto.
    await expect(publish).toBeDisabled()
    await input.fill('   ')
    await expect(publish).toBeDisabled()

    // Publicar
    await input.fill(text)
    await publish.click()
    const comment = section.getByRole('article').filter({ hasText: text })
    await expect(comment).toBeVisible()
    await expect(comment.getByText(AUTH_USER.name)).toBeVisible()
    await expect(comment.getByText('Tú')).toBeVisible()
    await expect(input).toHaveValue('')

    // Persiste al recargar
    await page.reload()
    await expect(comment).toBeVisible()

    // Editar
    await comment.getByRole('button', { name: 'Editar' }).click()
    const editInput = comment.getByLabel('Tu comentario')
    await editInput.fill(edited)
    await comment.getByRole('button', { name: 'Guardar' }).click()
    const editedComment = section
      .getByRole('article')
      .filter({ hasText: edited })
    await expect(editedComment).toBeVisible()
    await expect(editedComment.getByText('· editado')).toBeVisible()

    // Eliminar (con confirmación)
    await editedComment.getByRole('button', { name: 'Eliminar' }).click()
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Eliminar' })
      .click()
    await expect(editedComment).toHaveCount(0)

    await page.reload()
    await expect(section.getByText(edited)).toHaveCount(0)
  })
})
