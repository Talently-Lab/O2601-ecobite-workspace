-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('RESERVADA', 'RETIRADA', 'NO_RETIRADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENTE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surpluses" (
    "id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "food_type" VARCHAR(30),
    "quantity_available" INTEGER NOT NULL,
    "weight_kg" DECIMAL(10,3) NOT NULL,
    "original_price" DECIMAL(12,2) NOT NULL,
    "rescue_price" DECIMAL(12,2) NOT NULL,
    "date" DATE NOT NULL,
    "pickup_from" TIME(0) NOT NULL,
    "pickup_until" TIME(0) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "surpluses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "surplus_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "unit_weight_kg" DECIMAL(10,3) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "pickup_code" VARCHAR(20) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'RESERVADA',
    "picked_up_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_pickup_code_key" ON "reservations"("pickup_code");

-- AddForeignKey
ALTER TABLE "surpluses" ADD CONSTRAINT "surpluses_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_surplus_id_fkey" FOREIGN KEY ("surplus_id") REFERENCES "surpluses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
