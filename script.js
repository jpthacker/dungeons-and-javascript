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
const statsSkills = document.querySelector(".stats__skills");
const continueBtn = document.querySelector(".btn--continue");
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
  equipment: {},
  attack: 0,
  damage: 0,
  assignAbilities() {
    for (let i = 0; i < abilityList.length; i++) {
      if (
        (abilityList[i] === "wisdom" && this.class === "Cleric") ||
        (abilityList[i] === "strength" && this.class === "Fighter") ||
        (abilityList[i] === "dexterity" && this.class === "Rogue")
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
  calculateArmourClass() {
    switch (this.class) {
      case "Cleric":
        player.armourClass = parseInt(this.modifiers.dexterity) + 10;
        break;
      case "Fighter":
        player.armourClass = 16;
        break;
      case "Rogue":
        player.armourClass = parseInt(this.modifiers.dexterity) + 11;
    }
  },
  formatStats(nestedObject) {
    Object.entries(nestedObject).forEach(([key, val]) => {
      if (val >= 0) {
        nestedObject[key] = "+" + val;
      }
    });
  },
  assignEquipment(equipment) {
    equipment.potion = "Health Potion";
    switch (this.class) {
      case "Cleric":
        equipment.weaponMelee = mace;
        equipment.armour = "Shield";
        break;
      case "Fighter":
        equipment.weaponMelee = battleaxe;
        equipment.weaponRanged = throwingAxe;
        equipment.armour = "Plate Armour";
        break;
      case "Rogue":
        equipment.weaponMelee = dagger;
        equipment.weaponRanged = crossbow;
        equipment.tools = "Thieves Tools";
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
    <h4 class="stats__title stats__name">${this.name}</h4>
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
    <h4 class="stats__walking-speed-no">${this.walkingSpeed}ft.</h4>
    <h5 class="stats__walking-speed-text2">SPEED</h5>
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
    abilitiesContainer.innerHTML = `
    <div class="stats__ability--strength">
      <h5 class="stats__ability-text--strength">STRENGTH</h5>
      <h4 class="stats__ability-modifier--strength">${this.modifiers.strength}</h4>
      <h4 class="stats__ability-no--strength">${this.abilities.strength}</h4>
    </div>
    <div class="stats__ability--dexterity">
      <h5 class="stats__ability-text--dexterity">DEXTERITY</h5>
      <h4 class="stats__ability-modifier--dexterity">${this.modifiers.dexterity}</h4>
      <h4 class="stats__ability-no--dexterity">${this.abilities.dexterity}</h4>
    </div>
    <div class="stats__ability--constitution">
      <h5 class="stats__ability-text--constitution">CONSTITUTION</h5>
      <h4 class="stats__ability-modifier--constitution">${this.modifiers.constitution}</h4>
      <h4 class="stats__ability-no--constitution">${this.abilities.constitution}</h4>
    </div>
    <div class="stats__ability--intelligence">
      <h5 class="stats__ability-text--intelligence">INTELLIGENCE</h5>
      <h4 class="stats__ability-modifier--intelligence">${this.modifiers.intelligence}</h4>
      <h4 class="stats__ability-no--intelligence">${this.abilities.intelligence}</h4>
    </div>
    <div class="stats__ability--wisdom">
      <h5 class="stats__ability-text--wisdom">WISDOM</h5>
      <h4 class="stats__ability-modifier--wisdom">${this.modifiers.wisdom}</h4>
      <h4 class="stats__ability-no--wisdom">${this.abilities.wisdom}</h4>
    </div>
    <div class="stats__ability--charisma">
      <h5 class="stats__ability-text--charisma">CHARISMA</h5>
      <h4 class="stats__ability-modifier--charisma">${this.modifiers.charisma}</h4>
      <h4 class="stats__ability-no--charisma">${this.abilities.charisma}</h4>
    </div>
  `;
  },
  getSavingThrowsHTML(savingThrowsContainer) {
    savingThrowsContainer.innerHTML = `
    <h4 class="stats__saving-throws-title">Saving Throws</h4>
    <div class="stats__saving-throws--strength">
      <h5 class="stats__saving-throws-text--strength">STRENGTH</h5>
      <h4 class="stats__saving-throws-modifier--strength">${this.savingThrows.strength}</h4>
    </div>
    <div class="stats__saving-throws--dexterity">
      <h5 class="stats__saving-throws-text--dexterity">DEXTERITY</h5>
      <h4 class="stats__saving-throws-modifier--dexterity">${this.savingThrows.dexterity}</h4>
    </div>
    <div class="stats__saving-throws--constitution">
      <h5 class="stats__saving-throws-text--constitution">CONSTITUTION</h5>
      <h4 class="stats__saving-throws-modifier--constitution">${this.savingThrows.constitution}</h4>
    </div>
    <div class="stats__saving-throws--intelligence">
      <h5 class="stats__saving-throws-text--intelligence">INTELLIGENCE</h5>
      <h4 class="stats__saving-throws-modifier--intelligence">${this.savingThrows.intelligence}</h4>
    </div>
    <div class="stats__saving-throws--wisdom">
      <h5 class="stats__saving-throws-text--wisdom">WISDOM</h5>
      <h4 class="stats__saving-throws-modifier--wisdom">${this.savingThrows.wisdom}</h4>
    </div>
    <div class="stats__saving-throws--charisma">
      <h5 class="stats__saving-throws-text--charisma">CHARISMA</h5>
      <h4 class="stats__saving-throws-modifier--charisma">${this.savingThrows.charisma}</h4>
    </div>
    `;
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
};

// Weapon class
class Weapon {
  constructor(name, range, modifier, damageDie) {
    (this.name = name),
      (this.range = range),
      (this.modifier = modifier),
      (this.damageDie = damageDie);
  }
  calculateWeaponDamage(user) {
    return dice(this.damageDie) + parseInt(user.modifiers[this.modifier]);
  }
  getWeaponHTML() {}
}

// Melee weapons
const battleaxe = new Weapon("BattleAxe", 5, "strength", 8);
const dagger = new Weapon("Dagger", 5, "dexterity", 4);
const mace = new Weapon("Mace", 5, "Strength", 6);
const shortsword = new Weapon("Shortsword", 5, "dexterity", 6);

// Ranged weapons
const crossbow = new Weapon("Crossbow", 80, "dexterity", 6);
const throwingAxe = new Weapon("Throwing Axe", 20, "strength", 6);

let currentCreationStage = "start";

// Loads the character creation message
const loadCreationMessage = () => {
  titleContainer.classList.add("title--top");
  titleMenu.style.marginBottom = "0vh";
  menu.classList.remove("menu--start");
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
    player.formatStats(player.modifiers);
    player.formatStats(player.savingThrows);
    player.calculateArmourClass();
    player.calculateAttack();
    player.damage = player.equipment.weaponMelee.calculateWeaponDamage(player);
    console.log(player);
    player.getNameHTML(statsName);
    player.getProficiencyHTML(statsProficiency);
    player.getHitPointsHTML(statsHitPoints);
    player.getWalkingSpeedHTML(statsWalkingSpeed);
    player.getInitiativeHTML(statsInitiative);
    player.getArmourClassHTML(statsArmourClass);
    player.getAbilitiesHTML(statsAbilities);
    player.getSavingThrowsHTML(statsSavingThrows);
    player.getSensesHTML(statsSenses);
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
