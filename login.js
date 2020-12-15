"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/19/2020
  Purpose: To provide functionality to the keypad for password entry. It
    also verifies whether the passcode entered is in local storage; if so 
    it will grant users access to the app.
*/

/*
  addValueToPassword retrieves the value from the passcode element; the 
  delete key removes the last character from the current value, setting it 
  as the new value. Otherwise, it will add the button's value to the passcode 
  and set it as the new value.
*/
function addValueToPassword(key) {
  var currVal = $("#passcode").val();
  if (key == "bksp") {
    $("#passcode").val(currVal.substring(0, currVal.length - 1));
  } else {
    $("#passcode").val(currVal.concat(key));
  }
}

/*
  getPassword checks whether local storage is available and will alert the user 
  if it is not. If local storage is available the function will check if the user 
  exists there and return the saved password associated with that user; otherwise 
  it will return a default password of "2345".
*/
function getPassword() {
  if (typeof(Storage) == "undefined") {
    alert("Your browser does not support HTML5 localStorage. Try upgrading.");
  } else if (localStorage.getItem("user") != null) {
    return JSON.parse(localStorage.getItem("user")).NewPassword;
  } else {
    return "2345"; // Default password
  }
}

/*
   onclick event triggers an anonymous function when the Enter button is pressed. The 
   anonymous function retrieves the passcode element value then calls the getPassword 
   function to ensure the values match. If they do, the user enters the app and is 
   greeted by the disclaimer page. If the passwords do not match an alert will inform 
   the user the password is incorrect and ask them to try again.
*/
$("#btnEnter").click( function() {
  var enteredPasscode = $("#passcode").val();
  var storedPasscode = getPassword();

  if(enteredPasscode == storedPasscode) {
    // checks whether user has agreed to disclaimer
    if (localStorage.getItem("agreedToLegal") == null) {
      $("#btnEnter").attr("href", "#legalNotice").button();
    } else if (localStorage.getItem("agreedToLegal") == "true") {
        // checks whether a user profile has been saved
      if (localStorage.getItem("user") == null) {
        $("#btnEnter").attr("href", "#pageUserInfo").button();
      } else {
          $("#btnEnter").attr("href", "#pageMenu").button();
      }
    }
  } else {
      alert("Incorrect password, please try again.");
  }
});

/*
  An anonymous function triggered by an onclick event with the #noticeYes element button 
  stores user's agreement to the disclaimer in local storage. The user must acknowledge 
  and agree to the disclaimer before proceeding.
*/
$("#noticeYes").click( function() {
  try {
    localStorage.setItem("#agreedtoLegal", "true");
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
});