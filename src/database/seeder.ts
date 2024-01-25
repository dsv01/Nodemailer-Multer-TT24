import { PrismaClient } from "@prisma/client";
import { userSeed } from "./models/userSeed"
import { postSeed } from "./models/postSeeder";
const prisma = new PrismaClient()


async function main() {
    /* funcoes importadas */
    await userSeed()
    await postSeed()
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })