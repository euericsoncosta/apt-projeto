/*
  Warnings:

  - You are about to drop the column `criadoEM` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `idade` on the `alunos` table. All the data in the column will be lost.
  - Added the required column `curso` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alunos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_alunos" ("email", "id", "nome") SELECT "email", "id", "nome" FROM "alunos";
DROP TABLE "alunos";
ALTER TABLE "new_alunos" RENAME TO "alunos";
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
