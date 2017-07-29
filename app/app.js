// Initialize app.

(function(){
  fetchData();
  setTimes();
  stationToggle();
})();

var timer;


// Gets JSON from '/departures' and renders the UI if successful. Calls itself every 10 seconds to refresh data.

function fetchData(){
  $.get( "/departures", function() {
  }).done(function(data) {
    renderUI(data);
  }).fail(function(error) {
    console.log(error);
  }).then(function(){
    timer = setTimeout(fetchData, 10000);
  });
}

// Emptys current schedule data and sends data to appendData function.

function renderUI(data){
  $("#schedule").empty();
  appendData(data)
}

// Checks which station is selected and outputs schedule data into #schedule.

function appendData(data){

  var north = $("#north").hasClass("selected") ? true : false;
  var south = $("#south").hasClass("selected") ? true : false;

  data.forEach(function(train){

    if((north == true && train.Origin == "North Station") ||
       (south == true && train.Origin == "South Station")){

      $("#schedule").append("<tr>" +
                              "<td class='time'>" + moment.unix(parseInt(train.ScheduledTime)).format("h:mm a") + "</td>" +
                              "<td class='destination'>" + formatDestination(train.Destination) + "</td>" +
                              "<td class='trip'>" + train.Trip + "</td>" +
                              "<td class='track'>" + formatTrack(train.Track) + "</td>" +
                              "<td class='status'>" + train.Status + "</td>" +
                            "</tr>")
      }
    });
}

// Checks for blank destination fields. Returns "N/A" for missing fields.

function formatDestination(destination){
  if(destination){
    return destination
  }else{
    return "N/A"
  }
}

// Checks for blank track fields. Returns "TBD" for missing fields.

function formatTrack(track){
  if(track){
    return track;
  }else{
    return "TBD";
  }
}

// Sets current data and times. Calls itself every 3 seconds to refresh.

function setTimes(){
  $(".dynamic").empty();
  $("#day").append(moment().format("dddd"));
  $("#date").append(moment().format("M-DD-YYYY"));
  $("#time").append(moment().format("h:mm a"));
  setTimeout(setTimes, 3000);
}

// Handles station toggle clicks. Checks if button is already selected. If not, remove "selected" class from siblings, add "selected"
// class to clicked element and refreshes data and timer..

function stationToggle(){
  $("#station-toggle div").on("click", function(){
    var station = $(this);
    if(!$(station).hasClass("selected")){
      $(station).siblings().removeClass("selected");
      $(station).addClass("selected");
      clearTimeout(timer);
      fetchData();
    }
  })
}
