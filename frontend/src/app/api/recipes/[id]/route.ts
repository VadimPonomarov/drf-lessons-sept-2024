import { NextRequest, NextResponse } from 'next/server';

import { fetchRecipeById } from '@/app/api/recipes/helpers.ts';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const recipe = await fetchRecipeById(params.id);
        return NextResponse.json(recipe, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}

