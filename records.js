"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/19/2020
  Purpose: To provide the functionality that enables users to modify, add, and
    delete records and display them in a table.
*/

/*
  loadUserInformation retrieves the user from local storage if it exists. It
  then loads a summary of user info into the user information div as well as
  a button that links to the user information page if the user wishes to edit
  their profile.
*/
function loadUserInformation() {
  try {
    var user = JSON.parse(localStorage.getItem("user"));
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }
      
    console.log(e);
  }
  
  if (user != null) {
    $("#divUserSection").empty();
      
    var age = calcUserAge(user.DOB);
    
      $("#divUserSection").append("<p>User's Name: " + user.FirstName + " " + 
        user.LastName + "<br>Age: " + 
        age + "<br>Height: " + 
        user.Height + "<br>Weight: " + 
        user.Weight + "<br>BMI: " +
        user.BMI + "<br>Weight Status: " +
        user.WeightStatus +                         
        "<br>New Password: " + user.NewPassword + "</p>");
      $("#divUserSection").append("<a href='#pageUserInfo' data-mini='true' " + 
        "id='btnProfile' data-role='button' data-icon='edit' data-iconpos=" +
        "'left' data-inline='true'>Edit Profile</a>");
      $("#btnProfile").button();
  }
}

/*
  calcUserAge(DOB) takes in users' DOB and uses that and the current date to 
  calculate and return the their age. 
*/
function calcUserAge(DOB) {
  var today = new Date();
  var dob = new Date(DOB);
  var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
  return age;
}

/*
  click event for the add record button triggers an anonymous function that 
  refreshes the page and changes the value of btnSubmitRecord to Add.
*/
$("#btnAddRecord").click( function() {
  $("#btnSubmitRecord").val("Add");
  if ($("#btnSubmitRecord").hasClass("ui-btn-hidden")) {
    $("#btnSubmitRecord").button("refresh");  
  }
});

/*
  Adds a pageshow function to the pageNewRecord element that adds a new record 
  and clears out old info before the new record is added. It preloads the form 
  with previously entered and saved information while in editing mode.
*/
$("#pageNewRecord").on("pageshow", function() {
  var formOperation = $("#btnSubmitRecord").val();

  if (formOperation == "Add") {
    clearRecordForm();
  } else if (formOperation == "Edit") {
    showRecordForm($("#btnSubmitRecord").attr("indexToEdit"));
  }
});

/*
  clearRecordForm clears the value of all input on the New Record page and 
  returns true.
*/
function clearRecordForm() {
  $("#date").val("");
  $("#updateheight").val("");
  $("#updateweight").val("");
}

/*
  checkRecordForm checks and returns true if user input is valid, and false if not.
*/
function checkRecordForm() {
  if ($("#date").val() == "") {
     alert("You need to enter a date.");
  } else if ($("#date").val() > getCurrentDateFormatted()) {
    alert("The date can't be in the future.");
    return false;
  } else if ($("#updateheight").val() == "") {
    alert("You need to enter a height value.");
    return false;
  } else if (parseFloat($("#updateheight").val()) < 0) {
    alert("You can't have a negative height.");
    return false;
  } else if ($("#updatenewweight").val() == "") {
    alert("You need to enter a weight value.");
    return false;
  } else if (parseFloat($("#updateweight").val()) < 0) {
    alert("You can't have a negative weight.");
    return false;
  } else {
    return true;
  }
}

/*
  getCurrentDateFormatted returns the current date as "yyyy-mm-dd". It is compared 
  to date and DOB objects to ensure neither are in the future.
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
  Adds a submit form handler to the add record element. If the value of 
  the submit button is add, a new record will be added and the user directed 
  to pageRecords. If successful, it adds the record and saves it to local 
  storage; otherwise it will return false. If the value of the submit button 
  is "Edit" then the updated info will be saved to tbRecords, the page changed 
  to pageRecords, and the indexToEdit attribute removed.
*/
$("#AddRecord").submit( function() {
  var formOperation = $("#btnSubmitRecord").val();
    
  if (formOperation == "Add") {
    if (addRecord()) {
    $.mobile.changePage("#pageRecords");
    }
  } else if (formOperation == "Edit") {
    if (editRecord($("#btnSubmitRecord").attr("indexToEdit"))) {
      $.mobile.changePage("#pageRecords");
      $("#btnSubmitRecord").removeAttr("indexToEdit");
    }
  }
    
  return false;
});

/*
  addRecord will create a JSON object with the form information if checkRecordForm 
  is true. It will then JSON parse the current tbRecords; if it is null it will 
  add the JSON object to an empty array and sort it. Afterward, it save tbRecords 
  to local storage and inform the user their information was saved.
*/
function addRecord() {
  if (checkRecordForm()) {
    var updateBMI = ($("#updateweight").val() / Math.pow($("#updateheight").val(), 2) * 703).toFixed(2);
    var record = {
      "NewDate" : $("#date").val(),
      "UpdateHeight" : $("#updateheight").val(),
      "UpdateWeight" : $("#updateweight").val(),
      "UpdateBMI" : ($("#updateweight").val() / Math.pow($("#updateheight").val(), 2) * 703).toFixed(2),
      "UpdateWeightStatus" : determineWeightStatus(updateBMI)
    }
    
    try {
      var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        
      if (tbRecords == null) {
        tbRecords = [];
      }
        
      tbRecords.push(record);
      tbRecords.sort(compareDates);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();
        
      return true;
    } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if (e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
      
      console.log(e);
      
      return false;
    }
  } else {
    return false;
  }   
}

