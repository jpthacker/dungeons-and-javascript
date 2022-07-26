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
const statsBtn = document.querySelector(".stats__btn--game");
const game = document.querySelector(".game");
const gameMenu = document.querySelector(".game__menu");
const footer = document.querySelector(".footer");
const continueBtn = document.querySelector(".btn--continue");
const btnRibbon = document.querySelector(".character-creation__btn-ribbon");
const abilityBtn = document.querySelectorAll(".ability__btn");
const abilityResetBtn = document.querySelector(".btn--reset");
const backBtn = document.querySelector(".btn--back");
const gameTitle = document.querySelector(".game__title");
const gameMessage = document.querySelector(".game__message");
const gameBtns = document.querySelectorAll("[class*='game__btn']");
const gamePopup = document.querySelector(".game__popup");
const gamePopupTitle = document.querySelector(".game__popup-title");
const gamePopupResult = document.querySelector(".game__popup-result");
const gamePopupMessage = document.querySelector(".game__popup-message");
const gamePopupBtn = document.querySelector(".game__btn--popup");
const gameStatsBtn = document.querySelector(".game__btn--stats");

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

// Abilities list
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
    items: {},
  },
  spells: {},
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      if (
        (abilityList[i] === "dexterity" && this.species === "Human") ||
        (abilityList[i] === "strength" && this.species === "Dwarf") ||
        (abilityList[i] === "wisdom" && this.species === "Elf")
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
        equipment.weapons.meleeWeapon = mace;
        equipment.armour.shield = shield;
        break;
      case "Fighter":
        equipment.weapons.meleeWeapon = battleaxe;
        equipment.weapons.rangedWeapon = throwingAxe;
        equipment.armour.plateArmour = plateArmour;
        break;
      case "Rogue":
        equipment.weapons.meleeWeapon = dagger;
        equipment.weapons.rangedWeapon = crossbow;
        equipment.armour.leatherArmour = leatherArmour;
        equipment.items.thievesTools = thievesTools;
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
    <div class="stats__equipment--items hidden">
      <div class="stats__equipment-table">
        <h5 class="stats__equipment-text">other</h5>
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
    const itemsContainer = document.querySelector(".stats__equipment--items");
    getAllItemsHTML(this.equipment.weapons, weaponsContainer);
    getAllItemsHTML(this.equipment.armour, armourContainer);
    getAllItemsHTML(this.equipment.potions, potionsContainer);
    getAllItemsHTML(this.equipment.items, itemsContainer);
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
    getAllItemsHTML(this.spells, spellsListContainer);
    if (this.class === "Cleric") {
      statsSpells.classList.remove("hidden");
    }
  },
};

