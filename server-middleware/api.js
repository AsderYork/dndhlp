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

const campaignId = 1;
const currentUserId = 1;

//var globalServer = register.server({ port: 3001 });

const prisma = new PrismaClient();
app.use(bodyParser.json())


async function fetchCampaign(campaignId) {
    var campaign = await prisma.Campaign.findUnique({
        where: {id: campaignId},
        include: {CampaignPlayers:{ include: {User: true, Role:true}}, CampaignInvites:{where:{deactivated:false, accepted:false}, include: {User: true}}}
      });
    
    campaign.settings = campaign.settings == null ? {} : JSON.parse(campaign.settings);
    return campaign;
}


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


app.all('/currentCampaign', async (req, res) => {
    const compaignId = 1;
    var campaign = await prisma.Campaign.findUnique({
        where: {id: compaignId},
        include: {CampaignPlayers:{ include: {User: true, Role:true},}}
      });
    res.json({campaign:campaign});
});

app.all('/getCampaign', async (req, res) => {
    const campaignId = parseInt(req.query.id);
    var campaign = await fetchCampaign(campaignId);
    res.json({campaign:campaign});
});

app.post('/updateCampaign', async (req, res) => {
    var newCampaignData = req.body;
    if(newCampaignData.settings) { newCampaignData.settings = JSON.stringify(newCampaignData.settings); }

    const id = newCampaignData.id;
    const allowedFields = ['name', 'settings', 'description'];
    newCampaignData = Object.fromEntries(Object.entries(newCampaignData).filter(([key]) => allowedFields.includes(key)));

    await prisma.Campaign.update({where:{id: id}, data:newCampaignData});
    var campaign = await fetchCampaign(campaignId);
    res.json({status:'ok', campaign:campaign});
});




app.all('/campaignInvitesList', async (req, res) => {
    var invites = await prisma.CampaignInvites.findMany({
        where: {CampaignId: campaignId, deactivated:false, accepted:false},
        include: {User:true, Author:true},
      });
    res.json({invites:invites});
});

async function allCampaignPlayersById(campaign) {
    var allreadyInCampaign = await prisma.CampaignPlayers.findMany({
        select: {UserId:true},
        where: {CampaignId: campaign}
    });
    
    allreadyInCampaign = allreadyInCampaign.map(x => x.UserId);
    return allreadyInCampaign;
}

async function allActiveCampaignUserInvites(campaign) {
    var allreadyInvited = await prisma.CampaignInvites.findMany({
        select: {UserId:true},
        where: {CampaignId: campaign, deactivated:false, accepted:false, NOT:{UserId:null}}
    });
    allreadyInvited = allreadyInvited.map(x => x.UserId);
    return allreadyInvited;
}


app.all('/UsersFind', async (req, res) => {
    var query = req.query.query;

    //exclude those who are allready in campaign
    //Or allready invited
    var allreadyInCampaign = await allCampaignPlayersById(campaignId);
    var allreadyInvited = await allActiveCampaignUserInvites(campaignId);
    var excludedUsers = allreadyInCampaign.concat(allreadyInvited);

    var users = await prisma.User.findMany({
        take: 6,
        where: {name: {startsWith: query}, NOT:{id:{in: excludedUsers}}},
      });
    res.json({users:users});
});

app.post('/campaignInvitesCreate', async (req, res) => {
    var invite = req.body;
    invite.AuthorId = currentUserId;
    invite.CampaignId = campaignId;

    if(invite.newUsername !== undefined) {
        invite.token = Math.random().toString(36).substr(2).toUpperCase();
    }

    var newInvite = await prisma.CampaignInvites.create({data:invite});

    var campaign = await fetchCampaign(campaignId);
    res.json({status:'ok', campaign: campaign});
});

app.post('/campaignInvitesDelete', async (req, res) => {
    var invite = req.body.invite;
    var newInvite = await prisma.CampaignInvites.update({where:{id:invite.id}, data:{deactivated:true}});
    var campaign = await fetchCampaign(campaignId);
    res.json({status:'ok', campaign: campaign});
});


app.post('/changeUser', async (req, res) => {
    var newUser = req.body;
    if(newUser.settings) { newUser.settings = JSON.stringify(newUser.settings); }

    const userId = newUser.id;
    const allowedFields = ['name', 'settings'];
    newUser = Object.fromEntries(Object.entries(newUser).filter(([key]) => allowedFields.includes(key)));

    await prisma.User.update({where:{id: userId}, data:newUser});

    var user = await prisma.User.findUnique({where: {id: userId}, include:{CampaignPlayers:{include:{Campaign:true}}}});
    user.settings = user.settings == null ? {} : JSON.parse(user.settings);

    
    res.json({status:'ok', user:user});
});

app.post('/changeUserPassword', async (req, res) => {
    var userId = req.body.userId;
    var password = req.body.password;

    await prisma.User.update({where:{id: userId}, data:{password:password}});

    var user = await prisma.User.findUnique({where: {id: userId}, include:{CampaignPlayers:{include:{Campaign:true}}}});
    user.settings = user.settings == null ? {} : JSON.parse(user.settings);

    
    res.json({status:'ok', user:user});
});




module.exports = app;
