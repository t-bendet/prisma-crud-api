import { Prisma } from "@prisma/client";
import prisma from "../src/client";

const userData: Prisma.UserCreateInput[] = [
  {
    name: "admin",
    email: "admin@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
  {
    name: "admin2",
    email: "admin2@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
  {
    name: "admin3",
    email: "admin3@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
  {
    name: "john doe",
    email: "doe@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
  {
    name: "john doe2",
    email: "doe2@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
  {
    name: "john doe3",
    email: "doe3@example.com",
    password: "11111111",
    passwordConfirm: "11111111",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const user of userData) {
    const createdUser = await prisma.user.create({
      data: user,
    });
    console.log(`Created user with id: ${createdUser.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
