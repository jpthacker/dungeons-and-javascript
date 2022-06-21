// Global HTML elements
const menu = document.querySelector(".menu--start");
const titleContainer = document.querySelector(".title");
const titleMain = document.querySelector(".title__main");
const titleMenu = document.querySelector(".menu__title");
const createContainer = document.querySelector(".character-creation");
const creationMessage = document.querySelector(".character-creation__message");
const nameForm = document.querySelector(".name");
const errorMessage = document.querySelector(".character-creation__error");
const classSelector = document.querySelector(".class__selector");
const speciesSelector = document.querySelector(".species__selector");
const abilitiesAll = document.querySelector(".ability__container");
const ability = document.querySelectorAll(".ability");
const abilitiesSelector = document.querySelectorAll(".ability__selector");
const abilityOptions = document.querySelectorAll(".ability__option");
const abilityScore = document.querySelectorAll(".ability__score");
const statsContainer = document.querySelector(".stats");
const statsName = document.querySelector(".stats__name-race-class");
const statsProficiency = document.querySelector(".stats__proficiency");
const statsHitPoints = document.querySelector(".stats__hit-points");
const statsWalkingSpeed = document.querySelector(".stats__walking-speed");
const statsInitiative = document.querySelector(".stats__initiative");
const statsArmourClass = document.querySelector(".stats__armour-class");
const statsAbilities = document.querySelector(".stats__abilities");
const statsSavingThrows = document.querySelector(".stats__saving-throws");
const statsSenses = document.querySelector(".stats__senses");
const statsEquipment = document.querySelector(".stats__equipment");
const statsSpells = document.querySelector(".stats__spells");
const continueBtn = document.querySelector(".btn--continue");
const btnRibbon = document.querySelector(".character-creation__btn-ribbon");
const abilityBtn = document.querySelectorAll(".ability__btn");
const abilityResetBtn = document.querySelector(".btn--reset");
const backBtn = document.querySelector(".btn--back");

// Handles DnD standard dice rolls (original code courtesy of BryanBansbach (https://github.com/BryanBansbach/DiceRoller) - with revisions)
let rolledDice = [];
const standardDice = [4, 6, 8, 10, 12, 20];
const dice = (diceType, diceNumber) => {
  rolledDice = [];
  if (standardDice.includes(diceType)) {
    if (typeof diceNumber === "undefined") {
      finalDice = Math.floor(Math.random() * diceType) + 1;
      rolledDice.push(finalDice);
      console.log(rolledDice);
      return finalDice;
    } else {
      let diceC = 0;
      for (let i = 1; i <= diceNumber; i++) {
        let diceR = Math.floor(Math.random() * diceType) + 1;
        rolledDice.push(diceR);
        console.log(rolledDice);
        diceC = diceC + diceR;
      }
      console.log(diceC);
      return diceC;
    }
  } else {
    console.log("You must choose the right type of dice (4, 6, 8, 10, 12, 20)");
  }
};

const abilityList = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

