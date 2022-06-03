// Character creation menu elements
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
const statsContainer = document.querySelector(".stats__container");
const statsAbilities = document.querySelector(".stats__abilities");
const continueBtn = document.querySelector(".btn--continue");
const abilityBtn = document.querySelectorAll(".ability__btn");
const abilityResetBtn = document.querySelector(".btn--reset");
const backBtn = document.querySelector(".btn--back");

const player = {
  getAbilities(skillsContainer) {
    skillsContainer.innerHTML = `
    <h4 class="stats__title">ABILITIES</h4>
    <ul class="stats__skills-list">
    <li class="stats__list-item">
      Strength - ${this.strength} (${this.strengthModifier})
    </li>
    <li class="stats__list-item">
      Dexterity - ${this.dexterity} (${this.dexterityModifier})
    </li>
    <li class="stats__list-item">
      Constitution - ${this.constitution} (${this.constitutionModifier})
    </li>
    <li class="stats__list-item">
      Intelligence - ${this.intelligence} (${this.intelligenceModifier})
    </li>
    <li class="stats__list-item">
      Wisdom - ${this.wisdom} (${this.wisdomModifier})
    </li>
    <li class="stats__list-item">
      Charisma - ${this.charisma} (${this.charismaModifier})
    </li>
  </ul>
  `;
  },
};

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
  document.querySelector(".menu__title").innerText =
    "Enter the Name of Your Adventurer";
  backBtn.classList.remove("hidden");
  currentCreationStage = "name";
};

