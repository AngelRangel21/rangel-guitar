'use server';

import { revalidatePath } from 'next/cache';

// `getAdminNotifications` has been removed because it was causing permission errors.
// Notification data is now fetched directly on the client using a real-time listener in Header.tsx.

export async function revalidateAfterRequestDelete(): Promise<{ success: boolean }> {
  try {
    revalidatePath('/admin/requests');
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate path:', error);
    return { success: false };
  }
}
