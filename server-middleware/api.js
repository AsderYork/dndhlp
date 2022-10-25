const bodyParser = require('body-parser')
const app = require('express')()
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
app.use(bodyParser.json())
app.all('/charatersPalette', async (req, res) => {

    var databaseData = await prisma.character.findMany({where: {public:true}, include: {race:true, class:true}});
    databaseData = databaseData.map(x => Object.assign({level:1, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true, isUnique:true}, x));

    res.json({ characters: databaseData});
    /*console.log(rrr)


  res.json({ characters: [
            { id: 1, name: 'Bielzeboba', level: 3, class: { name: 'Barbarian' }, race: { name: 'Dragonborn' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true, isUnique:true },
            { id: 2, name: 'MahBoiHavanski', level: 3, class: { name: 'Sorcerer' }, race: { name: 'halfling' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true, isUnique:true },
            { id: 3, name: 'Cheekebreeker', level: 4, class: { name: 'Artificer' }, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true, isUnique:true },
            { id: 4, name: 'Zvinevra Dvyazka', level: 3, class: { name: 'Barbarian' }, race: { name: 'Halfling' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true, isUnique:true },
            { id: 5, name: 'Orc', level: 2, race: { name: 'Orc' }, health: { max: 23, current: 12, visible: true }, armourClass: 17, recieveTurn: true, isUnique:false },
            { id: 6, name: 'Goblin', level: 2, race: { name: 'Goblin' }, health: { max: 23, current: 12, visible: true }, armourClass: 13, recieveTurn: true, isUnique:false },
            { id: 7, name: 'Dire wolf', level: 2, race: { name: 'Dire wolf' }, health: { max: 23, current: 12, visible: true }, armourClass: 15, recieveTurn: true, isUnique:false },
        ] 
    })*/
});



app.post('/setBattle', (req, res) => {
    console.log(req.body);
    res.json({error:null});
})

module.exports = app