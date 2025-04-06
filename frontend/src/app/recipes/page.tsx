import {FC} from "react";
import {Metadata} from "next";
import {IRecipesResponse} from "@/common/interfaces/recipe.interfaces.ts";
import RecipesClient from "@/app/recipes/RecipesClient.tsx";
import {fetchRecipes} from "@/app/api/helpers.ts";

import styles from "./index.module.css";

const RecipesPage: FC = async () => {
    const response = await fetchRecipes() as unknown as IRecipesResponse;

    return (
        <div className={styles.absoluteContainer}>
            <RecipesClient initialData={response}/>
        </div>
    );
};

export const metadata: Metadata = {
    title: "Recipes",
    description: "...",
};

export default RecipesPage;
