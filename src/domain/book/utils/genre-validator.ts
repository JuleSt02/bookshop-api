import { BookGenre } from "../../../../generated/prisma/enums";

export const genreValidator = (input: string) => {
  //Enum --> object at runtime obtain values
  //small helper function okay but array executes every time with each function call.
  const validGenres: string[] = Object.values(BookGenre);
  const transformedInput = input.toUpperCase().trim();

  return validGenres.includes(transformedInput);
};