// Player object and functions
const player = {
  abilities: {},
  modifiers: {},
  savingThrows: {},
  senses: {},
  equipment: {
    weapons: {},
    armour: {},
    potions: {},
    tools: {},
  },
  spells: {},
  attack: 0,
  damage: 0,
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      if (
        (abilityList[i] === "wisdom" && this.species === "Human") ||
        (abilityList[i] === "strength" && this.species === "Dwarf") ||
        (abilityList[i] === "dexterity" && this.species === "Elf")
      ) {
        this.abilities[abilityList[i]] = abilityScoreListOrdered[i] + 2;
      } else {
        this.abilities[abilityList[i]] = abilityScoreListOrdered[i];
      }
    }
  },
  assignAbilityModifiers(abilities) {
    Object.entries(abilities).forEach(([key, val]) => {
      this.modifiers[key] = Math.floor((val - 10) / 2);
    });
  },
  calculateSavingThrows(modifiers) {
    Object.entries(modifiers).forEach(([key, val]) => {
      this.savingThrows[key] = val;
      switch (this.class) {
        case "Cleric":
          if (key === "wisdom" || key === "charisma")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
        case "Fighter":
          if (key === "strength" || key === "constitution")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
        case "Rogue":
          if (key === "dexterity" || key === "intelligence")
            this.savingThrows[key] = val + parseInt(this.proficiency);
          break;
      }
    });
  },
  calculateSenses() {
    this.senses.perception = parseInt(this.modifiers.wisdom) + 10;
    this.senses.investigation = parseInt(this.modifiers.intelligence) + 10;
    this.senses.insight = parseInt(this.modifiers.wisdom) + 10;
  },
  formatStats(nestedObject) {
    Object.entries(nestedObject).forEach(([key, val]) => {
      if (val >= 0) {
        nestedObject[key] = "+" + val;
      }
    });
  },
  assignEquipment(equipment) {
    Object.keys(equipment).forEach((key) => {
      equipment[key] = {};
    });
    equipment.potions.healingPotionStandard = healingPotionStandard;
    switch (this.class) {
      case "Cleric":
        equipment.weapons.mace = mace;
        equipment.armour.shield = shield;
        break;
      case "Fighter":
        equipment.weapons.battleaxe = battleaxe;
        equipment.weapons.throwingAxe = throwingAxe;
        equipment.armour.plateArmour = plateArmour;
        break;
      case "Rogue":
        equipment.weapons.dagger = dagger;
        equipment.weapons.crossbow = crossbow;
        equipment.armour.leatherArmour = leatherArmour;
        equipment.tools.thievesTools = thievesTools;
    }
  },
  assignSpells(spells) {
    if (this.class === "Cleric") {
      spells.knock = knock;
      spells.sacredFlame = sacredFlame;
    } else {
      for (let prop in spells) {
        delete spells[prop];
      }
    }
  },
  calculateArmourClass() {
    Object.keys(this.equipment.armour).forEach((key) => {
      this.equipment.armour[key].getArmourBonus(this);
    });
    if (!this.equipment.armour.plateArmour) {
      player.armourClass += parseInt(this.modifiers.dexterity);
    }
  },
  calculateAttack() {
    let attackRoll = dice(20);
    this.attack =
      attackRoll +
      parseInt(this.modifiers.strength) +
      parseInt(this.proficiency);
  },
  getNameHTML(nameContainer) {
    nameContainer.innerHTML = `
    <h4 class="stats__name">${this.name}</h4>
    <h5 class="stats__species">${this.species}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;${this.class}</h5>
    `;
  },
  getProficiencyHTML(proficincyContainer) {
    proficincyContainer.innerHTML = `
    <h5 class="stats__proficiency-text1">PROFICIENCY</h5>
    <h4 class="stats__proficiency-no">${this.proficiency}</h4>
    <h5 class="stats__proficiency-text2">BONUS</h5>
    `;
  },
  getHitPointsHTML(hitPointsContainer) {
    hitPointsContainer.innerHTML = `
    <h5 class="stats__hit-points-text1">CURRENT / MAX</h5>
    <div class="stats__hit-points-no-container">
      <h4 class="stats__hit-points-current-no">${this.hitPointsCurrent}&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp</h4>
      <h4 class="stats__hit-points-max-no">${this.hitPointsMax}</h4>
    </div>
    <h5 class="stats__hit-points-text2">HIT POINTS</h5>
    `;
  },
  getWalkingSpeedHTML(walkingSpeedContainer) {
    walkingSpeedContainer.innerHTML = `
    <h5 class="stats__walking-speed-text1">WALKING</h5>
    <h4 class="stats__walking-speed-no">${this.walkingSpeed}</h4>
    <h5 class="stats__walking-speed-text2">SPEED (ft.)</h5>
    `;
  },
  getInitiativeHTML(initiativeContainer) {
    initiativeContainer.innerHTML = `
    <h5 class="stats__initiative-text1">INITIATIVE</h5>
    <h4 class="stats__initiative-no">${this.modifiers.dexterity}</h4>
    <h5 class="stats__initiative-text2"></h5>
    `;
  },
  getArmourClassHTML(armourClassContainer) {
    armourClassContainer.innerHTML = `
    <h5 class="stats__armour-class-text1">ARMOUR</h5>
    <h4 class="stats__armour-class-no">${this.armourClass}</h4>
    <h5 class="stats__armour-class-text2">CLASS</h5>
    `;
  },
  getAbilitiesHTML(abilitiesContainer) {
    abilitiesContainer.innerHTML = "";
    Object.keys(this.abilities).forEach((key) => {
      abilitiesContainer.innerHTML += `
    <div class="stats__ability--${key}">
      <h5 class="stats__ability-text--${key}">${key}</h5>
      <h4 class="stats__ability-modifier--${key}">${this.modifiers[key]}</h4>
      <h4 class="stats__ability-no--${key}">${this.abilities[key]}</h4>
    </div>`;
    });
  },
  getSavingThrowsHTML(savingThrowsContainer) {
    savingThrowsContainer.innerHTML = `
    <h4 class="stats__saving-throws-title">Saving Throws</h4>`;
    Object.keys(this.savingThrows).forEach((key) => {
      savingThrowsContainer.innerHTML += `
      <div class="stats__saving-throws--${key}">
      <h5 class="stats__saving-throws-text--${key}">${key}</h5>
      <h4 class="stats__saving-throws-modifier--${key}">
        ${this.savingThrows[key]}
      </h4>
    </div>`;
    });
  },
  getSensesHTML(sensesContainer) {
    sensesContainer.innerHTML = `
    <h4 class="stats__senses-title">Senses</h4>
    <div class="stats__senses--perception">
      <h4 class="stats__senses-modifier--perception">${this.senses.perception}</h4>
      <h5 class="stats__senses-text--perception">PASSIVE WIS (PERCEPTION)</h5>
    </div>
    `;
  },
  getEquipmentHTML(equipmentContainer) {
    equipmentContainer.innerHTML = `
    <h4 class="stats__equipment-title">Equipment</h4>
    <div class="stats__equipment--weapons">
      <div class="stats__equipment-table--four-items">
        <h5 class="stats__equipment-text">weapon</h5>
        <h5 class="stats__equipment-text">range (ft.)</h5>
        <h5 class="stats__equipment-text">hit/dc</h5>
        <h5 class="stats__equipment-text">damage</h5>
      </div>
    </div>
    <div class="stats__equipment--armour">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">armour</h5>
        <h5 class="stats__equipment-text">weight</h5>
        <h5 class="stats__equipment-text">ac bonus</h5>
      </div>
    </div>
    <div class="stats__equipment--potions">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">potion</h5>
        <h5 class="stats__equipment-text">rarity</h5>
        <h5 class="stats__equipment-text">hp bonus</h5>
      </div>
    </div>
    <div class="stats__equipment--tools hidden">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">tools</h5>
      </div>
    </div>
    `;
    const weaponsContainer = document.querySelector(
      ".stats__equipment--weapons"
    );
    const armourContainer = document.querySelector(".stats__equipment--armour");
    const potionsContainer = document.querySelector(
      ".stats__equipment--potions"
    );
    const toolsContainer = document.querySelector(".stats__equipment--tools");
    getItemsHTML(this.equipment.weapons, weaponsContainer);
    getItemsHTML(this.equipment.armour, armourContainer);
    getItemsHTML(this.equipment.potions, potionsContainer);
    getItemsHTML(this.equipment.tools, toolsContainer);
    if (this.equipment.tools.thievesTools) {
      toolsContainer.classList.remove("hidden");
    }
  },
  getSpellsHTML(spellsContainer) {
    spellsContainer.innerHTML = `
    <h4 class="stats__spells-title">Spells</h4>
    <div class="stats__spells--list">
      <div class="stats__spell-table--four-items">
        <h5 class="stats__spell-text">spell</h5>
        <h5 class="stats__spell-text">range (ft.)</h5>
        <h5 class="stats__spell-text">hit/dc</h5>
        <h5 class="stats__spell-text">effect</h5>
      </div>
    </div>
    `;
    const spellsListContainer = document.querySelector(".stats__spells--list");
    statsSpells.classList.add("hidden");
    getItemsHTML(this.spells, spellsListContainer);
    if (this.class === "Cleric") {
      statsSpells.classList.remove("hidden");
    }
  },
};

