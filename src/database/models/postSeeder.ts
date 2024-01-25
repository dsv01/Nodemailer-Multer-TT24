import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker/locale/pt_BR"
const prisma = new PrismaClient()

interface Post 
{
    title: string
    authorId: any
}

let data: Post[] = []
for (let i = 0; i < 20; i++) {
    data.push({
        title: faker.lorem.sentence(5),
        authorId: null
    })
}
export async function postSeed() {
    await prisma.post.createMany({ data })
}