// Fills in the HTML for all player equipment
const getAllItemsHTML = (object, container) => {
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
  calculateWeaponHit(user) {
    return (
      dice(20) +
      parseInt(user.modifiers[this.modifier]) +
      parseInt(user.proficiency)
    );
  }
  calculateWeaponDamage(user) {
    return dice(this.damageDie) + parseInt(user.modifiers[this.modifier]);
  }
  getItemHTML(user) {
    let damageModifier = "";
    if (user.modifiers[this.modifier] >= 1) {
      damageModifier = user.modifiers[this.modifier];
    }
    return `
    <div class="stats__equipment-weapon--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
      <h5 class="stats__equipment-text--${this.html}">${this.range}</h5>
      <h4 class="stats__equipment-modifier--${this.html}">${
      "+" +
      (parseInt(user.modifiers[this.modifier]) + parseInt(user.proficiency))
    }</h4>
    <h5 class="stats__equipment-text--${this.html}">
    1d${this.damageDie}${damageModifier}
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
    healing = dice(4, this.healingDieAmount) + this.healingBonus;
    consumer.hitPointsCurrent = consumer.hitPointsCurrent + healing;
    return healing;
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

// Items class
class Item {
  constructor(name, description, html) {
    (this.name = name), (this.description = description), (this.html = html);
  }
  getItemHTML(user) {
    const itemsContainer = document.querySelector(".stats__equipment--items");
    itemsContainer.classList.remove("hidden");
    return `
    <div class="stats__equipment-item--${this.html}">
    <h5 class="stats__equipment-text--${this.html}">${this.name}</h5>
    <h5 class="stats__equipment-desc--${this.html}">${this.description}</h5>
    </div>
    `;
  }
}

// Items
const thievesTools = new Item(
  "Thieves' Tools",
  "This set of tools includes a set of lock picks, allowing you to attempt to open locks. Your proficiency bonus is added to any ability checks you make to open locks.",
  "tools"
);
const brassKey = new Item(
  "Brass Key",
  "An intricate brass key, dulled and lined with dirt.",
  "key"
);

// Spells class
class Spell {
  constructor(name, html, range, modifier, effect, damageDie) {
    (this.name = name),
      (this.html = html),
      (this.range = range),
      (this.modifier = modifier),
      (this.effect = effect),
      (this.damageDie = damageDie);
  }
  calculateSpellHit(user) {
    return (
      dice(20) +
      parseInt(user.modifiers[this.modifier]) +
      parseInt(user.proficiency)
    );
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
  calculateSpellDamage() {
    return dice(this.damageDie);
  }
}

// Spells
const knock = new Spell("Knock", "knock", 5, "wisdom", "Unlocking");
const sacredFlame = new Spell(
  "Sacred Flame",
  "sacred-flame",
  60,
  "wisdom",
  "1d8 Damage",
  8
);

// CHARACTER CREATION MECHANICS

// Prevents the enter button from refreshing the page
document.body.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

// This variable determines the function of the creation 'continue' button (see switch case below)
let currentCreationStage = "start";

// Loads the character creation message
const loadCreationMessage = () => {
  titleContainer.classList.add("title--top");
  titleMain.classList.add("title__main--top");
  titleMenu.style.marginBottom = "0vh";
  menu.classList.add("menu");
  document.querySelector(".menu__title").innerText = "Create Your Adventurer";
  createContainer.classList.remove("character-creation--start");
  backBtn.classList.add("hidden");
  continueBtn.innerText = "Continue";
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
  menu.classList.add("flex-start");
  btnRibbon.classList.add("margin-top-auto");
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
    // Make HTML loading more efficient, i.e., use object loops and single function??
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

// Loads the game starting page
const loadGame = () => {
  menu.classList.add("hidden");
  statsContainer.classList.add("hidden");
  btnRibbon.classList.add("hidden");
  game.classList.remove("hidden");
  footer.classList.remove("hidden");
  gameTitle.innerText = "Entering the Dungeon";
  gameBtns[0].innerText = "Enter the crypt";
  gameBtns[1].classList.add("hidden");
  goblin.assignAbilities();
  goblin.getCurrentHP();
  goblin.assignAbilityModifiers(goblin.abilities);
  goblin.calculateSenses();
  goblin.calculateAttack();
  console.log(goblin);
  currentCreationStage = "game start";
  currentGameStage = "game start";
};

// Handles the character creation menu buttons
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
      break;
    case "stats":
      loadGame();
  }
});

// Handles the back button during character creation
backBtn.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo(0, 0);
  switch (currentCreationStage) {
    case "name":
      menu.classList.remove("flex-start");
      btnRibbon.classList.remove("margin-top-auto");
      nameForm.classList.add("hidden");
      errorMessage.classList.add("hidden");
      creationMessage.classList.remove("hidden");
      creationMessage.style.marginTop = "0";
      creationMessage.classList.add("justified");
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
      creationMessage.innerHTML = `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it<br/><br/>Species Trait:<br/>+2 Wisdom
      `;
      player.species = "Elf";
      break;
    case "human":
      creationMessage.innerHTML = `Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds<br/><br/>Species Trait:<br/>+2 Dexterity
      `;
      player.species = "Human";
  }
  // Reminds the player of their class choice
  switch (player.class) {
    case "Cleric":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Cleric (Primary Ability: Wisdom, Saves: Wisdom & Charisma)";
      break;
    case "Fighter":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Fighter (Primary Ability: Strength, Saves: Strength & Constitution)";
      break;
    case "Rogue":
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
      console.log(abilityRoll);
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

// MONSTER CLASS AND OBJECTS

//  Monster class
class Monster {
  constructor(
    name,
    armourClass,
    hitDie,
    speed,
    proficiency,
    abilitiesArray,
    meleeWeapon,
    rangedWeapon
  ) {
    (this.name = name),
      (this.armourClass = armourClass),
      (this.hitDie = hitDie),
      (this.speed = speed),
      (this.proficiency = proficiency),
      (this.meleeWeapon = meleeWeapon),
      (this.rangedWeapon = rangedWeapon),
      (this.abilitiesArray = abilitiesArray);
    (this.abilities = {}), (this.modifiers = {});
  }
  getCurrentHP() {
    this.hitPointsCurrent = dice(this.hitDie, 2);
  }
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      this.abilities[abilityList[i]] = this.abilitiesArray[i];
    }
  }
  assignAbilityModifiers(abilities) {
    Object.entries(abilities).forEach(([key, val]) => {
      this.modifiers[key] = Math.floor((val - 10) / 2);
    });
  }
  calculateSenses() {
    this.passivePerception = parseInt(this.modifiers.wisdom) + 10;
  }
  calculateAttack() {
    let attackRoll = dice(20);
    this.attack =
      attackRoll +
      parseInt(this.modifiers.strength) +
      parseInt(this.proficiency);
  }
}

// Monster(s)
const goblin = new Monster(
  "Goblin",
  15,
  6,
  30,
  2,
  [8, 14, 10, 10, 8, 8],
  shortsword,
  crossbow
);

// Object class
class Object {
  constructor(name, hp, ac) {
    (this.name = name), (this.hp = hp), (this.ac = ac);
  }
}

// Object(s)
const door = new Object("Door", 12, 2);

// GAME MECHANICS

// These variables determine the functions executed by the switch cases below
let currentGameStage;
let currentPopup = "";

// These variables determine the behaviour of the enemy and the post-combat options
let enemyAware = false;
let enemyPresent = true;

// Ability check (to be called when player or monster attempts an action)
const abilityCheck = (character, ability) => {
  return dice(20) + parseInt(character.modifiers[ability]);
};

// Calculates a character saving throw (to be called when something negative affects a character or monster)
const savingThrow = (character, ability) => {
  return dice(20) + parseInt(character.savingThrows[ability]);
};

// Displays the result of the ability on the popup
const displayAbilityCheck = (text, check, dice, modifier) => {
  gamePopupResult.innerHTML = `${text} check (d20+modifier)<br><strong>${check} (${dice}${modifier})</strong>`;
};

// Displays the result of a saving throw on the popup
const displaySavingThrow = (text, check, dice, modifier) => {
  gamePopupResult.innerHTML = `${text} saving throw (d20+modifier)<br><strong>${check} (${dice}${modifier})</strong>`;
};

// Displays the attack hit attempt on the popup
const displayAttackHit = (text, check, dice, ac, modifier) => {
  gamePopupResult.innerHTML = `${text}: to hit (d20+modifier)<br><strong>Target AC = ${ac}<br>${check} (${dice}${modifier})</strong><br>`;
};

// Displays the result of attack damage on the popup
const displayDamage = (text, attack, diceType, dice, modifier) => {
  gamePopupResult.innerHTML += `${text} attack (d${diceType}+modifier)<br><strong>${attack} (${dice}${modifier})</strong>`;
};

// Shows player stats during game
gameStatsBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
  player.getHitPointsHTML(statsHitPoints);
  player.getEquipmentHTML(statsEquipment);
  menu.classList.remove("hidden");
  game.classList.add("hidden");
  statsContainer.classList.remove("hidden");
  statsBtn.classList.remove("hidden");
});

// Returns player to game from stats
statsBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
  menu.classList.add("hidden");
  statsContainer.classList.add("hidden");
  game.classList.remove("hidden");
});

// Loads the crypt enter game stage
const loadCryptEnter = () => {
  gameTitle.innerText = "Entering the Crypt";
  gameBtns[2].classList.remove("hidden");
  gameBtns[0].innerText = "Look around";
  gameBtns[2].innerText = "Approach the door";
  currentGameStage = "crypt enter";
};

// Handles the crypt look perception check
let cryptLookDC = 14;
const handleCryptLook = (DC) => {
  let perceptionCheck = abilityCheck(player, "wisdom");
  displayAbilityCheck(
    "Wisdom",
    perceptionCheck,
    rolledDice,
    player.modifiers.wisdom
  );
  if (perceptionCheck >= DC) {
    currentPopup = "crypt look success";
    gamePopup.classList.remove("hidden");
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You spot a pile of straw in the corner of the room. Normally you'd ingore such a thing, but you sense it might be worth taking a closer look.";
  } else {
    currentPopup = "crypt look failure";
    gamePopup.classList.remove("hidden");
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You notice nothing of interest beyond what you can already make out.";
  }
};

// Handles the crypt straw investigation check
let strawInspectDC1 = 12;
let strawInspectDC2 = 16;
const handleStrawInspect = (DC1, DC2) => {
  currentPopup = "straw inspect";
  let investigationCheck = abilityCheck(player, "intelligence");
  displayAbilityCheck(
    "Intelligence",
    investigationCheck,
    rolledDice,
    player.modifiers.intelligence
  );
  gamePopup.classList.remove("hidden");
  if (investigationCheck >= DC1 && investigationCheck < DC2) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You look over the straw. It's clear that a creature has been sleeping here recently, and you estimate that they were last here about an hour ago.";
  } else if (investigationCheck >= DC2) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "Out of the corner of your eye, you notice something glinting on the floor next to the pile of straw. You approach and pick up a small brass key, which you place in you pocket.";
    player.equipment.items.key = brassKey;
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You notice nothing of interest beyond what you can already make out.";
  }
};

// Loads the door approach text + options
const loadDoorApproach = () => {
  gameTitle.innerText = "You Approach the Door";
  gameBtns[2].classList.add("hidden");
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[0].innerText = "Try the door";
  gameBtns[1].innerText = "Investigate the door";
  currentGameStage = "door approach";
};

// Handles the door open attempt
const loadDoorAttempt = () => {
  currentPopup = "door try";
  gamePopupResult.classList.add("hidden");
  gamePopup.classList.remove("hidden");
  gamePopupTitle.innerText = "The door is locked";
  gamePopupMessage.innerText =
    "Your turn the latch but the door is locked from the other side.";
};

// Handles door force check
let doorForceDC = 20;
const handleDoorForce = (DC) => {
  let strengthCheck = abilityCheck(player, "strength");
  displayAbilityCheck(
    "Strength",
    strengthCheck,
    rolledDice,
    player.modifiers.strength
  );
  gamePopup.classList.remove("hidden");
  if (strengthCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You lean back and put all of your strength into a shoulder charge. The door's hinges splinter away from the wall and it falls to the ground with a large crash.";
    enemyAware = true;
    currentPopup = "door force success";
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "You put all your weight behind the door but it's unless - it won't budge.";
    currentPopup = "door force failure";
  }
};

// Handles the door inspection check
let doorInspectDC = 10;
const handleDoorInspect = (DC) => {
  currentGameStage = "door inspect";
  currentPopup = "door inspect";
  let investigationCheck = abilityCheck(player, "intelligence");
  displayAbilityCheck(
    "Intelligence",
    investigationCheck,
    rolledDice,
    player.modifiers.intelligence
  );
  gamePopup.classList.remove("hidden");
  if (investigationCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You inspect the door more closely. It may be locked, but you notice a weak spot - a crack in one of the central planks. You also discern that the lock might be susceptable to thieves tools or magic.";
    doorUnlockDC = 8;
    door.hp = 6;
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in this chamber. You see a door, nothing special about it.";
  }
};

// Handles the door unlock check
let doorUnlockDC = 14;
const handleDoorUnlock = (DC) => {
  currentPopup = "door unlock";
  let unlockCheck = "";
  if (player.class === "Cleric") {
    unlockCheck = player.spells.knock.calculateSpellHit(player);
    displayAttackHit(
      player.spells.knock.name,
      unlockCheck,
      rolledDice,
      DC,
      `+${parseInt(player.modifiers.wisdom) + parseInt(player.proficiency)}`
    );
  } else {
    unlockCheck =
      abilityCheck(player, "dexterity") + parseInt(player.proficiency);
    displayAbilityCheck(
      "Dexterity",
      unlockCheck,
      rolledDice,
      `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
    );
  }
  gamePopup.classList.remove("hidden");
  if (unlockCheck >= DC) {
    currentPopup = "unlock success";
    gamePopupTitle.innerText = "Success!";
    if (player.class === "Cleric") {
      gamePopupMessage.innerText =
        "The spell finds its target. There is a loud knocking sound, before the latch undoes itself and the door creaks open.";
      enemyAware = true;
    } else {
      gamePopupMessage.innerText =
        "You have to work the lock with a lockpick, but before long you find the final tumbler and the door swings open.";
    }
  } else {
    currentPopup = "unlock failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "This lock is to complex to be undone by the tools you possess.";
  }
};

