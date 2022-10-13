function getRandom(max, count = 1) {
    return 1 + Math.floor(Math.random() * max - 1);
}

class Character {

    name = 'unknown';
    level = 1;

    attributes = {
        strength:0,
        dexterity:0,
        constitution:0,
        intelligence:0,
        wisdom:0,
        charisma:0,

        list() { return Object.keys(this).filter(x => !['function', 'object'].includes((typeof this[x])));},
        print() {
            var subobjects = Object.keys(this).filter(x => typeof this[x] === 'object').map(x => `${x}: ${this[x].print()}`);
            return this.list().map(x => `${x}: ${this[x]}`).concat(subobjects).join('\n');
        },
        setAttribute(attribute, value) {
            this[attribute] = value;
            return this;
        },
    
        getAttribute(attribute) {
            return this[attribute];
        },
            
        getModifier(attribute) {
            return Math.ceil((this[attribute] - 10) / 2);
        }
    };

    health = {
        max:0,
        current:0,

        list() { return Object.keys(this).filter(x => !['function', 'object'].includes((typeof this[x])));},
        print() {
            var subobjects = Object.keys(this).filter(x => typeof this[x] === 'object').map(x => `${x}: ${this[x].print()}`);
            return this.list().map(x => `${x}: ${this[x]}`).concat(subobjects).join('\n');
        },

        setMaxHealth(maxHealth) {
            this.max = maxHealth;
            return this;
        },

        resetCurrentHealth() {
            this.current = this.max;
        },

        increaseMaxHealth(modifier) {
            this.max += modifier;
            this.current += modifier;
        },

        changeCurrentHealth(modifier) {
            this.current -= modifier;
        }
    };

    list() { return Object.keys(this).filter(x => !['function', 'object'].includes((typeof this[x])));}
    print() {
        var subobjects = Object.keys(this).filter(x => typeof this[x] === 'object').map(x => `${x}:\n${this[x].print().split('\n').map(y => `   ${y}`).join('\n')}`);
        return this.list().map(x => `${x}: ${this[x]}`).concat(subobjects).join('\n');
    }

    setName(name) {
        this.name = name;
        return this;
    }

    getInitiative() {
        return this.attributes.getModifier('dexterity');
    }

}

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

    //console.log(q.print());
    characters[name] = q;
}

var bt = new Battle();
bt.addMember(characters['James']);
bt.addMember(characters['Joyce']);



console.log(bt.getBattleOrder().map(x => { return {init:x.initiative, member:x.member.name};}));

