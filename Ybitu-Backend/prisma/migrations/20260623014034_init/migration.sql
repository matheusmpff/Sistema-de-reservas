/*
  Warnings:

  - Added the required column `comentario` to the `FeedbackUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeedbackUser" ADD COLUMN     "comentario" TEXT NOT NULL,
ADD COLUMN     "fotos" TEXT[];

-- CreateTable
CREATE TABLE "FeedbackAcompanhante" (
    "reservaUser" INTEGER NOT NULL,
    "reservaData" TIMESTAMP(3) NOT NULL,
    "idPessoa" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fotos" TEXT[],

    CONSTRAINT "FeedbackAcompanhante_pkey" PRIMARY KEY ("reservaUser","reservaData","idPessoa")
);

-- AddForeignKey
ALTER TABLE "FeedbackAcompanhante" ADD CONSTRAINT "FeedbackAcompanhante_reservaUser_reservaData_idPessoa_fkey" FOREIGN KEY ("reservaUser", "reservaData", "idPessoa") REFERENCES "Acompanhante"("reservaUser", "reservaData", "idPessoa") ON DELETE RESTRICT ON UPDATE CASCADE;
