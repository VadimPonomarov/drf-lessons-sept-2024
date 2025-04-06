import React from 'react';
import {IUserResponse} from "@/common/interfaces/users.interfaces.ts";
import {Metadata} from "next";
import UserDetailsComponent from "@/app/users/(details)/UserDetails/UserDetailsComponent.tsx";
import {IRecipe, IRecipesResponse} from "@/common/interfaces/recipe.interfaces.ts";
import {RecipeCard} from "@/app/recipes/(details)/RecipeCard/RecipeCard.tsx";
import {fetchRecipes, fetchUserById} from "@/app/api/helpers.ts";


interface IProps {
    params: Promise<{ id: string }>
}

const UserDetails = async ({params}: IProps) => {
    const {id} = await params
    const user = await fetchUserById(id) as unknown as IUserResponse
    const response = await fetchRecipes({limit:"0"}) as unknown as IRecipesResponse;
    const filtered = response.recipes.filter(item => item.userId === Number(id))
    if (user instanceof Error) return null
    return (
        <div className={"flex flex-row h-screen w-screen"}>
            <div className={"w-[360px] flex justify-center items-center"}>
                <UserDetailsComponent user={user}/>
            </div>
            <div className={"flex flex-wrap gap justify-start align-top gap-2 p-8 overflow-auto"}>
                {filtered.map((recipe: IRecipe) => (
                    <div key={recipe.id}>
                        <RecipeCard item={recipe}/>
                    </div>
                ))}
            </div>

        </div>
    )
};

export async function generateMetadata({params}: IProps,): Promise<Metadata> {
    const id = (await params).id
    return {
        title: `${id} Details`,
        description: "..."
    }
}

export default UserDetails;