// Handles the door attack mechanic
const handleObjectAttack = (object) => {
  enemyAware = true;
  gamePopup.classList.remove("hidden");
  let doorAttack =
    player.equipment.weapons.meleeWeapon.calculateWeaponDamage(player);
  object.hp = object.hp - doorAttack;
  displayDamage(
    "Melee",
    doorAttack,
    player.equipment.weapons.meleeWeapon.damageDie,
    rolledDice,
    player.modifiers[player.equipment.weapons.meleeWeapon.modifier]
  );
  console.log(object);
  if (object.hp <= 0) {
    currentPopup = "door attack success";
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "Your weapon carves through door and smashes the latch to pieces, with a loud crash. The door swings open.";
  } else {
    currentPopup = "door attack fail";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The door shows signs of damage. Another attack might do it.";
  }
};

// Loads the hallway stage
let trapStatusHallway = "enabled";
let trapNoticedHallway = false;
const loadHallway = () => {
  gameTitle.innerText = "Through the Hallway";
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[0].innerText = "Proceed down the hallway";
  if (player.class === "Rogue") {
    gameBtns[1].innerText = "Check for traps";
  } else {
    gameBtns[1].classList.add("hidden");
  }
  gameBtns[2].classList.add("hidden");
  gameBtns[3].classList.add("hidden");
  currentGameStage = "hallway";
};

// Handles the triggering of the hallway trap
let trapTriggerDC = 15;
const handleHallwayTrapTrigger = (DC) => {
  let dexteritySave = savingThrow(player, "dexterity");
  displaySavingThrow(
    "Dexterity",
    dexteritySave,
    rolledDice,
    player.savingThrows.dexterity
  );
  gamePopupTitle.innerText = "Trap Triggered!";
  if (trapNoticedHallway === true) {
    gamePopupMessage.innerHTML =
      "You fumble with your tools and the trap is triggered.";
  } else {
    gamePopupMessage.innerHTML =
      "You hear a snap. You look down and see that your foot has triggered a wire.";
  }
  gamePopupMessage.innerHTML +=
    " A crossbow bolt flies out of a machanism in the wall.";
  let trapDamage = dice(4) + 1;
  if (dexteritySave < DC) {
    gamePopupMessage.innerHTML += `The bolt pierces your torso. You suffer ${trapDamage} points of damage.`;
  } else {
    trapDamage = Math.floor(trapDamage / 2);
    let plural = "";
    if (trapDamage > 1) {
      plural = "s";
    }
    gamePopupMessage.innerHTML += `You manage to dodge a direct hit. The bolt grazes your shoulder. You only suffer ${trapDamage} point${plural} of damage.`;
  }
  player.hitPointsCurrent = player.hitPointsCurrent - trapDamage;
  gamePopup.classList.remove("hidden");
  trapStatusHallway = "disabled";
  currentPopup = "trap trigger";
  if (player.hitPointsCurrent <= 0) {
    currentPopup = "player death";
  }
};

//Handles the hallway trap test
const handleHallwayCheck = () => {
  currentPopup = "hallway proceed";
  if (trapStatusHallway === "enabled") {
    handleHallwayTrapTrigger(trapTriggerDC);
  } else {
    loadMainChamber();
  }
};

// Handles the check for finding the hallway trap
let trapCheckDC = 14;
const handleTrapCheckHallway = (DC) => {
  let trapCheck = abilityCheck(player, "intelligence");
  console.log(trapCheck);
  displayAbilityCheck(
    "Investigation (intelligence)",
    trapCheck,
    rolledDice,
    `+${parseInt(player.modifiers.intelligence) + parseInt(player.proficiency)}`
  );
  if (trapCheck > DC) {
    currentPopup = "trap check success";
    trapNoticedHallway = true;
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You take a first step into the passageway, when you notice something touching your ankle. You look down and see that one more step would have triggered a trip wire.";
  } else {
    currentPopup = "trap check failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The light is dim in the passageway. You see nothing of concern.";
  }
  gamePopup.classList.remove("hidden");
};

// Handles the hallway trap disable attempt
let trapDisableDC = 12;
const handleTrapDisableHallway = (DC) => {
  currentPopup = "trap disable";
  let dexterityCheck =
    abilityCheck(player, "dexterity") + parseInt(player.proficiency);
  displayAbilityCheck(
    "Dexterity",
    dexterityCheck,
    rolledDice,
    `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
  );
  gamePopup.classList.remove("hidden");
  if (dexterityCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You find a mechanism on the wall. You bend down and get to work wih your thieves' tools. The mechanism clicks and the wire slackens - the trap is disabled.";
    trapStatusHallway = "disabled";
  } else {
    handleHallwayTrapTrigger(trapTriggerDC);
  }
};

// Loads the main chamber and handles enemy hide mechanic
let perceptionCheckDC;
const loadMainChamber = () => {
  gameTitle.innerText = "In the Main Chamber";
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[0].innerText = "Look around";
  gameBtns[1].innerText = "Enter the chamber";
  gameBtns[2].classList.add("hidden");
  gameBtns[3].classList.add("hidden");
  currentGameStage = "main chamber";
  if (enemyAware === true) {
    perceptionCheckDC = abilityCheck(goblin, "dexterity");
    console.log("Enemy hide = " + perceptionCheckDC);
  } else {
    perceptionCheckDC = 6;
  }
};

// Handles the main chamber perception check
const handleMainChamberLook = (DC) => {
  let perceptionCheck = abilityCheck(player, "wisdom");
  displayAbilityCheck(
    "Wisdom (perception)",
    perceptionCheck,
    rolledDice,
    player.modifiers.wisdom
  );
  if (perceptionCheck >= DC) {
    if (enemyAware === true) {
      currentPopup = "chamber perception success aware";
      gamePopupTitle.innerText = "Success!";
      gamePopupMessage.innerText =
        "You glance around the room, eagle-eyed. In the far corner, behind a pillar, you notice a goblin watching you. Its bow is drawn.";
    } else {
      currentPopup = "chamber perception success unaware";
      gamePopupTitle.innerText = "Success!";
      gamePopupMessage.innerText =
        "You glance around the room, eagle-eyed. You notice a figure holding a torch in the far corner. You'll need to enter the chamber to take a closer look.";
    }
  } else {
    currentPopup = "chamber perception failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "It's even darker in this main chamber. You see nothing beyond what you can already make out.";
  }
  gamePopup.classList.remove("hidden");
};

// Handles the player entering the main chamber
const mainChamberEnter = () => {
  if (enemyAware === true) {
    currentPopup = "enemy surprise";
    gamePopupTitle.innerText = "Arrow Incoming!";
    gamePopupMessage.innerText =
      "Out of nowhere, an arrow flies out of the dark.";
    handleEnemyRangedAttack(goblin, player.armourClass);
  } else {
    loadEnemyAhead();
  }
  if (player.hitPointsCurrent <= 0) {
    currentPopup = "player death";
  }
};

// Loads the options for the confrontation with an alterted enemy
const loadEnemyReady = () => {
  loadEnemyAhead();
  gameBtns[2].classList.add("hidden");
};

// Loads the options for a surpise round on the enemy
const loadEnemyAhead = () => {
  gameTitle.innerText = "Enemy Ahead";
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[2].classList.remove("hidden");
  gameBtns[0].innerText = "Attack it";
  gameBtns[1].innerText = "Try to reason with it";
  gameBtns[2].innerText = "Sneak up behind it";
  gameBtns[3].classList.add("hidden");
  currentGameStage = "enemy ahead";
};

// Handles the player suprise range and melee attacks on the enemy
const handlePlayerSurpriseAttack = () => {
  if (playerRange === "ranged") {
    handlePlayerRangedAttack(goblin.armourClass, goblin);
  } else {
    handlePlayerMeleeAttack(goblin.armourClass, goblin);
  }
  currentPopup = "player surprise";
};

const handlePlayerSurpriseMeleeAttack = () => {
  currentPopup = "player surprise";
};

// Calculates and diplays player ranged attack
const handlePlayerRangedAttack = (DC, enemy) => {
  gamePopupTitle.innerText = "Ranged Attack";
  gamePopupMessage.innerText = "You attack the enemy from range.";
  let rangedAttack;
  if (player.class === "Cleric") {
    rangedAttack = player.spells.sacredFlame.calculateSpellHit(player);
    displayAttackHit(
      player.spells.sacredFlame.name,
      rangedAttack,
      rolledDice,
      DC,
      `+${parseInt(player.modifiers.wisdom) + parseInt(player.proficiency)}`
    );
    if (rangedAttack >= DC) {
      let rangeDamage = player.spells.sacredFlame.calculateSpellDamage();
      displayDamage(
        "Sacred Flame",
        rangeDamage,
        player.spells.sacredFlame.damageDie,
        rolledDice,
        ""
      );
      gamePopupMessage.innerText += ` You cast Sacred Flame and it's body is briefly engulfed in holy fire. It takes ${rangeDamage} points of damage.`;
    } else {
      gamePopupMessage.innerText += ` You cast Sacred Flame and but they quickly step to the side, avoiding the holy fire.`;
    }
  } else {
    rangedAttack =
      player.equipment.weapons.rangedWeapon.calculateWeaponHit(player);
    console.log(rangedAttack);
    displayAttackHit(
      "Ranged weapon",
      rangedAttack,
      rolledDice,
      DC,
      `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
    );
    let projectile;
    if (player.class === "Rogue") {
      projectile = "crossbow bolt";
    } else {
      projectile = "throwing axe";
    }
    if (rangedAttack >= DC) {
      let rangeDamage =
        player.equipment.weapons.rangedWeapon.calculateWeaponDamage(player);
      displayDamage(
        "Ranged",
        rangeDamage,
        player.equipment.weapons.rangedWeapon.damageDie,
        rolledDice,
        player.modifiers[player.equipment.weapons.rangedWeapon.modifier]
      );
      gamePopupMessage.innerText += ` Your ${projectile} pierces its armour. It takes ${rangeDamage} points of damage.`;
      enemy.hitPointsCurrent = enemy.hitPointsCurrent - rangeDamage;
    } else {
      gamePopupMessage.innerText += ` But the low light distracts you and the ${projectile} sails wide.`;
    }
  }
  gamePopup.classList.remove("hidden");
};

//  Calculates and diplays player melee attack
const handlePlayerMeleeAttack = (DC, enemy) => {
  gamePopupTitle.innerText = "Melee Attack";
  gamePopupMessage.innerText = `You attack the enemy with your ${player.equipment.weapons.meleeWeapon.name.toLowerCase()}.`;
  let meleeAttack =
    player.equipment.weapons.meleeWeapon.calculateWeaponHit(player);
  console.log(meleeAttack);
  displayAttackHit(
    "Melee weapon",
    meleeAttack,
    rolledDice,
    DC,
    `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
  );
  if (meleeAttack >= DC) {
    let meleeDamage =
      player.equipment.weapons.meleeWeapon.calculateWeaponDamage(player);
    displayDamage(
      "Melee",
      meleeDamage,
      player.equipment.weapons.meleeWeapon.damageDie,
      rolledDice,
      player.modifiers[player.equipment.weapons.meleeWeapon.modifier]
    );
    gamePopupMessage.innerText += ` Your ${player.equipment.weapons.meleeWeapon.name.toLowerCase()} pierces its armour. It takes ${meleeDamage} points of damage.`;
    enemy.hitPointsCurrent = enemy.hitPointsCurrent - meleeDamage;
  } else {
    gamePopupMessage.innerText += ` But the low light distracts you and the blow misses.`;
  }
  gamePopup.classList.remove("hidden");
};

