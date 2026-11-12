import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";

export const registerUser = async ({ name, email, password }) => {

  // Normalizar email
  const normalizedEmail = email.trim().toLowerCase();

  // Verificar si existe
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    const error = new Error("El email ya está registrado");
    error.statusCode = 409;
    throw error;
  }

  // Hashear contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario en PostgreSQL
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "CLIENTE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
