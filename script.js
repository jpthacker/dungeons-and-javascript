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