/*
  listRecords JSON parses the data from tbRecords and alerts the user if 
  it fails to load. It then populates the table with values of tbRecords that exist. 
  It initializes the HTML of the tblRecords element with column headings and 
  loop through the records, adding each to the table. Each record has its own 
  row and edit and delete buttons that call the callEdit(index) and callDelete(index) 
  functions, respectively. If there are no records, listRecords will set tbRecords to 
  an empty array and the element's HTML to an empty string.
*/
function listRecords() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
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
    
    if (tbRecords != null) {
      tbRecords.sort(compareDates);
        
      // Initializes the table
      $("#tblRecords").html(
        "<thead>" +
        "  <tr>" +
        "    <th>Date</th>" +
        "    <th>Height (in inches)</th>" +
        "    <th>Weight (in pounds)</th>" +
        "    <th>BMI</th>" +
        "    <th>Weight Status</th>" +
        "    <th>Edit</th>" +
        "    <th>Delete</th>" +
        "  </tr>" +
        "</thead>" +
        "<tbody>" +
        "</tbody>"
      );
        
      // Insert each record into table
      for (var i = 0; i < tbRecords.length; i++) {
        var rec = tbRecords[i];
        $("#tblRecords tbody").append(
          "<tr>" + 
          "  <td>" + rec.NewDate + "</td>" +
          "  <td>" + rec.UpdateHeight + "</td>" +
          "  <td>" + rec.UpdateWeight + "</td>" +
          "  <td>" + rec.UpdateBMI + "</td>" +
          "  <td>" + rec.UpdateWeightStatus + "</td>" +
          "  <td><a date-inline='true' data-mini='true' data-role='button'" +
          "href='#pageNewRecord' onclick='callEdit(" + i + ");' " + 
          "data-icon='edit' data-iconpos='notext'></a></td>" +
          "    <td><a data-inline='true' data-mini='true' data-role='button' " + 
          "href='#' onclick='callDelete(" + i + ");' data-icon='delete' " + 
          "data-iconpos='notext'></a></td>" +
          "</tr>"
        );
      }
        
      $("#tblRecords [data-role='button']").button();
    } else {
      $("#tblRecords").html("");
    }
  }

/*
  compareDates facilitates the sorting of records by taking in two date 
  values; if the first is greater than the second it will return 1, and 
  -1 if vice versa.
*/
function compareDates(date1, date2) {
  var d1 = new Date(date1.NewDate);
  var d2 = new Date(date2.NewDate);
    
  if (d1 > d2) {
    return 1;
  } else {
    return -1;
  }
}

/*
  Adds an event handler to the element btnClearHistory to erase tbRecords 
  from local storage, call listRecords, and notify the user that the records 
  have been deleted.
*/
$("#btnClearHistory").click( function() {
  try {
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
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

/*
  callDelete(index) calls the deleteRecord function with the given index and
  calls the listRecords function to update the table.
*/
function callDelete(index) {
  deleteRecord(index);
  listRecords();
}

/*
  deleteRecord(index) retrieves tbRecords from local storage and JSON parses it,
  splicing it at the index. If the length of tbRecords is 0, it will be removed
  from local storage; if not, it is saved there.
*/
function deleteRecord(index) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    
    tbRecords.splice(index, 1);
      
    if (tbRecords.length == 0) {
      localStorage.removeItem("tbRecords");
    } else {
        localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
    }
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

/*
  callEdit(index) sets the attribute indexToEdit of the submit button to a given 
  index. It also sets the value of the button to "Edit" and refreshes it.
*/
function callEdit(index) {
  $("#btnSubmitRecord").attr("indexToEdit", index);
  $("#btnSubmitRecord").val("Edit");
  if($("#btnSubmitRecord").hasClass("ui-btn-hidden")) {
    $("#btnSubmitRecord").button("refresh");
  }
}

/*
  showRecordForm(index) takes in the index of the record to be edited. After getting
  the tbRecords from local storage, it JSON parses it will then set each value in
  the Add New Record form to those values and alert the user if it fails.
*/
function showRecordForm(index) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    var rec = tbRecords[index];
    
    $("#date").val(rec.NewDate);
    $("#updateheight").val(rec.UpdateHeight);
    $("#updateweight").val(rec.UpdateWeight);
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

/*
  editRecord(index) will get tbRecords and JSON parse if in an index if checkRecordForm
  is true. After that it will set the record at the given index to the form's current
  values. It sorts tbRecords and saves it to local storage and lets the user know it
  was saved. Lastly, it calls the function clearRecordForm and listRecords.
*/
function editRecord(index) {
  if (checkRecordForm()) {
    try {
      var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      var updateBMI = ($("#updateweight").val() / Math.pow($("#updateheight").val(), 2) * 703).toFixed(2);
      tbRecords[index] = {
        "NewDate" : $("#date").val(),
        "UpdateHeight" : $("#updateheight").val(),
        "UpdateWeight" : $("#updateweight").val(),
        "UpdateBMI" : ($("#updateweight").val() / Math.pow($("#updateheight").val(), 2) * 703).toFixed(2),
        "UpdateWeightStatus" : determineWeightStatus(updateBMI)
        
      } 
        
      tbRecords.sort(compareDates);
      localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
      alert("Saving Information");
      clearRecordForm();
      listRecords();
        
      return true;
    } catch(e) {
      if (window.navigator.vendor === "Google Inc.") {
        if (e === DOMException.QUOTA_EXCEEDED_ERR) {
          alert("Error: Saving to local storage");
        }
      } else if (e === QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
      
      console.log(e);
      
      return false;
    }
  } else {
    return false;
  }    
}

/*
  determineWeightStatus(updateBM?I) classifies the user as underweight, healthy 
  weight, overweight, or obese based on their BMI.
*/
function determineWeightStatus(updateBMI){
  if (updateBMI < 18.5){
    return "Underweight";
  } else if (updateBMI < 25) {
    return "Healthy Weight";
  } else if (updateBMI < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}