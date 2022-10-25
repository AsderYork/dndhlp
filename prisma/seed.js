const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()



async function main() {
    const PHB = await prisma.Source.upsert({
        where: { shortname: 'PHB' },
        update: {},
        create: {
            name: "Player's Handbook",
            shortname: 'PHB',
            races: {
                create: [
                    { name: 'Dragonborn', public: true },
                    { name: 'Dwarf', public: true },
                    { name: 'Elf', public: true },
                    { name: 'Gnome', public: true },
                    { name: 'Half-Elf', public: true },
                    { name: 'Halfling', public: true },
                    { name: 'Half-Orc', public: true },
                    { name: 'Human', public: true },
                    { name: 'Tiefling', public: true },
                ],
            },
            classes: {
                create: [
                    { name: "Barbarian", public: true },
                    { name: "Bard", public: true },
                    { name: "Cleric", public: true },
                    { name: "Druid", public: true },
                    { name: "Fighter", public: true },
                    { name: "Monk", public: true },
                    { name: "Paladin", public: true },
                    { name: "Ranger", public: true },
                    { name: "Rogue", public: true },
                    { name: "Sorcerer", public: true },
                    { name: "Warlock", public: true },
                    { name: "Wizard", public: true },
                    { name: "Artificer", public: true },
                ],
            },
        },
    })

    console.log({ PHB })
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