
import prisma from "../src/config/prisma.js";
import "dotenv/config";
import bcrypt from "bcryptjs";

// Seed de datos ADMIN para la aplicación EcoBite
async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Faltan credenciales ADMIN en .env");
  }

  if (ADMIN_PASSWORD.length < 10) {
    throw new Error("ADMIN_PASSWORD debe tener al menos 10 caracteres");
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();

  // Verificar si ya existe un administrador
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    if (existingAdmin.email !== email) {
      throw new Error("Ya existe otro administrador");
    }

    console.log("✅ Administrador existente:", existingAdmin.email);
    return;
  }

  // Evitar reutilizar una cuenta cliente
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("El email ya pertenece a otro usuario");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      name: ADMIN_NAME.trim(),
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Administrador creado:", admin.email);
}

// Seed de datos de prueba para la aplicación EcoBite
async function main() {
  console.log("🌱 Cargando datos de prueba de EcoBite...");
  await seedAdmin();

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
