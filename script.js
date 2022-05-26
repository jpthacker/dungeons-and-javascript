// Sharacter creation menu elements
const start = document.querySelector(".start");
const menu = document.querySelector(".menu--start");
const titleContainer = document.querySelector(".title");
const titleMain = document.querySelector(".title__main");
const createContainer = document.querySelector(".character-creation");
const creationMessage = document.querySelector(".character-creation__message");
const nameForm = document.querySelector(".name");
const errorMessage = document.querySelector(".character-creation__error");
const classSelector = document.querySelector(".class__selector");
const speciesSelector = document.querySelector(".species__selector");
const abilitiesAll = document.querySelector(".ability__container");
const ability = document.querySelectorAll(".ability");
const abilitiesSelector = document.querySelectorAll(".ability__selector");
const abilityScore = document.querySelectorAll(".ability__score");
const startBtn = document.querySelector(".btn--start");
const continueBtn = document.querySelectorAll(".btn--continue");
const creationBtn = document.querySelector(".btn--creation");
const abilityBtn = document.querySelectorAll(".ability__btn");
const backBtn = document.querySelector(".btn--back");

let currentCreationStage = "start";

// Loads the character creation message
const loadCreationMessage = () => {
  titleContainer.classList.add("title--top");
  titleMain.classList.add("title__main--top");
  menu.classList.remove("menu--start");
  menu.classList.add("menu");
  document.querySelector(".menu__title").innerText = "Create Your Adventurer";
  start.innerHTML = "";
  createContainer.classList.remove("character-creation--start");
  backBtn.classList.add("hidden");
  creationBtn.classList.remove("hidden");
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
  console.log(playerName);
  if (playerName !== "") {
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
  if (playerClass !== "") {
    console.log(playerClass);
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
  if (playerSpecies !== "") {
    console.log(playerSpecies);
    speciesSelector.classList.add("hidden");
    creationMessage.innerHTML = "";
    creationMessage.classList.add("hidden");
    document.querySelector(".menu__title").innerText =
      "Roll For Your Six Ability Scores";
    abilitiesAll.classList.remove("hidden");
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
  } else {
    errorMessage.innerHTML = "Please select a species";
    errorMessage.classList.remove("hidden");
  }
};

//Handles the character creation menu buttons
continueBtn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
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
    }
  });
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
  }
});

// Handles the name entry form
let playerName = "";
nameForm.addEventListener("input", (event) => {
  playerName = event.target.value;
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the class selector
let playerClass = "";
classSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "cleric":
      creationMessage.innerHTML = `A priestly champion who wields divine magic in service of a higher power<br/><br/>Primary Ability: Wisdom<br/>Saves: Wisdom & Charisma
      `;
      playerClass = "cleric";
      break;
    case "fighter":
      creationMessage.innerHTML = `A master of martial combat, skilled with a variety of weapons and armour<br/><br/>Primary Ability: Strength or Dexterity<br/>Saves: Strength & Constitution
      `;
      playerClass = "fighter";
      break;
    case "rogue":
      creationMessage.innerHTML = `A scoundrel who uses stealth and trickery to overcome obstacles and enemies<br/><br/>Primary Ability: Dexterity<br/>Saves: Dexterity & Intelligence
      `;
      playerClass = "rogue";
  }
  errorMessage.innerHTML = "";
  errorMessage.classList.add("hidden");
});

// Handles the species selector
let playerSpecies = "";
speciesSelector.addEventListener("change", (event) => {
  event.preventDefault();
  creationMessage.classList.remove("hidden");
  creationMessage.style.marginTop = "10vh";
  switch (event.target.value) {
    case "dwarf":
      creationMessage.innerHTML = `Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal<br/><br/>Species Trait:<br/>+2 Strength
      `;
      playerSpecies = "dwarf";
      break;
    case "elf":
      creationMessage.innerHTML = `Elves are a magical people of otherworldly grace, living in the world but not entirely part of it<br/><br/>Species Trait:<br/>+2 Dexterity
      `;
      playerSpecies = "elf";
      break;
    case "human":
      creationMessage.innerHTML = `Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds<br/><br/>Species Trait:<br/>+1 to All Ability Scores
      `;
      playerSpecies = "human";
  }
  // Reminds the player of their class choice
  switch (playerClass) {
    case "cleric":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Cleric (Primary Ability: Wisdom, Saves: Wisdom & Charisma)";
      break;
    case "fighter":
      creationMessage.innerHTML +=
        "<br/><br/>Your Class: Fighter (Primary Ability: Strength or Dexterity, Saves: Strength & Constitution)";
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

// Handles the ability buttons and generates dice rolls for abilities (removes the lowest number of four d6 dice rolls and totals the rolls)
let currentAbilityScore;
let abilityScoreList = [];
for (let i = 0; i < abilityBtn.length; i++) {
  abilityBtn[i].addEventListener("click", (event) => {
    if (abilityScoreList.length < 6) {
      event.preventDefault();
      dice(6, 4);
      abilityRoll = rolledDice.sort().filter((_, i) => i);
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
