// Start and Character creation menu elements
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
const abilities = document.querySelector(".ability__container");
const abilitiesSelector = document.querySelectorAll(".ability__selector");
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
  dice(6, 4);
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
      "Roll For Your Ability Scores";
    abilities.classList.remove("hidden");
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
