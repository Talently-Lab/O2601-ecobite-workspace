import prisma from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

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

export const createSurplus = async ({
  restaurantId,
  name,
  foodType,
  quantityAvailable,
  weightKg,
  originalPrice,
  discountPercentage,
  date,
  pickupFrom,
  pickupUntil,
  imageUrls = [],
}) => {

  // 1. Verificar que el restaurante exista
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    const error = new Error("El restaurante no existe");
    error.statusCode = 404;
    throw error;
  }

  // 2. Verificar que el restaurante esté activo
  if (!restaurant.isActive) {
    const error = new Error("El restaurante está inactivo");
    error.statusCode = 400;
    throw error;
  }

  // 3. Validar la fecha del excedente
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  if (date < today) {
    const error = new Error(
      "La fecha del excedente no puede ser anterior a la actual"
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Calcular el precio con descuento
  const price = new Prisma.Decimal(originalPrice);

  const rescuePrice = price
    .mul(100 - discountPercentage)
    .div(100)
    .toDecimalPlaces(2);

  // 5. Crear el excedente
  const surplus = await prisma.surplus.create({
    data: {
      restaurantId,
      name,
      foodType,
      quantityAvailable,
      weightKg,
      originalPrice: price,
      rescuePrice,
      date: new Date(`${date}T00:00:00Z`),
      pickupFrom: new Date(`1970-01-01T${pickupFrom}:00Z`),
      pickupUntil: new Date(`1970-01-01T${pickupUntil}:00Z`),
      imageUrls,
    },
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  // 6. Devolver el excedente creado
  return {
    id: surplus.id,
    restaurantId: surplus.restaurantId,
    restaurantName: surplus.restaurant.name,
    name: surplus.name,
    foodType: surplus.foodType,
    quantityAvailable: surplus.quantityAvailable,
    weightKg: Number(surplus.weightKg),
    originalPrice: Number(surplus.originalPrice),
    rescuePrice: Number(surplus.rescuePrice),
    discountPercentage,
    date: surplus.date.toISOString().slice(0, 10),
    pickupFrom: surplus.pickupFrom.toISOString().slice(11, 16),
    pickupUntil: surplus.pickupUntil.toISOString().slice(11, 16),
    imageUrls: surplus.imageUrls,
    createdAt: surplus.createdAt,
  };
};