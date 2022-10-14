function getRandom(max, count = 1) {
    return 1 + Math.floor(Math.random() * max - 1);
}

var Character = require('./src/character.js');

class Battle {
    round = 1;
    combatantIndex = 0;

    invovledCharacters = [];

    isBattleStarted() {
        return !(this.round === 1 && this.combatantIndex === 0);
    }

    addMember(member, initiative = null) {

        if(this.isBattleStarted()) {
            this.invovledCharacters.push({initiative:0, member:member});
        } else {

            if(initiative === null) {
                initiative = member.getInitiative();
            }

            this.invovledCharacters.push({initiative:initiative, member:member});
            this.invovledCharacters = this.invovledCharacters.sort((a,b) => a.initiative < b.initiative ? 1 : (a.initiative > b.initiative ? -1 : 0));
        }
    }

    getBattleOrder() {
        return this.invovledCharacters;
    }

}

var names = ['James', 'Joyce', 'Jill', 'Justine'];
var characters = {};

for(var name of names) {
    var q = (new Character()).setName(name);
    q.health.setMaxHealth(12).resetCurrentHealth();

    for(var attr of q.attributes.list()) {
    q.attributes.setAttribute(attr, 12 + getRandom(6));
    }

    characters[name] = q;
}


console.log(characters['James'].print());

var bt = new Battle();
bt.addMember(characters['James']);
bt.addMember(characters['Joyce']);



console.log(bt.getBattleOrder().map(x => { return {init:x.initiative, member:x.member.name};}));

