-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "email_A" TEXT,
    "email_B" TEXT,
    "password_A" TEXT,
    "password_B" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "respuestas" JSONB,
    "hipotesis_A" TEXT,
    "hipotesis_B" TEXT,
    "quien_ha_respondido" TEXT
);
