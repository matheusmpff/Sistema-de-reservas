import { prisma } from "../src/libs/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log('🌱 Iniciando semeio de dados...');

  // CORREÇÃO: Criptografa a senha antes de salvar para bater com a lógica do seu login
  const senhaCriptografada = await bcrypt.hash("admin123", 10);

  // Criando a Pessoa -> Adulto -> User Admin de forma encadeada
  const adminUser = await prisma.pessoa.create({
    data: {
      nome: "Administrador de Teste",
      dataNasc: new Date("1990-01-01"),
      sexo: "M",
      adulto: {
        create: {
          email: "admin@teste.com",
          telefone: "11999999999",
          user: {
            create: {
              senha: senhaCriptografada, // Salvando a senha hashada
              admin: true
            }
          }
        }
      }
    },
    include: {
      adulto: {
        include: {
          user: true
        }
      }
    }
  });

  console.log('✅ Usuário admin criado com sucesso:', adminUser.adulto?.email);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });