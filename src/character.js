
'use strict';

var viewableObject = {
    list() { return Object.keys(this).filter(x => !['function', 'object'].includes((typeof this[x])));},
    print() {
        var subobjects = Object.keys(this).filter(x => typeof this[x] === 'object').map(x => `${x}:\n${this[x].print().split('\n').map(y => `    ${y}`).join('\n')}`);
        return this.list().map(x => `${x}: ${this[x]}`).concat(subobjects).join('\n');
    },
};


module.exports = class Character {

    name = 'unknown';
    level = 1;

    attributes = {
        strength:0,
        dexterity:0,
        constitution:0,
        intelligence:0,
        wisdom:0,
        charisma:0,        
        setAttribute(attribute, value) {
            this[attribute] = value;
            return this;
        },
    
        getAttribute(attribute) {
            return this[attribute];
        },
            
        getModifier(attribute) {
            return Math.ceil((this[attribute] - 10) / 2);
        },
        __proto__:viewableObject,
    };

    health = {
        max:0,
        current:0,
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
        },
        __proto__:viewableObject,
    };

    setName(name) {
        this.name = name;
        return this;
    }

    getInitiative() {
        return this.attributes.getModifier('dexterity');
    }

    constructor() {
        this.__proto__.list = viewableObject.list;
        this.__proto__.print = viewableObject.print;
    }


}