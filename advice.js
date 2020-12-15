"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/23/2020
  Purpose: To provide the functionality to display advice and a corner
  gauge based on users' BMI records.
*/

/*
  showAdvice tries to retrieve tbRecords from local storage and 
  will alert the user and return them to the menu page if none are 
  found. Otherwise it will gather data from and provide advice based 
  on existing records. It also adds a rectangle for background then
  calls drawAdviceCanvas.
*/
function showAdvice() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      
    if (tbRecords == null) {
      alert("No records exist yet.");
        
      $(location).attr("href", "#pageMenu");
    } else {
      var user = JSON.parse(localStorage.getItem("user"));
        
      var mostRecentIndex = tbRecords.length - 1;
      var UpdateBMI = tbRecords[mostRecentIndex].UpdateBMI;
        
      var canvas = document.getElementById("AdviceCanvas");
      var context = canvas.getContext("2d");
      context.fillStyle = "#C0C0C0";
      context.fillRect(0, 0, 550, 550);
      context.font = "22px Arial";
      drawAdviceCanvas(context, UpdateBMI);
    }
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
}

/*
  drawAdviceCanvas takes in the parameters context and the BMI value 
  to determine advice, adding text to the AdviceCanvas stating the
  value recommendations are based on (recent BMI). After that it calls
  writeAdvice and drawMeter.
*/
function drawAdviceCanvas(context, UpdateBMI) {
  context.font = "22px Arial";
  context.fillStyle = "black";
  context.fillText("Your current BMI is " + UpdateBMI + ".", 25, 320);
    
  if (UpdateBMI >= 18.5 && UpdateBMI <= 24.9) {
    context.fillText("Your BMI is within normal range.", 25, 350);
    levelWrite(context, UpdateBMI);
    levelMeter(context, UpdateBMI);
  } else if (UpdateBMI >= 25 && UpdateBMI <= 30) {
    context.fillText("Your BMI is slightly above normal.", 25, 350);
    levelWrite(context, UpdateBMI);
    levelMeter(context, UpdateBMI);
  } else if (UpdateBMI > 30) {
    context.fillText("Your BMI is high.", 25, 350);
    levelWrite(context, UpdateBMI);
    levelMeter(context, UpdateBMI);
  } else {
    context.fillText("Your BMI is low.", 25, 350);
    levelWrite(context, UpdateBMI);
    levelMeter(context, UpdateBMI);
  }
}

/*
  levelWrite takes in a 2d level of the canvas and an UpdateBMI 
  value to write advice based on the latter.
*/
function levelWrite(context, UpdateBMI) {
  if ((UpdateBMI >= 18.5) && (UpdateBMI <= 24.9)) {
    writeAdvice(context, "green");
  } else if ((UpdateBMI >= 25) && (UpdateBMI <= 29.9)) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}

/*
  writeAdvice takes in the context and value (BMI) to give the 
  appropriate advice based on target, warning, and emergency 
  ranges, writing it on adviceCanvas.
*/
function writeAdvice(context, level, UpdateBMI) {
  var adviceLine1 = "";
  var adviceLine2 = "";
  
  if (level == "red") {
    adviceLine1 = "Please consult with your family";
    adviceLine2 = "physician urgently.";
  } else if (level == "yellow") {
    adviceLine1 = "Contact family physician and recheck BMI";
    adviceLine2 = "in 6-8 weeks.";
  } else if (level == "green") {
    adviceLine1 = "Continue to eat well and exercise regularly.";
  }

  context.fillText("Your BMI is in the " + level + " zone.", 25, 380);
  context.fillText(adviceLine1, 25, 410);
  context.fillText(adviceLine2, 25, 440);
}

/*
  levelMeter takes in the 2d value of the canvas and creates a 
  corner gauge.
*/
function levelMeter(context, UpdateBMI) {
  if (UpdateBMI < 18.4) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, UpdateBMI, UpdateBMI)
      .Set("chart.color.ranges", [[0, 18.4, "red"], [25, 29.9, "yellow"],
      [18.5, 24.9, "green"], [30, UpdateBMI, "red"]]);
  } else if (UpdateBMI >= 18.5 && UpdateBMI <= 24.9) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 50, UpdateBMI)
      .Set("chart.color.ranges", [[0, 18.4, "red"], [25, 29.9, "yellow"],
      [18.5, 24.9, "green"], [30, UpdateBMI, "red"]]);
  } else if (UpdateBMI >= 25 && UpdateBMI <= 29.9) {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 35, UpdateBMI)
      .Set("chart.color.ranges", [[0, 18.4, "red"], [25, 29.9, "yellow"],
      [18.5, 24.9, "green"], [30, UpdateBMI, "red"]]);
  } else {
    var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, UpdateBMI, UpdateBMI)
      .Set("chart.color.ranges", [[0, 18.4, "red"], [25, 29.9, "yellow"],
      [18.5, 24.9, "green"], [30, UpdateBMI, "red"]]);
  }
  drawMeter(gauge);
}

/*
  drawMeter takes in the context and UpdateBMI value necessary to 
  give advice. It creates a corner gauge using if-else statements 
  with color ranges (green for target, yellow for warning, red for 
  emergency).
*/
function drawMeter(gauge) {
  gauge.Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "BMI")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}