const getItemsHTML = (object, container) => {
  Object.keys(object).forEach((key) => {
    container.innerHTML += object[key].getItemHTML(player);
  });
};

// Weapon class
class Weapon {
  constructor(name, range, modifier, damageDie, html) {
    (this.name = name),
      (this.range = range),
      (this.modifier = modifier),
      (this.damageDie = damageDie),
      (this.html = html);
  }
  calculateWeaponDamage(user) {
    return dice(this.damageDie) + parseInt(user.modifiers[this.modifier]);
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-weapon--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
      <h5 class="stats__equipment-text--${this.html}">${this.range}</h5>
      <h4 class="stats__equipment-modifier--${this.html}">${
      "+" +
      (parseInt(user.modifiers[this.modifier]) + parseInt(user.proficiency))
    }</h4>
    <h5 class="stats__equipment-text--${this.html}">
    1d${this.damageDie}${user.modifiers[this.modifier]}
    </h5>
    </div>
    `;
  }
}

// Melee weapons
const battleaxe = new Weapon("BattleAxe", 5, "strength", 8, "battleaxe");
const dagger = new Weapon("Dagger", 5, "dexterity", 4, "dagger");
const mace = new Weapon("Mace", 5, "strength", 6, "mace");
const shortsword = new Weapon("Shortsword", 5, "dexterity", 6, "shortsword");

// Ranged weapons
const crossbow = new Weapon("Crossbow", 80, "dexterity", 6, "crossbow");
const throwingAxe = new Weapon(
  "Throwing Axe",
  20,
  "strength",
  6,
  "throwing-axe"
);

// Armour class
class Armour {
  constructor(name, type, bonus, html) {
    (this.name = name),
      (this.type = type),
      (this.bonus = bonus),
      (this.html = html);
  }
  getArmourBonus(user) {
    user.armourClass = this.bonus;
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.type}</h5>
    <h4 class="stats__equipment-modifier--${this.html}">
    +${this.bonus}
    </h4>
    </div>
    `;
  }
}

// Armour types
const leatherArmour = new Armour("Leather Armour", "Light", 11, "leather");
const plateArmour = new Armour("Plate Armour", "Heavy", 16, "plate");
const shield = new Armour("Shield", "Medium", 10, "shield");

// Healing potion class
class HealingPotion {
  constructor(name, type, healingDieAmount, healingBonus, html) {
    (this.name = name),
      (this.type = type),
      (this.healingDieAmount = healingDieAmount),
      (this.healingBonus = healingBonus),
      (this.html = html);
  }
  calculateHealing(consumer) {
    let healing;
    healing = dice(4, healingDieAmount) + healingBonus;
    console.log(healing);
    consumer.hitPointsCurrent = consumer.hitPointsCurrent + healing;
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.type}</h5>
    <h5 class="stats__equipment-text--${this.html}">${this.healingDieAmount}d4+${this.healingBonus}</h5>
    </div>
    `;
  }
}

// Healing potions
const healingPotionStandard = new HealingPotion(
  "Potion of Healing",
  "Common",
  2,
  2,
  "standard"
);
const healingPotionGreater = new HealingPotion(
  "Greater Potion of Healing",
  "Uncommon",
  4,
  4,
  "greater"
);
const healingPotionSuperior = new HealingPotion(
  "Superior Potion of Healing",
  "Rare",
  8,
  8,
  "superior"
);

// Tools class
class Tool {
  constructor(name, description, html) {
    (this.name = name), (this.description = description), (this.html = html);
  }
  getItemHTML(user) {
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-desc--${this.html}">${this.description}</h5>
    </div>
    `;
  }
}

// Thieves tools
const thievesTools = new Tool(
  "Thieves' Tools",
  "This set of tools includes a set of lock picks, allowing you to attempt to open locks. Your proficiency bonus is added to any ability checks you make to open locks.",
  "tools"
);