// Handles player stealth check
let stealthCheck;
const playerStealth = (testText) => {
  stealthCheck = abilityCheck(player, "dexterity");
  displayAbilityCheck(
    testText,
    stealthCheck,
    rolledDice,
    player.modifiers.dexterity
  );
};

// Variable to determine the player distance from enemy
let playerRange = "ranged";

// Handles the player sneak test against the enemy's passive perception
const playerSneakUp = (DC) => {
  playerStealth("Dexterity (stealth)");
  if (stealthCheck >= DC) {
    currentPopup = "stealth success";
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerHTML =
      "You creep up behind the goblin, quiet as the night. They remain oblivious to your presence and seem to be fixated on the wall.";
    playerRange = "melee";
  } else {
    currentPopup = "stealth failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerHTML =
      "You creep up behind the goblin, quiet as the night. However, you fail to notice a shallow puddle on the floor in the middle of the chamber. The slight splash of your foot alerts the goblin. They turn around and draw their weapon.";
  }
  gamePopup.classList.remove("hidden");
};

// Handles the player pickpocket test against the enemy's passive perception
const playerPickpocket = (DC) => {
  playerStealth("Dexterity (slight-of-hand)");
  if (stealthCheck >= DC) {
    currentPopup = "pickpocket success";
    gamePopupTitle.innerText = "Success!";
    if (player.equipment.items.key) {
      gamePopupMessage.innerHTML =
        "You silently check the goblin's pockets, but find nothing.";
    }
    gamePopupMessage.innerHTML =
      "You silently check the goblin's pockets, and pull out a small brass key, which you take for yourself.";
  } else {
    currentPopup = "pickpocket failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerHTML =
      "You reach into the goblin's pockets, trying to be as gentle as you can, but your finger catches on a loose thread. They turn around, alarmed, and draw their weapon.";
  }
  gamePopup.classList.remove("hidden");
};

// Handles player pursuasion attempt
let persuasionDC = 19;
let enemyHostile = true;
const playerPersuade = (DC) => {
  const persuasionCheck = abilityCheck(player, "charisma");
  displayAbilityCheck(
    "Charisma (persuasion)",
    persuasionCheck,
    rolledDice,
    player.modifiers.charisma
  );
  if (persuasionCheck >= DC) {
    currentPopup = "persuasion success";
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerHTML =
      "The goblin is alarmed by your attempt to reason with it, and its wits are no match for yours. You convince it to leave the crypt and never come back.";
    enemyPresent = false;
    enemyHostile = false;
  } else {
    currentPopup = "persuasion failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerHTML =
      "The goblin is alarmed by your attempt to reason with it, but it isn't convinced by your measly words. It readies itself for an attack.";
  }
  gamePopup.classList.remove("hidden");
};

// Loads combat
const loadCombat = () => {
  gameBtns[1].classList.add("hidden");
  gameBtns[2].classList.add("hidden");
  gameBtns[3].classList.add("hidden");
  gameTitle.innerText = "You are Entering Combat";
  gameBtns[0].classList.remove("hidden");
  gameBtns[0].innerText = "Roll Intiiative";
  currentGameStage = "initiative";
};

// Handles the roll for intiative (i.e., begins combat)
let orderOfCombat;
const rollInitiative = () => {
  const enemyInitiative = abilityCheck(goblin, "dexterity");
  const playerInitiative = abilityCheck(player, "dexterity");
  displayAbilityCheck(
    "Dexterity (initiative)",
    playerInitiative,
    rolledDice,
    player.modifiers.dexterity
  );
  gamePopupResult.innerHTML += `<br><br>The enemy rolled ${enemyInitiative}.`;
  if (playerInitiative > enemyInitiative) {
    orderOfCombat = "player";
  } else if (playerInitiative < enemyInitiative) {
    orderOfCombat = "enemy";
  } else {
    handleHigherDexterity(player, goblin);
  }
  if (orderOfCombat === "player") {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText = "You go first.";
    currentPopup = "player first";
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText = "The enemy goes first.";
    currentPopup = "enemy first";
  }
  gamePopup.classList.remove("hidden");
};

// Handles dexterity comparison between player and enemy (if intiative rolls are equal)
const handleHigherDexterity = () => {
  if (player.abilities.dexterity >= goblin.abilities.dexterity) {
    orderOfCombat = "player";
  } else {
    orderOfCombat = "enemy";
  }
};

// Loads the player's options during combat (one option per turn)
const loadPlayerTurn = () => {
  gameTitle.innerText = "Combat: Your Turn";
  gamePopupResult.classList.remove("hidden");
  gameBtns[0].classList.remove("hidden");
  gameBtns[1].classList.remove("hidden");
  if (player.equipment.potions.healingPotionStandard) {
    gameBtns[2].classList.remove("hidden");
  } else {
    gameBtns[2].classList.add("hidden");
  }
  gameBtns[0].innerText = "Attack";
  if (playerRange === "ranged") {
    gameBtns[1].innerText = "Move Closer";
  } else {
    gameBtns[1].innerText = "Move Away";
  }
  gameBtns[2].innerText = "Drink health potion";
  gameBtns[3].classList.add("hidden");
  currentGameStage = "combat";
  currentPopup = "player turn";
};

// Handles player attack options
const handlePlayerAttack = (range, enemy) => {
  if (range === "melee") {
    handlePlayerMeleeAttack(enemy.armourClass, enemy);
  } else {
    handlePlayerRangedAttack(enemy.armourClass, enemy);
  }
  if (enemy.hitPointsCurrent < 1) {
    currentPopup = "enemy death";
  }
  console.log(enemy.hitPointsCurrent);
};

// Loads the movement options during combat
const loadMovementOption = (range) => {
  if (range === "melee") {
    gamePopupTitle.innerText = "You Move Back";
    gamePopupMessage.innerHTML =
      "You dodge an incoming blow, and take some backwards steps, readying yourself to attack from range.";
    playerRange = "ranged";
  } else {
    gamePopupTitle.innerText = "You Move Forward";
    gamePopupMessage.innerHTML = `You draw and raise your ${player.equipment.weapons.meleeWeapon.name.toLowerCase()}, charging up to the Goblin`;
    playerRange = "melee";
  }
  gamePopupResult.classList.add("hidden");
  gamePopup.classList.remove("hidden");
};

// Handles health potion use
const handleHealthPotion = (potion) => {
  const potionHealing = potion.calculateHealing(player);
  gamePopupTitle.innerText = "Time to Heal";
  gamePopupResult.innerHTML += `${potion.name} (${potion.healingDieAmount}d4+${potion.healingBonus})`;
  gamePopupMessage.innerHTML = `Avoiding any incoming attacks, you reach into your pocket and quickly unstopper a healing potion. Your health is restored by ${potionHealing} hit points.`;
  delete player.equipment.potions.healingPotionStandard;
  if (player.hitPointsCurrent > player.hitPointsMax) {
    player.hitPointsCurrent = player.hitPointsMax;
  }
  gamePopup.classList.remove("hidden");
};

