export interface ICar {
  id: number;
  brand: string;
  price: number;
  year: number;
}

export type ICarCreate = Omit<ICar, "id">;

export type ICarUpdate = Partial<ICarCreate>;

export type ICarsResponse = ICar[];
