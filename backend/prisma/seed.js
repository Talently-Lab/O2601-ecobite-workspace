
import prisma from "../src/config/prisma.js";

async function main() {
  console.log("🌱 Cargando datos de prueba de EcoBite...");

  // 1. Buscar restaurante para evitar duplicados
  let restaurant = await prisma.restaurant.findFirst({
    where: {
      name: "Panadería EcoBite",
    },
  });

  // 2. Crear restaurante si no existe
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name: "Panadería EcoBite",
        address: "Av. Cabildo 1500, CABA",
        description: "Panadería con packs de comida para rescatar",
        isActive: true,
      },
    });
  }

  console.log("✅ Restaurante:", restaurant.name);

  // 3. Buscar excedente para evitar duplicados
  const existingSurplus = await prisma.surplus.findFirst({
    where: {
      restaurantId: restaurant.id,
      name: "Pack de medialunas",
    },
  });

  const surplusData = {
    restaurantId: restaurant.id,
    name: "Pack de medialunas",
    imageUrls: [],
    foodType: "Panadería",
    quantityAvailable: 5,
    weightKg: "0.500",
    originalPrice: "5000.00",
    rescuePrice: "2500.00",
    date: new Date(new Date().toISOString().slice(0, 10)),
    pickupFrom: new Date("1970-01-01T17:00:00.000Z"),
    pickupUntil: new Date("1970-01-01T20:00:00.000Z"),
  };

  // 4. Crear o actualizar el excedente de prueba
  const surplus = existingSurplus
    ? await prisma.surplus.update({
        where: { id: existingSurplus.id },
        data: surplusData,
      })
    : await prisma.surplus.create({
        data: surplusData,
      });

  console.log("✅ Excedente:", surplus.name);
  console.log("🎉 Datos de prueba cargados correctamente");
}

main()
  .catch((error) => {
    console.error("❌ Error al cargar datos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
