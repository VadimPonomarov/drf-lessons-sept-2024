import { NextRequest, NextResponse } from 'next/server';
import {fetchRecipes} from "@/app/api/helpers.ts";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = Object.fromEntries(searchParams.entries());
        const recipes = await fetchRecipes(params);
        return NextResponse.json(recipes, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}

