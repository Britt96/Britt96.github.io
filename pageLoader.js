"use strict";
/*
  Assignment: Chapter 5 BMI Tracker App
  Author: Brittny Eaddy
  Date: 8/19/2020
  Purpose: To provide the functionality to preload information in the
    User Info and Records pages.
*/

/*
  Adds a pageshow handler with an anonymous function that calls the
  showUserForm function when the User Info page is active. It calls
  the loadUserInformation and listRecords function when the Records 
  page is active.
*/
$(document).on("pageshow", function() {
  if ($(".ui-page-active").attr("id") == "pageUserInfo") {
    showUserForm();
  } else if ($(".ui-page-active").attr("id") == "pageRecords") {
    loadUserInformation();
    listRecords();
  } else if ($(".ui-page-active").attr("id") == "pageSuggest") {
    showAdvice();
    resizeGraph();
  } else if ($(".ui-page-active").attr("id") == "pageGraph") {
    showGraph();
    resizeGraph();
  }
});

/*
  resizeGraph checks whether window size is less than 700px; if so it 
  will adjust the width of the advice amd graph canvases to be 50px 
  smaller than the window width.
*/
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#AdviceCanvas").css({"width": $(window).width() - 50});
    $("#GraphCanvas").css({"width": $(window).width() - 50});
  }
}