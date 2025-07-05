'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRedirectAfterDelete() {
    revalidatePath('/');
    revalidatePath('/artists');
    revalidatePath('/sitemap.ts');
    revalidatePath('/top-charts');
    
    redirect('/');
}

export async function revalidateAfterVisit() {
    revalidatePath('/top-charts');
}
