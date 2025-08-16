import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import { RepairRequest, User } from 'generated/prisma';

const prisma = new PrismaClient();

async function main() {
    // Clear database
    await clearDatabase();

    // 1️⃣ Générer 50 utilisateurs aléatoires
    const users: User[] = await generateRandomUsers(50);

    // 2️⃣ Récupérer les artisans
    const artisans: User[] = users.filter(u => u.role === 'ARTISAN');

    // 3️⃣ Générer des RepairRequests pour chaque utilisateur
    const REPAIR_REQUEST_MIN_COUNT = 12;
    const REPAIR_REQUEST_MAX_COUNT = 20;

    const repairRequests: RepairRequest[] = [];

    for (const user of users) {
        const count = faker.number.int({ min: REPAIR_REQUEST_MIN_COUNT, max: REPAIR_REQUEST_MAX_COUNT });
        for (let i = 0; i < count; i++) {
            const repairRequest = await prisma.repairRequest.create({
                data: {
                    title: faker.lorem.words(3),
                    description: faker.lorem.paragraph(),
                    status: faker.helpers.arrayElement(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
                    scheduledAt: faker.datatype.boolean() ? faker.date.future() : null,
                    address: faker.location.city(),
                    photos: [
                        {
                            url: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c",
                            alt: "Robot plombier réparant une canalisation"
                        },
                        {
                            url: "https://images.unsplash.com/photo-1679568293627-09da86dcfd61",
                            alt: "Robot peintre en intervention"
                        }
                    ],
                    clientId: user.id,
                    artisanId: faker.helpers.arrayElement([...artisans, null] as (User | null)[])?.id ?? null,
                },
            });

            repairRequests.push(repairRequest);

            // 1 à 5 quotes par repairRequest
            const quoteCount = faker.number.int({ min: 1, max: 5 });
            for (let j = 0; j < quoteCount; j++) {
                if (artisans.length === 0) continue; // éviter erreur si pas d’artisan
                const artisan = faker.helpers.arrayElement(artisans);
                await prisma.quote.create({
                    data: {
                        amount: parseFloat(faker.commerce.price()),
                        description: faker.lorem.paragraph(),
                        requestId: repairRequest.id,
                        artisanId: artisan.id,
                    },
                });
            }
        }
    }

    console.log(`Seed terminé : ${users.length} users, ${repairRequests.length} repairRequests créées.`);
}

// =======================================================
// Génération des utilisateurs
async function generateRandomUser(): Promise<User> {
    const role = faker.helpers.arrayElement(['CLIENT', 'ARTISAN']);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            role,
            password: faker.internet.password(),
            phone: faker.phone.number(),
            location: faker.location.city(),
            email: faker.internet.exampleEmail({ firstName, lastName }),
        },
    });

    console.log(`Created user: ${firstName} ${lastName} (${role})`);
    return user;
}

async function generateRandomUsers(count: number): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        users.push(await generateRandomUser());
    }
    return users;
}

async function clearDatabase() {
    await prisma.$transaction([
        prisma.user.deleteMany(),
        prisma.repairRequest.deleteMany(),
        prisma.quote.deleteMany(),
    ]);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
