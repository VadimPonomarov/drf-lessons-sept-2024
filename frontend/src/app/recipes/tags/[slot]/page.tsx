import {Metadata} from "next";
import {IRecipe, IRecipesResponse} from "@/common/interfaces/recipe.interfaces.ts";
import {RecipeCard} from "@/app/recipes/(details)/RecipeCard/RecipeCard.tsx";
import {fetchRecipesByTag} from "@/app/api/helpers.ts";

import styles from "./index.module.css";

interface IProps {
    params: Promise<{ slot: string }>
}

const RecipesPage = async ({params}: IProps) => {
    const name = (await params).slot
    const response = await fetchRecipesByTag(name) as unknown as IRecipesResponse;

    return (
        <div className={styles.absoluteContainer}>
            <div className="w-screen h-[85vh] flex flex-wrap gap-8  justify-center items-center overflow-y-auto">
                {response.recipes.map((recipe: IRecipe) => (
                    <span key={recipe.id}>
                    <RecipeCard item={recipe}/>
                </span>
                ))}
            </div>

        </div>
    );
};

export const metadata: Metadata = {
    title: "Recipes",
    description: "...",
};

export default RecipesPage;