// Handles enemy turn in combat
const handleEnemyTurn = (enemy) => {
  gamePopupTitle.innerText = "The Enemy's Turn";
  if (player.hitPointsCurrent < 7 && playerRange === "ranged") {
    gamePopupTitle.innerText = "The Enemy Charges You";
    gamePopupMessage.innerHTML = `The ${enemy.name} draws its shortsword, raises it above it's head and rushes towards you.`;
    gamePopupResult.classList.add("hidden");
    gamePopup.classList.remove("hidden");
    playerRange = "melee";
  } else if (playerRange === "ranged") {
    enemyTurnRanged(goblin);
  } else {
    enemyTurnMelee(goblin);
  }
  currentPopup = "enemy turn";
  if (player.hitPointsCurrent <= 0) {
    currentPopup = "player death";
  }
};

// Handles the enemy ranged turn
const enemyTurnRanged = (enemy) => {
  gamePopupMessage.innerText = `The ${enemy.name} attacks you from range.`;
  handleEnemyRangedAttack(goblin, player.armourClass);
};

// Handles enemy melee turn
const enemyTurnMelee = (enemy) => {
  gamePopupMessage.innerText = `The ${
    enemy.name
  } attacks with their ${enemy.meleeWeapon.name.toLowerCase()}.`;
  handleEnemyMeleeAttack(goblin, player.armourClass);
};

// Handles enemy ranged attack
const handleEnemyRangedAttack = (enemy, DC) => {
  let rangedAttack;
  rangedAttack = enemy.rangedWeapon.calculateWeaponHit(enemy);
  console.log(rangedAttack);
  displayAttackHit(
    "Ranged weapon",
    rangedAttack,
    rolledDice,
    DC,
    `+${parseInt(enemy.modifiers.dexterity) + parseInt(enemy.proficiency)}`
  );
  if (rangedAttack >= DC) {
    let rangeDamage = enemy.rangedWeapon.calculateWeaponDamage(enemy);
    displayDamage(
      "Ranged",
      rangeDamage,
      enemy.rangedWeapon.damageDie,
      rolledDice,
      enemy.modifiers[enemy.rangedWeapon.modifier]
    );
    gamePopupMessage.innerText += ` The arrow pierces your skin. You take ${rangeDamage} points of damage.`;
    player.hitPointsCurrent = player.hitPointsCurrent - rangeDamage;
  } else {
    gamePopupMessage.innerText += ` But the arrow sails wide.`;
  }
  gamePopup.classList.remove("hidden");
};

// Handles enemy melee attack
const handleEnemyMeleeAttack = (enemy, DC) => {
  let meleeAttack = enemy.meleeWeapon.calculateWeaponHit(enemy);
  displayAttackHit(
    "Melee weapon",
    meleeAttack,
    rolledDice,
    DC,
    `+${parseInt(enemy.modifiers.dexterity) + parseInt(enemy.proficiency)}`
  );
  if (meleeAttack >= DC) {
    let meleeDamage = enemy.meleeWeapon.calculateWeaponDamage(enemy);
    displayDamage(
      "Melee",
      meleeDamage,
      enemy.meleeWeapon.damageDie,
      rolledDice,
      enemy.modifiers[enemy.meleeWeapon.modifier]
    );
    gamePopupMessage.innerText += ` The blade slashes across your body. You take ${meleeDamage} points of damage.`;
    player.hitPointsCurrent = player.hitPointsCurrent - meleeDamage;
  } else {
    gamePopupMessage.innerText += ` But you manage to parry the blow.`;
  }
  gamePopup.classList.remove("hidden");
};

// Loads the player death screen
const loadGameOver = () => {
  gameTitle.innerText = "You Died!";
  gameBtns[2].classList.add("hidden");
  gameBtns[0].innerText = "Try again";
  gameBtns[1].classList.remove("hidden");
  gameBtns[1].innerText = "Create a new character";
  currentGameStage = "player death";
};

// Load the final game options
const loadGameEnd = () => {
  gameTitle.innerText = "Adventure Complete!";
  gameBtns[2].classList.add("hidden");
  gameBtns[0].classList.add("hidden");
  gameBtns[1].classList.remove("hidden");
  gameBtns[1].innerText = "Create a new character";
  currentGameStage = "game end";
};

// Loads combat success screen
const loadEnemyDeath = () => {
  gameBtns[1].classList.add("hidden");
  gameTitle.innerText = "Enemy Defeated!";
  gameBtns[2].classList.remove("hidden");
  gameBtns[0].innerText = "Look around";
  if (enemyPresent === true || enemyHostile === true) {
    gameBtns[1].classList.remove("hidden");
    gameBtns[1].innerText = "Search the body";
  }
  gameBtns[2].innerText = "Exit the crypt";
  currentGameStage = "combat success";
  perceptionCheckDC = 12;
};

// Handles post-combat perception check
let chestPerceptionDC = 8;
const handlePostCombatLook = (DC) => {
  let perceptionCheck = abilityCheck(player, "wisdom");
  displayAbilityCheck(
    "Wisdom (perception)",
    perceptionCheck,
    rolledDice,
    player.modifiers.wisdom
  );
  if (perceptionCheck >= DC) {
    currentPopup = "final look success";
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "With your enemy vanquished, you look around. You notice a chest in the far corner.";
    currentGameStage = "chest spotted";
  } else {
    currentPopup = "final look failure";
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "Without the enemy's torchlight, it's even darker in this main chamber. You see nothing beyond what you can already make out.";
    gameBtns[0].classList.add("hidden");
  }
  gamePopup.classList.remove("hidden");
};

// Loads the chest approach options
let trapStatusChest = "enabled";
let trapNoticedChest = false;
let chestThievesTools = true;
const loadChestApproach = () => {
  gameTitle.innerText = "You Approach the Chest";
  gameBtns[1].classList.add("hidden");
  gameBtns[2].classList.add("hidden");
  gameBtns[0].innerText = "Try to open it";
  if (player.class === "Rogue" && trapNoticedChest === false) {
    gameBtns[1].classList.remove("hidden");
    gameBtns[1].innerText = "Check for traps";
  }
  currentGameStage = "chest approach";
};

// Loads chest open attempt
const handleChestLocked = () => {
  gamePopupTitle.innerText = "The chest is locked";
  game;
  if (player.equipment.items.key) {
    gamePopupMessage.innerText =
      "The chest is firmly locked, but the brass key you found looks like it might fit the keyhole.";
    currentPopup = "chest key";
  } else {
    gamePopupMessage.innerText =
      "The chest is firmly locked. It looks like it requires a key.";
    currentPopup = "chest no key";
  }
  gamePopup.classList.remove("hidden");
};

// Loads successful chest open
const handleChestOpen = () => {
  gamePopupTitle.innerText = "A Treasure Map";
  gamePopupMessage.innerText =
    "The chest springs open. All you find inside is a map. It details an area you don't recognise but features a spot marked with an X. Time for another adventure!";
  currentPopup = "map retrieved";
  gamePopup.classList.remove("hidden");
};

