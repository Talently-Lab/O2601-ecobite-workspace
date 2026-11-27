import prisma from "../../config/prisma.js";

export const getRestaurants = async () => {
  return await prisma.restaurant.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