// Loads the class selector
const loadClassSelector = () => {
  console.log(player.playerName);
  if (player.playerName) {
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
};

// Loads the character stats
const loadCharacterStats = () => {
  createContainer.classList.add("hidden");
  abilityResetBtn.classList.add("hidden");
  statsContainer.classList.remove("hidden");
  document.querySelector(".menu__title").innerText = "Your Adventurer's Stats";
  player.proficiencyBonus = 2;
  player.walkingSpeed = 30;
  player.hitPoints = player.hitDie + player.constitutionModifier;
  console.log(player);
  player.getAbilities(statsAbilities);
};

//Handles the character creation menu buttons
continueBtn.addEventListener("click", (event) => {
  event.preventDefault();
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
  switch (currentCreationStage) {
    case "name":
      nameForm.classList.add("hidden");
      errorMessage.innerHTML = "";
      errorMessage.classList.add("hidden");
      creationMessage.classList.remove("hidden");
      creationMessage.style.marginTop = "0";
      continueBtn.innerHTML = "Start";
      loadCreationMessage();
      break;
    case "class":
      loadNameForm();
      classSelector.classList.add("hidden");
      errorMessage.innerHTML = "";
      errorMessage.classList.add("hidden");
      break;
    case "species":
      speciesSelector.classList.add("hidden");
      errorMessage.innerHTML = "";
      errorMessage.classList.add("hidden");
      loadClassSelector();
      break;
    case "abilities":
      loadSpeciesSelector();
      abilitiesAll.classList.add("hidden");
      abilityResetBtn.classList.add("hidden");
  }
});

// Handles the name entry form
nameForm.addEventListener("input", (event) => {
  player.playerName = event.target.value;
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
      player.class = "cleric";
      player.hitDie = 8;
      break;
    case "fighter":
      creationMessage.innerHTML = `A master of martial combat, skilled with a variety of weapons and armour<br/><br/>Primary Ability: Strength or Dexterity<br/>Saves: Strength & Constitution
      `;
      player.class = "fighter";
      player.hitDie = 10;
      break;
    case "rogue":
      creationMessage.innerHTML = `A scoundrel who uses stealth and trickery to overcome obstacles and enemies<br/><br/>Primary Ability: Dexterity<br/>Saves: Dexterity & Intelligence
      `;
      player.class = "rogue";
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
      player.species = "dwarf";
      break;
    case "elf":
      creationMessage.innerHTML = `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it<br/><br/>Species Trait:<br/>+2 Dexterity
      `;
      player.species = "elf";
      break;
    case "human":
      creationMessage.innerHTML = `Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds<br/><br/>Species Trait:<br/>+2 Wisdom
      `;
      player.species = "human";
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

// Handles DnD standard dice rolls (courtesy of BryanBansbach (https://github.com/BryanBansbach/DiceRoller))
let rolledDice = [];
const dice = (diceType, diceNumber) => {
  rolledDice = [];
  if (
    diceType === 4 ||
    diceType === 6 ||
    diceType === 8 ||
    diceType === 10 ||
    diceType === 12 ||
    diceType === 20
  ) {
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
    return "You must choose the right type of dice (4, 6, 8, 10, 12, 20)";
  }
};

// Function to calculate the modifiers for each ability
let currentModifier;
const calculateAbilityModifier = (abilityScore) => {
  switch (abilityScore) {
    case 1:
      currentModifier = -5;
      break;
    case 2:
    case 3:
      currentModifier = -4;
      break;
    case 4:
    case 5:
      currentModifier = -3;
      break;
    case 6:
    case 7:
      currentModifier = -2;
      break;
    case 8:
    case 9:
      currentModifier = -1;
      break;
    case 10:
    case 11:
      currentModifier = +0;
      break;
    case 12:
    case 13:
      currentModifier = +1;
      break;
    case 14:
    case 15:
      currentModifier = +2;
      break;
    case 16:
    case 17:
      currentModifier = +3;
      break;
    case 18:
    case 19:
      currentModifier = +4;
      break;
    case 20:
      currentModifier = +5;
  }
};

// Handles the ability buttons and generates dice rolls for abilities (removes the lowest number of four d6 dice rolls and totals the rolls)
let currentAbilityScore;
let abilityScoreList = [];
let abilityModifierList = [];
for (let i = 0; i < abilityBtn.length; i++) {
  abilityBtn[i].addEventListener("click", (event) => {
    if (abilityScoreList.length < 6) {
      event.preventDefault();
      dice(6, 4);
      abilityRoll = rolledDice.sort().filter((_, i) => i);
      currentAbilityScore = abilityRoll.reduce((a, b) => a + b);
      abilityScoreList.push(currentAbilityScore);
      calculateAbilityModifier(currentAbilityScore, currentModifier);
      abilityModifierList.push(currentModifier);
      abilityScore[i].innerHTML = currentAbilityScore;
      abilityBtn[i].classList.add("hidden");
      abilitiesSelector[i].classList.remove("hidden");
      if (i < 5) {
        ability[i + 1].classList.remove("hidden");
      }
      console.log(abilityScoreList);
      console.log(abilityModifierList);
    } else {
      errorMessage.innerHTML = "Press reset to re-roll your scores";
      errorMessage.classList.remove("hidden");
    }
  });
}

// Handles the assignment of ability scores
for (let i = 0; i < abilitiesSelector.length; i++) {
  abilitiesSelector[i].addEventListener("blur", (event) => {
    let abilityOption = event.target.value;
    abilityResetBtn.classList.remove("hidden");
    switch (abilityOption) {
      case "strength":
        if (player.species === "dwarf") {
          player.strength = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.strength);
          player.strengthModifier = currentModifier;
        } else {
          player.strength = abilityScoreList[i];
          player.strengthModifier = abilityModifierList[i];
        }
        console.log(player.strength);
        abilitiesSelector.forEach((selector) => {
          selector[1].disabled = true;
        });
        break;
      case "dexterity":
        if (player.species === "elf") {
          player.dexterity = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.dexterity);
          player.dexterityModifier = currentModifier;
        } else {
          player.dexterity = abilityScoreList[i];
          player.dexterityModifier = abilityModifierList[i];
        }
        console.log(player.dexterity);
        abilitiesSelector.forEach((selector) => {
          selector[2].disabled = true;
        });
        break;
      case "constitution":
        player.constitution = abilityScoreList[i];
        player.constitutionModifier = abilityModifierList[i];
        console.log(player.constitution);
        abilitiesSelector.forEach((selector) => {
          selector[3].disabled = true;
        });
        break;
      case "intelligence":
        player.intelligence = abilityScoreList[i];
        player.intelligenceModifier = abilityModifierList[i];
        console.log(player.intelligence);
        abilitiesSelector.forEach((selector) => {
          selector[4].disabled = true;
        });
        break;
      case "wisdom":
        if (player.species === "human") {
          player.wisdom = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.wisdom);
          player.wisdomModifier = currentModifier;
        } else {
          player.wisdom = abilityScoreList[i];
          player.wisdomModifier = abilityModifierList[i];
        }
        console.log(player.wisdom);
        abilitiesSelector.forEach((selector) => {
          selector[5].disabled = true;
        });
        break;
      case "charisma":
        player.charisma = abilityScoreList[i];
        player.charismaModifier = abilityModifierList[i];
        console.log(player.charisma);
        abilitiesSelector.forEach((selector) => {
          selector[6].disabled = true;
        });
    }
  });
}

// Resets the ability selectors
abilityResetBtn.addEventListener("click", (event) => {
  event.preventDefault();
  abilityOptions.forEach((option) => {
    option.disabled = false;
  });
  abilitiesSelector.forEach((selector) => {
    selector[0].selected = true;
    selector[0].disabled = true;
  });
  console.log(abilityModifierList);
});