// Spells class
class Spell {
  constructor(name, html, range, modifier, effect) {
    (this.name = name),
      (this.html = html),
      (this.range = range),
      (this.modifier = modifier),
      (this.effect = effect);
  }
  getItemHTML(user) {
    return `
    <div class="stats__spell--${this.html}">
    <h5 class="stats__spell-text--${this.html}">${this.name}</h5>
      <h5 class="stats__spell-text--${this.html}">${this.range}</h5>
      <h4 class="stats__spell-mod--${this.html}">${
      "+" +
      (parseInt(user.modifiers[this.modifier]) + parseInt(user.proficiency))
    }</h4>
    <h5 class="stats__spell-text--${this.html}">${this.effect}</h5>
    </div>
    `;
  }
}

// Spells
const knock = new Spell("Knock", "knock", 5, "wisdom", "Unlocking");
const sacredFlame = new Spell(
  "Sacred Flame",
  "sacred-flame",
  60,
  "wisdom",
  "1d8 Damage"
);

let currentCreationStage = "start";

// Loads the character creation message
const loadCreationMessage = () => {
  titleContainer.classList.add("title--top");
  titleMain.classList.add("title__main--top");
  titleMenu.style.marginBottom = "0vh";
  menu.classList.remove("menu--start");
  menu.classList.add("menu");
  document.querySelector(".menu__title").innerText = "Create Your Adventurer";
  createContainer.classList.remove("character-creation--start");
  backBtn.classList.add("hidden");
  continueBtn.innerText = "Continue";
  btnRibbon.classList.remove("btn-start");
  creationMessage.innerHTML += `
Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa error
temporibus sint minima iusto quisquam, eveniet architecto, odio quia quas
ullam laudantium consequuntur deserunt laboriosam perspiciatis suscipit quo
ducimus nesciunt impedit voluptatibus corrupti. Tempore, eius quae doloribus
nisi quis corporis sit illum, velit nobis, harum unde dolore at sunt
possimus.
`;
  currentCreationStage = "message";
};

//Loads the name entry form
const loadNameForm = () => {
  nameForm.classList.remove("hidden");
  creationMessage.innerHTML = "";
  creationMessage.classList.add("hidden");
  creationMessage.classList.remove("justified");
  document.querySelector(".menu__title").innerText =
    "Enter the Name of Your Adventurer";
  backBtn.classList.remove("hidden");
  currentCreationStage = "name";
};

// Loads the class selector
const loadClassSelector = () => {
  console.log(player.name);
  if (player.name) {
    nameForm.classList.add("hidden");
    classSelector.classList.remove("hidden");
    document.querySelector(".menu__title").innerText = "Choose Your Class";
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
    currentCreationStage = "class";
  } else {
    errorMessage.innerHTML = "Please enter a name";
    errorMessage.classList.remove("hidden");
  }
};

// Loads the species selector
const loadSpeciesSelector = () => {
  if (player.class) {
    console.log(player.class);
    classSelector.classList.add("hidden");
    speciesSelector.classList.remove("hidden");
    creationMessage.innerHTML = "";
    creationMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText = "Choose Your Species";
    currentCreationStage = "species";
  } else {
    errorMessage.innerHTML = "Please select a class";
    errorMessage.classList.remove("hidden");
  }
};

// Loads the abilities generator
const loadAbilitiesGenerator = () => {
  if (player.species) {
    console.log(player.species);
    speciesSelector.classList.add("hidden");
    creationMessage.innerHTML = "";
    creationMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText =
      "Roll For Your Six Ability Scores";
    abilitiesAll.classList.remove("hidden");
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
    currentCreationStage = "abilities";
  } else {
    errorMessage.innerHTML = "Please select a species";
    errorMessage.classList.remove("hidden");
  }
  if (abilityScoreList.length > 0) {
    abilityResetBtn.classList.remove("hidden");
  }
};

// Loads the player character's stats
const loadCharacterStats = () => {
  let abilitiesReady;
  abilitiesSelector.forEach((selector) => {
    if (selector.disabled === true) {
      abilitiesReady = true;
    } else {
      abilitiesReady = false;
    }
  });
  if (abilitiesReady === false) {
    errorMessage.innerHTML = "Please assign your ability rolls";
    errorMessage.classList.remove("hidden");
  } else {
    createContainer.classList.add("hidden");
    abilityResetBtn.classList.add("hidden");
    statsContainer.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText = "Your Adventurer";
    player.assignAbilities();
    player.assignAbilityModifiers(player.abilities);
    player.proficiency = "+2";
    player.walkingSpeed = 30;
    player.hitPointsMax =
      parseInt(player.modifiers.constitution) + player.hitDie;
    player.hitPointsCurrent = player.hitPointsMax;
    player.calculateSavingThrows(player.modifiers);
    player.calculateSenses();
    player.assignEquipment(player.equipment);
    player.assignSpells(player.spells);
    player.formatStats(player.modifiers);
    player.formatStats(player.savingThrows);
    player.calculateArmourClass();
    console.log(player);
    console.log(player.equipment.armour.name);
    // Make HTML loading more efficient, i.e., use object loops and single function
    player.getNameHTML(statsName);
    player.getProficiencyHTML(statsProficiency);
    player.getHitPointsHTML(statsHitPoints);
    player.getWalkingSpeedHTML(statsWalkingSpeed);
    player.getInitiativeHTML(statsInitiative);
    player.getArmourClassHTML(statsArmourClass);
    player.getAbilitiesHTML(statsAbilities);
    player.getSavingThrowsHTML(statsSavingThrows);
    player.getSensesHTML(statsSenses);
    player.getEquipmentHTML(statsEquipment);
    player.getSpellsHTML(statsSpells);
    currentCreationStage = "stats";
  }
};

//Handles the character creation menu buttons
continueBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
  switch (currentCreationStage) {
    case "start":
      loadCreationMessage();
      break;
    case "message":
      loadNameForm();
      break;
    case "name":
      loadClassSelector();
      break;
    case "class":
      loadSpeciesSelector();
      break;
    case "species":
      loadAbilitiesGenerator();
      break;
    case "abilities":
      loadCharacterStats();
  }
});

//Handles the back button
backBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
  switch (currentCreationStage) {
    case "name":
      nameForm.classList.add("hidden");
      errorMessage.classList.add("hidden");
      creationMessage.classList.remove("hidden");
      creationMessage.style.marginTop = "0";
      creationMessage.classList.remove("justified");
      continueBtn.innerHTML = "Start";
      loadCreationMessage();
      break;
    case "class":
      loadNameForm();
      classSelector.classList.add("hidden");
      errorMessage.classList.add("hidden");
      break;
    case "species":
      speciesSelector.classList.add("hidden");
      errorMessage.classList.add("hidden");
      loadClassSelector();
      break;
    case "abilities":
      loadSpeciesSelector();
      abilitiesAll.classList.add("hidden");
      abilityResetBtn.classList.add("hidden");
      break;
    case "stats":
      loadAbilitiesGenerator();
      statsContainer.classList.add("hidden");
      createContainer.classList.remove("hidden");
      abilityResetBtn.classList.remove("hidden");
      errorMessage.classList.remove("hidden");
  }
});

