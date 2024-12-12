import { hash } from 'bcrypt';

import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ... 🌱`);

  try {
    await prisma.role.create({
      data: {
        roleName: 'User',
      },
    });    

    const role2 = await prisma.role.create({
      data: {
        roleName: 'Super Admin',
      },
    });

    const adminSeed = async () => {
      const adminList: Prisma.UserCreateManyInput[] = [
        {
          "name": "SuperAdmin",
          "userId": "SuperAdmin",
          "email": "superadmin@gmail.com",
          "password": await hash("Admin@123", 10),
          "phone": "099123456789",
          "status": "ACTIVE",
          "roleId": role2.id, 
        }
      ];
    
      await prisma.user.createMany({
        data: adminList,
      });
    };

    await adminSeed()

    console.log(`Seeding finished ... 🌲`);
  } catch (err) {
    console.log(`Seeding failed ... ⚠️ ${err}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