// Handle chesk lockpick attempt
let chestLockDC = 15;
const handleChestUnlock = (DC) => {
  let unlockCheck =
    abilityCheck(player, "dexterity") + parseInt(player.proficiency);
  displayAbilityCheck(
    "Dexterity",
    unlockCheck,
    rolledDice,
    `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
  );
  gamePopup.classList.remove("hidden");
  if (unlockCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You have to work the lock with a lockpick, but before long you find the final tumbler and the chest clicks open.";
    currentPopup = "chest unlocked";
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "The lock is to complex for your skills and tools.";
    chestThievesTools = false;
  }
};

// Handles the chest trap check
const handleTrapCheckChest = (DC) => {
  let trapCheck = abilityCheck(player, "intelligence");
  console.log(trapCheck);
  displayAbilityCheck(
    "Investigation (intelligence)",
    trapCheck,
    rolledDice,
    `+${parseInt(player.modifiers.intelligence) + parseInt(player.proficiency)}`
  );
  if (trapCheck > 1) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You inspect the chest. You notice a tiny thread running between the lock mechanism and the base. It is indeed trapped.";
    trapNoticedChest = true;
  } else {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "There is almost no light in this corner, but you see nothing of concern.";
  }
  currentPopup = "chest check";
  gamePopup.classList.remove("hidden");
};

// Handle chest trap disable attempt
const handleTrapDisableChest = (DC) => {
  let dexterityCheck =
    abilityCheck(player, "dexterity") + parseInt(player.proficiency);
  displayAbilityCheck(
    "Dexterity",
    dexterityCheck,
    rolledDice,
    `+${parseInt(player.modifiers.dexterity) + parseInt(player.proficiency)}`
  );
  gamePopup.classList.remove("hidden");
  if (dexterityCheck >= DC) {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You find a mechanism on the back of the chest. You bend down and get to work wih your thieves' tools. The mechanism clicks and the thread slackens - the trap is disabled.";
    trapStatusChest = "disabled";
  } else {
    handleChestTrapTrigger(trapTriggerDC);
  }
};

// Load chest trap trigger effect
const handleChestTrapTrigger = (DC) => {
  let constitutionSave = savingThrow(player, "constitution");
  displaySavingThrow(
    "Constitution",
    constitutionSave,
    rolledDice,
    player.savingThrows.constitution
  );
  gamePopupTitle.innerText = "Trap Triggered!";
  if (trapNoticedChest === true) {
    gamePopupMessage.innerHTML =
      "You fumble with your tools and the trap is triggered.";
  } else {
    gamePopupMessage.innerHTML = "The lock mechanism turns. You hear a snap.";
  }
  gamePopupMessage.innerHTML +=
    " A cloud of poisonous gas emerges from underneath the chest.";
  let trapDamage = dice(4) + 1;
  if (constitutionSave < DC) {
    gamePopupMessage.innerHTML += `The poison fills your throat and burns your lungs. You suffer ${trapDamage} points of damage.`;
  } else {
    trapDamage = Math.floor(trapDamage / 2);
    let plural = "";
    if (trapDamage > 1) {
      plural = "s";
    }
    gamePopupMessage.innerHTML += `You manage to hold your breath and cover your face just in time. You only suffer ${trapDamage} point${plural} of damage.`;
  }
  player.hitPointsCurrent = player.hitPointsCurrent - trapDamage;
  gamePopup.classList.remove("hidden");
  trapStatusChest = "disabled";
  currentPopup = "chest trap trigger";
  if (player.hitPointsCurrent < 1) {
    currentPopup = "player death";
  }
};

// Handles the body search investigation check
let bodyInspectDC = 12;
const handleBodyInspect = (DC) => {
  currentPopup = "body inspect";
  let investigationCheck = abilityCheck(player, "intelligence");
  displayAbilityCheck(
    "Intelligence",
    investigationCheck,
    rolledDice,
    player.modifiers.intelligence
  );
  gamePopup.classList.remove("hidden");
  if (investigationCheck < DC || player.equipment.items.key) {
    gamePopupTitle.innerText = "Failure";
    gamePopupMessage.innerText =
      "You search the creature's pockets, but find nothing of interest.";
  } else {
    gamePopupTitle.innerText = "Success!";
    gamePopupMessage.innerText =
      "You search the creature's pockets and pull out a small brass key, which you take for yourself";
    player.equipment.items.key = brassKey;
  }
  gamePopup.classList.remove("hidden");
};

// Handles the try again button
const handleRestartGame = () => {
  gameBtns[1].classList.add("hidden");
  gameBtns[2].classList.add("hidden");
  loadCharacterStats();
  loadGame();
  reloadDefaultGameSettings();
};

// Reloads the game traps
const reloadDefaultGameSettings = () => {
  trapStatusHallway = "enabled";
  trapNoticedHallway = false;
  trapStatusChest = "enabled";
  trapNoticedChest = false;
  chestThievesTools = true;
  playerRange = "ranged";
  enemyAware = false;
  enemyHostile = true;
  enemyPresent = true;
  statsBtn.classList.add("hidden");
};

// Handles the create new character button
const handleCreateNewCharacter = () => {
  game.classList.add("hidden");
  abilitiesAll.classList.add("hidden");
  menu.classList.remove("hidden");
  menu.classList.remove("flex-start");
  btnRibbon.classList.remove("margin-top-auto");
  createContainer.classList.remove("hidden");
  creationMessage.classList.remove("hidden");
  creationMessage.innerText = "";
  creationMessage.classList.add("justified");
  creationMessage.style.marginTop = "0";
  btnRibbon.classList.remove("hidden");
  loadCreationMessage();
  nameForm.reset();
  document.querySelectorAll("select").forEach((selector) => {
    selector.selectedIndex = 0;
  });
  abilityBtn.forEach((btn) => {
    btn.classList.remove("hidden");
  });
  abilitiesSelector.forEach((selector) => {
    selector.classList.add("hidden");
  });
  abilityScore.forEach((score) => {
    score.innerText = "--";
  });
  abilityResetBtn.classList.add("hidden");
  delete player.name;
  delete player.class;
  delete player.species;
  player.abilities = {};
  abilityScoreList = [];
  ability.forEach((ability) => {
    ability.classList.add("hidden");
  });
  ability[0].classList.remove("hidden");
  abilityOptions.forEach((option) => {
    option.disabled = false;
  });
  abilitiesSelector.forEach((selector) => {
    selector[0].selected = true;
    selector[0].disabled = true;
    selector.disabled = false;
  });
  gameBtns[0].classList.remove("hidden");
  reloadDefaultGameSettings();
};

// Game switchboard
gameBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    switch (event.target.id) {
      case "a":
        switch (currentGameStage) {
          case "game start":
            loadCryptEnter();
            break;
          case "crypt enter":
            handleCryptLook(cryptLookDC);
            break;
          case "door approach":
            loadDoorAttempt();
            break;
          case "door inspect":
            handleObjectAttack(door);
            break;
          case "hallway":
            handleHallwayCheck();
            break;
          case "main chamber":
            handleMainChamberLook(perceptionCheckDC);
            break;
          case "enemy ahead":
            handlePlayerSurpriseAttack();
            break;
          case "initiative":
            rollInitiative();
            break;
          case "combat":
            handlePlayerAttack(playerRange, goblin);
            break;
          case "player death":
            handleRestartGame();
            break;
          case "combat success":
            handlePostCombatLook(chestPerceptionDC);
            break;
          case "chest spotted":
            loadChestApproach();
            break;
          case "chest approach":
            handleChestLocked();
            break;
          case "chest lockpick":
            handleChestUnlock(chestLockDC);
        }
        break;
      case "b":
        switch (currentGameStage) {
          case "crypt enter":
            handleStrawInspect(strawInspectDC1, strawInspectDC2);
            break;
          case "door approach":
            handleDoorInspect(doorInspectDC);
            break;
          case "hallway":
            handleTrapCheckHallway(trapCheckDC);
            break;
          case "main chamber":
            mainChamberEnter();
            break;
          case "enemy ahead":
            playerPersuade(persuasionDC);
            break;
          case "combat":
            loadMovementOption(playerRange);
            break;
          case "player death":
          case "game end":
            handleCreateNewCharacter();
            break;
          case "combat success":
          case "chest spotted":
            handleBodyInspect(bodyInspectDC);
            break;
          case "chest approach":
          case "chest lockpick":
            handleTrapCheckChest(trapCheckDC);
        }
        break;
      case "c":
        switch (currentGameStage) {
          case "crypt enter":
            loadDoorApproach();
            break;
          case "door approach":
            handleDoorForce(doorForceDC);
            break;
          case "door inspect":
            handleDoorForce(doorForceDC);
            break;
          case "hallway":
            handleTrapDisableHallway(trapDisableDC);
            break;
          case "enemy ahead":
            playerSneakUp(goblin.passivePerception);
            break;
          case "combat":
            handleHealthPotion(player.equipment.potions.healingPotionStandard);
            break;
          case "combat success":
          case "chest spotted":
            loadGameEnd();
            break;
          case "chest approach":
            handleTrapDisableChest(trapDisableDC);
        }
        break;
      case "d":
        switch (currentGameStage) {
          case "door inspect":
            handleDoorUnlock(doorUnlockDC);
            break;
          case "enemy ahead":
            playerPickpocket(goblin.passivePerception);
        }
    }
    console.log(currentGameStage);
  });
});

// Handles the popup continue button
gamePopupBtn.addEventListener("click", () => {
  gamePopup.classList.add("hidden");
  gamePopupResult.innerHTML = "";
  switch (currentPopup) {
    case "crypt look success":
      gameBtns[0].classList.add("hidden");
      gameBtns[1].classList.remove("hidden");
      gameBtns[1].innerText = "Investigate the straw";
      break;
    case "crypt look failure":
    case "chamber perception success unaware":
    case "chamber perception failure":
      gameBtns[0].classList.add("hidden");
      break;
    case "straw inspect":
    case "trap check failure":
    case "body inspect":
    case "chest trap check":
      gameBtns[1].classList.add("hidden");
      break;
    case "door try":
      gamePopupResult.classList.remove("hidden");
      gameBtns[0].classList.add("hidden");
      gameBtns[2].innerText = "Force the door";
      gameBtns[2].classList.remove("hidden");
      break;
    case "door force success":
      loadHallway();
      break;
    case "door force failure":
    case "trap disable":
      gameBtns[2].classList.add("hidden");
      break;
    case "trap trigger":
      gameBtns[1].classList.add("hidden");
      gameBtns[2].classList.add("hidden");
      break;
    case "door inspect":
      if (player.class === "Cleric" || player.class === "Rogue") {
        gameBtns[3].classList.remove("hidden");
      }
      if (player.class === "Cleric") {
        gameBtns[3].innerText = "Cast knock";
      } else {
        gameBtns[3].innerText = "Pick the lock";
      }
      gameBtns[1].classList.add("hidden");
      gameBtns[0].classList.remove("hidden");
      gameBtns[0].innerText = "Smash down the door";
      break;
    case "unlock failure":
    case "pickpocket success":
      gameBtns[3].classList.add("hidden");
      break;
    case "unlock success":
      loadHallway();
      break;
    case "door attack success":
      loadHallway();
      break;
    case "hallway proceed":
      break;
    case "trap check success":
      gameBtns[1].classList.add("hidden");
      gameBtns[2].classList.remove("hidden");
      gameBtns[2].innerText = "Disable the trap";
      break;
    case "chamber perception success aware":
      loadEnemyReady();
      break;
    case "enemy surprise":
    case "player surprise":
    case "stealth failure":
    case "pickpocket failure":
    case "persuasion failure":
      loadCombat();
      break;
    case "stealth success":
      gameBtns[2].classList.add("hidden");
      gameBtns[3].innerText = "Pickpocket the goblin";
      gameBtns[3].classList.remove("hidden");
      break;
    case "persuasion success":
    case "enemy death":
      loadEnemyDeath();
      break;
    case "player turn":
    case "enemy first":
      console.log(playerRange);
      gamePopupResult.classList.remove("hidden");
      handleEnemyTurn(goblin);
      break;
    case "player first":
    case "enemy turn":
      console.log(playerRange);
      loadPlayerTurn();
      break;
    case "player death":
      loadGameOver();
      break;
    case "final look failure":
      gameBtns[0].classList.add("hidden");
      break;
    case "final look success":
      gameBtns[0].innerText = "Approach the chest";
      break;
    case "chest key":
    case "chest unlocked":
      if (trapStatusChest === "enabled") {
        handleChestTrapTrigger(trapTriggerDC);
      } else {
        handleChestOpen();
      }
      break;
    case "chest trap trigger":
      handleChestOpen();
      break;
    case "chest no key":
      if (player.class === "Rogue" && chestThievesTools === true) {
        gameBtns[0].innerText = "Pick the lock";
        currentGameStage = "chest lockpick";
      } else {
        loadEnemyDeath();
        gameBtns[0].innerText = "Approach the chest";
        currentGameStage = "chest spotted";
      }
      break;
    case "chest check":
      if (trapNoticedChest === true) {
        gameBtns[2].classList.remove("hidden");
        gameBtns[2].innerText = "Disable the trap";
        gameBtns[1].classList.add("hidden");
      } else {
        gameBtns[1].classList.add("hidden");
      }
      console.log(trapNoticedChest);
      break;
    case "chest disabled":
      gameBtns[2].classList.add("hidden");
      currentPopup = "chest approach";
      break;
    case "map retrieved":
      loadGameEnd();
  }
  console.log(currentGameStage);
});

// POLYFILLS

// Polyfill for Object.entries
if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

// Polyfill for Object.keys
if (!Object.keys) {
  Object.keys = (function () {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
      dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor",
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (
        typeof obj !== "function" &&
        (typeof obj !== "object" || obj === null)
      ) {
        throw new TypeError("Object.keys called on non-object");
      }

      var result = [],
        prop,
        i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  })();
}
