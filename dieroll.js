"use strict";
/*
  Assignment: Chapter 4 Die Roll Simulator App
  Author: Brittny Eaddy
  Date: 7/28/2020
  Purpose: These functions ensure there are no empty fields or invalid data 
    entries; users will be prompted to enter valid input if so. It takes in
    user input from the number of rolls textbox and rolls a six-sided die up
    to 25 times, randomly generating and displaying the results in a dynamic 
    table.
*/

/*
  initialize adds event listeners to validate the number of die rolls is between 
  1 and 25 once it loses focus.
*/
function initialize() {
  var dieRollInput = document.getElementById("roll");
  dieRollInput.addEventListener("blur", validateDieRoll);
}

/*
  validateDieRoll alerts the user when the die roll number element's value is 
  less than 1 or greater than 25. It also clears any invalid values entered by
  the user.
*/
function validateDieRoll() {
  var dieRollInput = document.getElementById("roll");
  if (dieRollInput.value != ""){
    if (dieRollInput.value < 1 || dieRollInput.value > 25){
        alert("You can only roll up to 25 times");
        diceRollInput.value = "";
    }
  }
}

/*
  update ensures valid entries are made for number of rolls. Once these 
  two criteria are met update will run several functions based on user
  input to generate random die roll results and present them in a table.
*/
function update() {
  var dieRoll = document.getElementById("roll").value;

  if (dieRoll === ""){
    alert("You must enter a valid value for die roll");
  } else {
    rollDie(dieRoll);
  }  
}

/*
  rollDie generates a table with die results, taking in the dieRoll
  parameter (a valid value the user enters in the number of rolls textbox) 
  to only roll the die between 1 and 25 times as specified by the user.
  The variable randomDieArray is filled with random values--the face 
  number of the die rolled--by a for loop.
*/
function rollDie(dieRoll) {
  var randomDieArray = [];
  
  for (var i = 0; i < dieRoll; i++) {
    var randomDie = (Math.floor(Math.random() * 6) + 1);
    randomDieArray.push(randomDie);
    
  }
  updateTable(randomDieArray);
}

/*
  updateTable takes in values of the randomDie array and displays the
  results in a table.
*/
function updateTable(randomDieArray) {
  var dataTable = document.getElementById("data");
  dataTable.innerHTML = "";

  // create rows of data based on the randomDieRoll array
  for (var i = 0; i < randomDieArray.length; i++) {
    var row = dataTable.insertRow(-1);
    var dieRollCell = row.insertCell(0)
    var randomDieCell = row.insertCell(1);

    dieRollCell.innerHTML = i + 1;
    randomDieCell.innerHTML = randomDieArray[i];
  }
       
  // create header row
  var thead = dataTable.createTHead();
  var row = thead.insertRow(0);
  var tableHeaders = ["Roll Number", "Die Number"];
  for (var i = 0; i < tableHeaders.length; i++) {
    var headerCell = document.createElement("th");
    headerCell.innerHTML = tableHeaders[i];
    row.appendChild(headerCell);
  }
}
