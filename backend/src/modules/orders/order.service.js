import prisma from "../../config/prisma.js";
import { randomInt } from "node:crypto";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const generatePickupCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += characters[randomInt(characters.length)];
    }

    return code;
};

export const createOrder = async (userId, {
    surplusId,
    quantity,
}) => {

    for (let attempt = 0; attempt < 5; attempt++) {

        try {
            return await prisma.$transaction(async (tx) => {

                // 1. Buscar el excedente
                const surplus = await tx.surplus.findUnique({
                    where: {
                        id: surplusId,
                    },
                    include: {
                        restaurant: true,
                    },
                });

                if (!surplus) {
                    throw createError("El excedente no existe", 404);
                }

                // 2. Validar restaurante activo
                if (!surplus.restaurant.isActive) {
                    throw createError("El restaurante está inactivo", 400);
                }

                // 3. Validar vencimiento del excedente
                const date = surplus.date
                    .toISOString()
                    .slice(0, 10);

                const pickupUntil = surplus.pickupUntil
                    .toISOString()
                    .slice(11, 19);

                const expiration = new Date(
                    `${date}T${pickupUntil}-03:00`
                );

                if (new Date() >= expiration) {
                    throw createError("El excedente está vencido", 400);
                }

                // 4. Validar stock disponible
                if (surplus.quantityAvailable < quantity) {
                    throw createError("Stock insuficiente", 409);
                }

                // 5. Calcular importe total
                const totalAmount = surplus.rescuePrice.mul(quantity);

                if (totalAmount.gt("9999999999.99")) {
                    throw createError(
                        "El importe total supera el límite permitido",
                        400
                    );
                }

                // 6. Calcular kg de comida reservada
                const kgRescued = surplus.weightKg.mul(quantity);

                // 7. Generar código de retiro
                const pickupCode = generatePickupCode();

                // 8. Descontar stock de forma atómica
                const updated = await tx.surplus.updateMany({
                    where: {
                        id: surplusId,
                        quantityAvailable: {
                            gte: quantity,
                        },
                    },
                    data: {
                        quantityAvailable: {
                            decrement: quantity,
                        },
                    },
                });

                if (updated.count === 0) {
                    throw createError("Stock insuficiente", 409);
                }

                // 9. Crear la reserva
                const reservation = await tx.reservation.create({
                    data: {
                        userId,
                        surplusId,
                        quantity,
                        unitPrice: surplus.rescuePrice,
                        unitWeightKg: surplus.weightKg,
                        totalAmount,
                        pickupCode,
                        status: "RESERVADA",
                    },
                });

                // 10. Obtener stock actualizado
                const updatedSurplus = await tx.surplus.findUnique({
                    where: {
                        id: surplusId,
                    },
                    select: {
                        quantityAvailable: true,
                    },
                });

                // 11. Devolver respuesta
                return {
                    id: reservation.id,
                    userId: reservation.userId,
                    surplusId: reservation.surplusId,
                    surplusName: surplus.name,
                    restaurantId: surplus.restaurantId,
                    restaurantName: surplus.restaurant.name,
                    restaurantAddress: surplus.restaurant.address,
                    quantity: reservation.quantity,
                    unitPrice: Number(reservation.unitPrice),
                    unitWeightKg: Number(reservation.unitWeightKg),
                    totalAmount: Number(reservation.totalAmount),
                    kgRescued: Number(kgRescued),
                    pickupCode: reservation.pickupCode,
                    status: reservation.status,
                    date,
                    pickupFrom: surplus.pickupFrom
                        .toISOString()
                        .slice(11, 16),
                    pickupUntil: pickupUntil.slice(0, 5),
                    quantityAvailable: updatedSurplus.quantityAvailable,
                    pickedUpAt: reservation.pickedUpAt,
                    createdAt: reservation.createdAt,
                };
            });

        } catch (error) {

            // Si el código ya existe, reintentar la transacción
            if (error.code === "P2002") {
                continue;
            }

            throw error;
        }
    }

    throw createError(
        "No se pudo generar un código de retiro único",
        500
    );
};