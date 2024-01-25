import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker/locale/pt_BR"
const prisma = new PrismaClient()

interface User 
{
    email: string
    name: string
}

let data: User[] = []
for (let i = 0; i < 20; i++) {
    data.push({
        name: faker.person.firstName(),
        email: faker.internet.email()
    })
}
export async function userSeed() {
    await prisma.user.createMany({ data })
}