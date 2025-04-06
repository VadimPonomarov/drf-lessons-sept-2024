import React from 'react';
import RecipeDetailsComponent from "@/app/recipes/(details)/RecipeDetailsComponent/RecipeDetailsComponent.tsx";
import {fetchRecipeById} from "@/app/api/helpers.ts";

interface IProps {
    params: Promise<{ id: string }>
}

const Page = async ({params}: IProps) => {
    const id = (await params).id
    const item = await fetchRecipeById(id)
    return (
        <div>
            <RecipeDetailsComponent item={item}/>
        </div>
    );
};

export default Page;