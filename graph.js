"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/23/2020
  Purpose: To provide the functionality to display users' data in 
    a graph to track their BMI over time.
*/

/*
  showGraph tries to retrieve tbRecords from local storage and will 
  alert the user and return them to pageMenu if none are found. If
  records exist it will set up the canvas, create the data arrays for
  the graph, draw lines, and label the axes with helper functions.
*/
function showGraph() {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      
    if (tbRecords == null) {
      alert("No records exist yet.");
        
      $(location).attr("href", "#pageMenu");
    } else {
      setupCanvas();
        
      var bmiArr = new Array();
      var dateArr = new Array();
      getBMIHistory(bmiArr, dateArr);
        
      var bmiLower = new Array(2);
      var bmiUpper = new Array(2);
      getBMIBounds(bmiLower, bmiUpper);
        
      drawLines(bmiArr, dateArr, bmiUpper, bmiLower);
      labelAxes();
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
  setupCanvas will get the GraphCanvas element, setting a rectangle with
  its context as a background.
*/
function setupCanvas() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");
    
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 500, 500);
}

/*
  getBMIHistory gets and fills an array with dates, as well as BMI from
  tbRecords and fills another array with it to display trends over time.
*/
function getBMIHistory(bmiArr, dateArr) {
  try {
    var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
      
    for (var i = 0; i < tbRecords.length; i++) {
      var currRecord = tbRecords[i];
    
      var NewDate = new Date(currRecord.NewDate);
      var month = NewDate.getMonth() + 1;
      var day = NewDate.getDate() + 1;
      dateArr[i] = (month + "/" + day);
        
      bmiArr[i] = parseFloat(currRecord.UpdateBMI);
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
  getBMIBounds takes in an empty array for lower and upper bounds of
  normal BMI (18.5 and 24.9).
*/
function getBMIBounds(bmiLower, bmiUpper) {
  try {
    var user = JSON.parse(localStorage.getItem("user"));
    var UpdateBMI = user.UpdateBMI;
      
      bmiUpper[0] = 18.5;
      bmiUpper[1] = 18.5;
      bmiLower[0] = 24.9;
      bmiLower[1] = 24.9;   
      
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
  drawLines takes in the bmi and date arrays for graphing along the x
  and y axes, respectively. It uses the aforementioned arrays to create
  a line graph with RGraph and display it on GraphCanvas. It also demar-
  cates the upper and lower end of normal BMI with horizontal green lines.
*/
function drawLines(bmiArr, dateArr, bmiLower, bmiUpper) {
  var bmiLine = new RGraph.Line("GraphCanvas", bmiArr, bmiLower, bmiUpper)
    .Set("labels", dateArr)
    .Set("colors", ["blue", "green", "green"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 1)
    .Set("numxticks", 6)
    .Set("scale.decimals", 2)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 40)
    .Set("tickmarks", "filledCircle")
    .Set("ticksize", 5)
    .Set("chart.labels.ingraph", [,["BMI", "blue", "yellow", 1, 50]])
    .Set("chart.title", "BMI")
    .Draw();
}

/*
  labelAxes adds labels to GraphCanvas, date for the x-axis and BMI
  for the y-axiw.
*/
function labelAxes() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");
    
  context.font = "11px Georgia";
  context.fillStyle = "green";
  context.fillText("Date (MM/DD", 400, 470);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("BMI Value", -250, 10);
}