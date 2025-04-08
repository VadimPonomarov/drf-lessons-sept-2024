import {NextRequest, NextResponse} from 'next/server';

import {fetchRecipeById} from '../../helpers';

interface IProps {
    params: Promise<{
        id: string
    }>
}

export async function GET(req: NextRequest, {params}: IProps) {
    const {id} = await params
    try {
        const recipe = await fetchRecipeById(id);
        return NextResponse.json(recipe, {status: 200});
    } catch (error) {
        return NextResponse.json({message: (error as Error).message}, {status: 500});
    }
}

