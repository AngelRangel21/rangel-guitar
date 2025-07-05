'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRedirect(artist: string) {
    // Revalidate paths to show updated lists
    revalidatePath('/admin/requests');
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath(`/artists/${encodeURIComponent(artist)}`);
    revalidatePath('/sitemap.ts');
    revalidatePath('/top-charts');


    // Redirect to requests page
    redirect('/admin/requests');
}
