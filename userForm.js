"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/19/2020
  Purpose: To validate data and stores it in localStorage, as well as 
    display currently saved information.
*/

/*
  checkUserForm ensures required fields are filled with valid values. 
  The function will return true if all are valid and false if any of 
  them aren't.
*/
function checkUserForm() {
  if ($("#FirstName").val() == "") {
    alert("You need to enter your first name.");
    return false;
  } else if ($("#LastName").val() == "") {
    alert("You need to enter your last name.");
    return false;
  } else if ($("#DOB").val() == "") {
    alert("You need to enter your birthdate.");
    return false;
  } else if ($("#DOB").val() > getCurrentDateFormatted()) {
    alert("Your birthdate can't be in the future.");
    return false;
  } else if ($("#height").val() == "") {
    alert("You need to enter your height.");
    return false;
  } else if ($("#height") <= 0) {
    alert("Your height must be greater than 0.");
    return false;
  } else if ($("#weight").val() == "") {
    alert("You need to enter your weight.");
    return false;
  } else if ($("#height").val() <= 0) {
    alert("Your weight must be greater than 0.");
    return false;
  } else {
    return true;
  }
}

/*
  getCurrentDateFormatted returns the current date as "yyyy-mm-dd". It 
  is compared to the date and DOB objects to ensure neither are in the future.
*/
function getCurrentDateFormatted() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    
    var formattedDate = year + "-" +
      (("" + month).length < 2 ? "0" : "") + month + "-" +
      (("" + day).length < 2 ? "0" : "") + day;
    
    return formattedDate;
}

/*
  Anonymous function triggered by a submit event handler for the update 
  button that calls the function saveUserForm to make sure a completed, 
  valid form is submitted.
*/
$("#UserInfo").submit( function() {
  saveUserForm();
  return false;
});

/*
  saveUserForm calls checkUserForm to validate user input. It then creates 
  a JSON object with the entered values, saving it to "user" in local storage 
  before loading to the menu page. It alerts the user if it fails to save.
*/
function saveUserForm() {
  if (checkUserForm()) {
    
    var BMI = ($("#weight").val() / Math.pow($("#height").val(), 2) * 703).toFixed(2);
    var user = {
      "FirstName" : $("#FirstName").val(),
      "LastName" : $("#LastName").val(),
      "NewPassword" : $("#changePassword").val(),
      "DOB" : $("#DOB").val(),
      "Height" : $("#height").val(),
      "Weight" : $("#weight").val(),
      "BMI" : ($("#weight").val() / Math.pow($("#height").val(), 2) * 703).toFixed(2),
      "WeightStatus" : determineWeightStatus(BMI)
    };
      
    try {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Saving Information");
        
      $.mobile.changePage("#pageMenu");
      window.location.reload();
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
        
      console.log(e);
    }
  }
}

/*
  showUserForm retrieves user info from local storage and sets the inputs 
  to the saved data.
*/
function showUserForm() {
    try {
      var user = JSON.parse(localStorage.getItem("user"));
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
      
      console.log(e);
    }
    
    if(user != null) {
      $("#FirstName").val(user.FirstName);
      $("#LastName").val(user.LastName);
      $("#DOB").val(user.DOB);
      $("#changePassword").val(user.NewPassword);
      $("#height").val(user.Height);
      $("#weight").val(user.Weight);
    }
  }

/*
  determineWeightStatus(BMI) classifies the user as underweight, healthy 
  weight, overweight, or obese based on their BMI.
*/
function determineWeightStatus(BMI){
  if (BMI < 18.5){
    return "Underweight";
  } else if (BMI < 25) {
    return "Healthy Weight";
  } else if (BMI < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}