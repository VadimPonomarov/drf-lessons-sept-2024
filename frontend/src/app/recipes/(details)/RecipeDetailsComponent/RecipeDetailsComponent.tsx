import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
import {ResizableWrapper} from "@/components/All/ResizableWrapper/ResizableWrapper.tsx";
import Link from "next/link";
import {IRecipe} from "@/common/interfaces/recipe.interfaces.ts";
import {FC} from "react";

import styles from "./index.module.css";


interface IProps {
    item: IRecipe
}

const RecipeDetailsComponent: FC<IProps> = async (props) => {
    const item = (await props).item
    return (
        <div className={"w-screen h-[85vh] flex justify-center items-center"}>
            {item && (
                <ResizableWrapper>
                    <Card className={"p-5"}>
                        <CardHeader>
                            <CardTitle>
                                {item.id}: {item.name} <br/>
                            </CardTitle>
                            <CardDescription>UserId: {item.userId}</CardDescription>
                            <CardDescription>Tags: {item.tags}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{item.cuisine}</p>
                        </CardContent>
                        <CardFooter>
                            <p className={styles.textSmall}>Views: {item.instructions}</p>
                        </CardFooter>
                        <Link
                            href={`/users/${item.userId}`}
                            className={"text-blue-500 hover:text-blue-700 underline ml-5"}
                        >
                            Author
                        </Link>
                    </Card>
                </ResizableWrapper>
            )}
        </div>
    );
};

export default RecipeDetailsComponent;
