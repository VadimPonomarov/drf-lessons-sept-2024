export interface IRecipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface IRecipesResponse extends IRecipeSearch {
  recipes: IRecipe[];
}

export type IRecipeResponse = IRecipe

export interface IRecipeSearch {
  total: string;
  skip: string;
  limit: string;
}