// Handles the name entry form
nameForm.addEventListener("input", (event) => {
  player.name = event.target.value;
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the class selector
classSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "cleric":
      creationMessage.innerHTML = `A priestly champion who wields divine magic in service of a higher power<br/><br/>Primary Ability: Wisdom<br/>Saves: Wisdom & Charisma
      `;
      player.class = "Cleric";
      player.hitDie = 8;
      break;
    case "fighter":
      creationMessage.innerHTML = `A master of martial combat, skilled with a variety of weapons and armour<br/><br/>Primary Ability: Strength or Dexterity<br/>Saves: Strength & Constitution
      `;
      player.class = "Fighter";
      player.hitDie = 12;
      break;
    case "rogue":
      creationMessage.innerHTML = `A scoundrel who uses stealth and trickery to overcome obstacles and enemies<br/><br/>Primary Ability: Dexterity<br/>Saves: Dexterity & Intelligence
      `;
      player.class = "Rogue";
      player.hitDie = 10;
  }
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the species selector
speciesSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "dwarf":
      creationMessage.innerHTML = `Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal<br/><br/>Species Trait:<br/>+2 Strength
      `;
      player.species = "Dwarf";
      break;
    case "elf":
      creationMessage.innerHTML = `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it<br/><br/>Species Trait:<br/>+2 Dexterity
      `;
      player.species = "Elf";
      break;
    case "human":
      creationMessage.innerHTML = `Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds<br/><br/>Species Trait:<br/>+2 Wisdom
      `;
      player.species = "Human";
  }
  // Reminds the player of their class choice
  switch (player.class) {
    case "cleric":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Cleric (Primary Ability: Wisdom, Saves: Wisdom & Charisma)";
      break;
    case "fighter":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Fighter (Primary Ability: Strength, Saves: Strength & Constitution)";
      break;
    case "rogue":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Rogue (Primary Ability: Dexterity, Saves: Dexterity & Intelligence)";
  }
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the ability buttons and generates dice rolls for abilities (removes the lowest number of four d6 dice rolls and totals the remaining rolls)
let currentAbilityScore;
let abilityScoreList = [];
for (let i = 0; i < abilityBtn.length; i++) {
  abilityBtn[i].addEventListener("click", (event) => {
    if (abilityScoreList.length < 6) {
      event.preventDefault();
      dice(6, 4);
      let abilityRoll = rolledDice.sort().filter((_, i) => i);
      currentAbilityScore = abilityRoll.reduce((a, b) => a + b);
      abilityScoreList.push(currentAbilityScore);
      abilityScore[i].innerHTML = currentAbilityScore;
      abilityBtn[i].classList.add("hidden");
      abilitiesSelector[i].classList.remove("hidden");
      if (i < 5) {
        ability[i + 1].classList.remove("hidden");
      }
      console.log(abilityScoreList);
    } else {
      errorMessage.innerHTML = "Press reset to re-roll your scores";
      errorMessage.classList.remove("hidden");
    }
  });
}

// Reorders the ability scores into correct order (after assignment)
const reorderAbilities = (ability, to) => {
  abilityScoreListOrdered.splice(to, 1, ability);
  console.log(abilityScoreListOrdered);
};

// Handles the assignment of ability scores
const abilityScoreListOrdered = [0, 0, 0, 0, 0, 0];
for (let i = 0; i < abilitiesSelector.length; i++) {
  abilitiesSelector[i].addEventListener("change", (event) => {
    let abilityOption = event.target.value;
    abilityResetBtn.classList.remove("hidden");
    switch (abilityOption) {
      case "1":
        reorderAbilities(abilityScoreList[i], 0);
        abilitiesSelector.forEach((selector) => {
          selector[1].disabled = true;
        });
        break;
      case "2":
        reorderAbilities(abilityScoreList[i], 1);
        abilitiesSelector.forEach((selector) => {
          selector[2].disabled = true;
        });
        break;
      case "3":
        reorderAbilities(abilityScoreList[i], 2);
        abilitiesSelector.forEach((selector) => {
          selector[3].disabled = true;
        });
        break;
      case "4":
        reorderAbilities(abilityScoreList[i], 3);
        abilitiesSelector.forEach((selector) => {
          selector[4].disabled = true;
        });
        break;
      case "5":
        reorderAbilities(abilityScoreList[i], 4);
        abilitiesSelector.forEach((selector) => {
          selector[5].disabled = true;
        });
        break;
      case "6":
        reorderAbilities(abilityScoreList[i], 5);
        abilitiesSelector.forEach((selector) => {
          selector[6].disabled = true;
        });
    }
    abilitiesSelector[i].disabled = true;
  });
}

// Handles the reset button and resets the ability selectors
abilityResetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  abilityOptions.forEach((option) => {
    option.disabled = false;
  });
  abilitiesSelector.forEach((selector) => {
    selector[0].selected = true;
    selector[0].disabled = true;
    selector.disabled = false;
  });
});
