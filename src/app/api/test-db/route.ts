import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Intenta hacer una consulta simple
        const { data, error } = await supabase
            .from('songs')
            .select('id')
            .limit(1);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Conexión exitosa con Supabase' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Error desconocido',
                details: error 
            },
            { status: 500 }
        );
    }
}
