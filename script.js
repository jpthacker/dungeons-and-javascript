// Character creation global menu elements
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

// Player object and functions
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
  creationMessage.classList.remove("justified");
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
  if (abilityModifierList.length > 0) {
    abilityResetBtn.classList.remove("hidden");
  }
};

// Loads the character stats
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
    document.querySelector(".menu__title").innerText =
      "Your Adventurer's Stats";
    player.proficiencyBonus = 2;
    player.walkingSpeed = 30;
    player.hitPoints = parseInt(player.constitutionModifier) + player.hitDie;
    console.log(player);
    player.getAbilities(statsAbilities);
    errorMessage.classList.add("hidden");
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
      errorMessage.innerHTML = "";
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
      player.hitDie = 12;
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

// Handles DnD standard dice rolls (original code courtesy of BryanBansbach (https://github.com/BryanBansbach/DiceRoller) - with subsequent edits)
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

// Function to calculate the modifiers for each ability
let currentModifierRaw;
let currentModifierSign;
const calculateAbilityModifier = (abilityScore) => {
  currentModifierRaw = Math.floor((abilityScore - 10) / 2);
  if (currentModifierRaw >= 0) {
    currentModifierSign = "+" + currentModifierRaw;
  } else currentModifierSign = currentModifierRaw;
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
      let abilityRoll = rolledDice.sort().filter((_, i) => i);
      currentAbilityScore = abilityRoll.reduce((a, b) => a + b);
      abilityScoreList.push(currentAbilityScore);
      calculateAbilityModifier(currentAbilityScore);
      abilityModifierList.push(currentModifierSign);
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
  abilitiesSelector[i].addEventListener("change", (event) => {
    let abilityOption = event.target.value;
    abilityResetBtn.classList.remove("hidden");
    switch (abilityOption) {
      case "1":
        if (player.species === "dwarf") {
          player.strength = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.strength);
          player.strengthModifier = currentModifierSign;
        } else {
          player.strength = abilityScoreList[i];
          player.strengthModifier = abilityModifierList[i];
        }
        console.log(player.strength);
        abilitiesSelector.forEach((selector) => {
          selector[1].disabled = true;
        });
        break;
      case "2":
        if (player.species === "elf") {
          player.dexterity = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.dexterity);
          player.dexterityModifier = currentModifierSign;
        } else {
          player.dexterity = abilityScoreList[i];
          player.dexterityModifier = abilityModifierList[i];
        }
        console.log(player.dexterity);
        abilitiesSelector.forEach((selector) => {
          selector[2].disabled = true;
        });
        break;
      case "3":
        player.constitution = abilityScoreList[i];
        player.constitutionModifier = abilityModifierList[i];
        console.log(player.constitution);
        abilitiesSelector.forEach((selector) => {
          selector[3].disabled = true;
        });
        break;
      case "4":
        player.intelligence = abilityScoreList[i];
        player.intelligenceModifier = abilityModifierList[i];
        console.log(player.intelligence);
        abilitiesSelector.forEach((selector) => {
          selector[4].disabled = true;
        });
        break;
      case "5":
        if (player.species === "human") {
          player.wisdom = abilityScoreList[i] + 2;
          calculateAbilityModifier(player.wisdom);
          player.wisdomModifier = currentModifierSign;
        } else {
          player.wisdom = abilityScoreList[i];
          player.wisdomModifier = abilityModifierList[i];
        }
        console.log(player.wisdom);
        abilitiesSelector.forEach((selector) => {
          selector[5].disabled = true;
        });
        break;
      case "6":
        player.charisma = abilityScoreList[i];
        player.charismaModifier = abilityModifierList[i];
        console.log(player.charisma);
        abilitiesSelector.forEach((selector) => {
          selector[6].disabled = true;
        });
    }
    abilitiesSelector[i].disabled = true;
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
    selector.disabled = false;
  });
  console.log(abilityModifierList);
});
