const bodyParser = require('body-parser')
const app = require('express')()

const {getServerIo} =  require('../modules/socket')
import { PrismaClient } from '@prisma/client'

function reverseRelationship(object, key) {
    object[`${key}Id`] = object[key].id;
    delete object[key];
    return object;
}

function fillNestedCreates(object) {
    for(var key in object) {
        if(Array.isArray(object[key])) {
            object[key] = {createMany: object[key]};
        } else if (typeof object[key] === 'object' && object[key] !== null) {
            object[key] = {create: object[key]};
        }
    }
    return object;
}

function fillNestedUpdates(object) {
    for(var key in object) {
        if(Array.isArray(object[key])) {
            object[key] = {createMany: object[key]};
        } else if (typeof object[key] === 'object' && object[key] !== null) {
            object[key] = {delete: {where: {'id': object[key].id}}, create: object[key]};
        }
    }
    return object;
}


//var globalServer = register.server({ port: 3001 });

const prisma = new PrismaClient();
app.use(bodyParser.json())
app.all('/charatersPalette', async (req, res) => {


    var databaseData = await prisma.character.findMany({where: {public:true, trash:false}, include: {race:true, class:true, attributes:true}});
    const response = { characters: databaseData};
    

    res.json(response);
    /*
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

app.all('/avaliableClasses', async (req, res) => {
    var databaseData = await prisma.Character_Class.findMany({where: {public:true}, include: {source:true}});
    res.json(databaseData);
});

app.all('/avaliableRaces', async (req, res) => {
    var databaseData = await prisma.Character_Race.findMany({where: {public:true}, include: {source:true}});
    res.json(databaseData);
});



app.post('/setBattle', (req, res) => {
    res.json({status:'ok'});
})

app.post('/saveCharacter', async (req, res) => {
    var newCharacter = req.body;

    const allowedKeys = ['id','name','raceId' ,'race','class', 'classId','level','attributes','maxHealth','health','armourClass'];
    newCharacter = Object.fromEntries(Object.entries(newCharacter).filter(([key]) => allowedKeys.includes(key)));

    newCharacter = reverseRelationship(newCharacter, 'race');
    newCharacter = reverseRelationship(newCharacter, 'class');

    if(newCharacter.id !== undefined) {
        if(await prisma.Character.findUnique({where: {id: newCharacter.id}}) !== null) {
            var attributes = newCharacter.attributes;
            delete newCharacter.attributes;
            newCharacter = await prisma.Character.update({where:{id: newCharacter.id}, data:newCharacter});
            attributes = await prisma.Character_Attributes.update({where:{id: attributes.id}, data:attributes});
        } else {
            newCharacter = fillNestedCreates(newCharacter);
        newCharacter = await prisma.Character.create({data:newCharacter});
        }
    } else {
        newCharacter = fillNestedCreates(newCharacter);
        newCharacter = await prisma.Character.create({data:newCharacter});
    }
    

    newCharacter = await prisma.Character.findUnique({
        where: {id: newCharacter.id},
        include: {race:true, class:true, attributes:true}
      });


    res.json({status:'ok', character: newCharacter});

    var databaseData = await prisma.character.findMany({where: {public:true, trash:false}, include: {race:true, class:true, attributes:true}});
    const response = { characters: databaseData};
    getServerIo().emit('reloadCharacters', response);
});



app.post('/deleteCharacter', async (req, res) => {
    var character = req.body;
    await prisma.Character.update({where:{id:character.id}, data:{trash:true}});
    res.json({status:'ok'});
});

module.exports = app;
