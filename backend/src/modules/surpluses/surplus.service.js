import prisma from "../../config/prisma.js";

export const getSurpluses = async () => {
  const surpluses = await prisma.surplus.findMany({
    where: {
      restaurant: {
        isActive: true,
      },
      quantityAvailable: {
        gt: 0,
      },
    },
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return surpluses.map((surplus) => {
    const originalPrice = Number(surplus.originalPrice);
    const rescuePrice = Number(surplus.rescuePrice);

    const discountPercentage =
      originalPrice > 0
        ? Math.round(
            ((originalPrice - rescuePrice) / originalPrice) * 100
          )
        : 0;

    return {
      id: surplus.id,
      name: surplus.name,
      imageUrls: surplus.imageUrls,
      originalPrice,
      rescuePrice,
      discountPercentage,
      quantityAvailable: surplus.quantityAvailable,
      restaurantName: surplus.restaurant.name,
      weightKg: Number(surplus.weightKg),
    };
  });
};
