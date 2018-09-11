/**
* @file
* Considering the hand-in requirements of this project, all javascript will
* be written in this one file.
*
* This js file is seperated in n sections based on the functionality of the code
*
* Section name : Model
* This section provides an object model that manages all of the information
* rendered on the page, as well as a few functions that do internal data
* management and modification.
*
* Section name : Front-end features
*
* Section name : DOM constructor
* This section of comprises all of the "constructor" functions that make
* custom html elements based on the data found in model and then attaches it
* to the DOM.
*
* Section name: Layout switch
* This section handles the layout swithes between the table and calendar
* displays.
*
*/

// ====================================================
// ==================== Model =========================
// ====================================================

let intel = {
    Calendrier : [
	["Mon Aug 27 2018 10:00:00 GMT-0400 (EDT)", 120],
	["Mon Aug 27 2018 14:00:00 GMT-0400 (EDT)", 120],
	["Tue Aug 28 2018 10:00:00 GMT-0400 (EDT)", 120],
	["Tue Aug 28 2018 14:00:00 GMT-0400 (EDT)", 120],
	["Wed Aug 29 2018 10:00:00 GMT-0400 (EDT)", 120],
	["Wed Aug 29 2018 14:00:00 GMT-0400 (EDT)", 120],
	["Thu Aug 30 2018 10:00:00 GMT-0400 (EDT)", 120],
	["Fri Aug 31 2018 10:00:00 GMT-0400 (EDT)", 120],
	["Fri Aug 31 2018 14:00:00 GMT-0400 (EDT)", 120]
    ],

    Participants :
    [
	{
	    Nom : "Michel",
	    Statut : "EnCours",
	    Availabilities : [0,0,0,0,0,0,0,0,0]
	},
	{
	    Nom : "Mathieu",
	    Statut : "ComplÃ©tÃ©",
	    Availabilities : [1,1,1,1,1,1,0,0,1]
	},
	{
	    Nom : "Kasra",
	    Statut : "ComplÃ©tÃ©",
	    Availabilities : [0,0,0,0,1,1,1,0,0]
	},
	{
	    Nom : "Audrey",
	    Statut : "ComplÃ©tÃ©",
	    Availabilities : [0,1,1,1,0,0,1,1,1]
	},
	{
	    Nom : "Antoine",
	    Statut : "ComplÃ©tÃ©",
	    Availabilities : [1,1,1,1,1,1,0,0,0]
	},
	{
	    Nom : "Michel",
	    Statut : "ComplÃ©tÃ©",
	    Availabilities : [1,0,1,0,1,1,1,0,1]
	}
    ]
}

// We could make a OLOO architecture

var data = {
  __init__ : function(intel) {
    this.unparsedCalendar = intel.Calendrier;
    this.particpants = [];
    intel.Participants(function(participant){
      let participant = {
        name : participant.Nom,
        status : partcipant.Status,
        availabilities : partcipant.Availabilities
      }
      this.partcipants.push(partcipant);
    })
  },

  tallyCalculator : function(){

  },

  computeEndTime: function(startTimeString, length){

    startTimeArray = startTimeString.split(":");

    let startHour = startTimeArray[0];
    let durationHours = 0;

    while(length >= 60) {
      durationHours += 1;
      durationMinutes -=60;
    }

    let startMinute = startTimeArray[1];

    let endHour = startHour + durationHours;
    let endMinute = startMinute + durationMinutes;

    return endHour.toString() + ":" + endMinute.toString() + ":" + startTimeArray.toString();

  },

  parseCalendar : function() {
    this.parsedCalendar = []
    if(!this.parsedCalendar){
      unparsedCalendar.forEach(function(dateString) {
        dateArray = dateString.split(" ");
        dateObject = {
          weekDay : dateArray[0],
          day : dateArray[1],
          month : dateArray[2],
          year : dateArray[3],
          startTime : dateArray[4]
        };
        this.parsedCalendar.push(dateObject);
      });
    }
  }

}


// ====================================================
// ============= Front-end features ===================
// ====================================================

// this is going to be the fetch section of the code

// Make it in promise form so i can afterwards extract the object, or just
// pipeline in thens

// $.ajax({
// 	dataType:"json",
// 	url:"http://www.groupes.polymtl.ca/log2420/Lab/Doodle/cal-data.json",
// 	xhrFields: {
// 		withCreditials:false
// 	},
// 	mode: 'cors',
// 	headers:{
// 	'Access-Control-Allow-Origin':''
// 	}
// })
// 	.done(jsonObject => {
// 		console.log(jsonObject);
//
// 	})
// 	.fail(()=>{
// 		console.log("Failure");
// 	});


// ====================================================
// ============= Constructor functions ================
// ====================================================



// This part of the code will run on load to fill the information in the html from the css
function constructDateBox(dateInformation){

}

function constructTallyBox(tally) {

}


// Fucntional (missing SVG functionaly)
function constructNameBox(name) {
  let box = document.createElement("div");
  box.classList.add("name-box");
  // let svg = document.createElement("svg");
  // let text = document.createElement("use");
  let nameSpan = document.createElement("span");
  nameSpan.innerText = name
  // box.appendChild(svg);
  box.appendChild(nameSpan);
  return box
}

/**
 * Constructs a div.decison-box html element.
 *
 * @constructor
 *
 * @return
 * The box basic decision box html element.
 */
function constructDecisionBox() {
  let box = document.createElement("div");
  box.classList.add("decision-box");
  return box;
}


/**
 * Constructs a div.decison-box html element.
 *
 * @constructor
 *
 * @return
 * The box basic decision box html element.
 */
function constructCheckBox() {
  box = constructDecisionBox();
  box.classList.add("checked");
  return box;
}


/**
 * Constructs a div.decison-box html element.
 *
 * @constructor
 *
 * @return
 * The box basic decision box html element.
 */
function constructEmptyBox() {
  box = constructDecisionBox();
  box.classList.add("empty");
  return box;
}

// Needs an initial test
function ConstructTable(intel) {
  let container = document.querySelector(".table-poll .container");

  intel.Participants.forEach(function(participant) {
    let row = document.createElement("div");
    console.log(row);
    row.classList.add("row");
    console.log(participant)
    console.log(participant.Nom);
    row.appendChild(constructNameBox(participant.Nom));
    participant.Availabilities.forEach(function(isAvailable){
      if(isAvailable) {
        row.appendChild(constructCheckBox());
      }
      else {
        row.appendChild(constructEmptyBox());
      }
    });
    container.appendChild(row);
  })

}


// On page load

ConstructTable(intel);

// ====================================================
// ================== Layout Switch ===================
// ====================================================

// This part of the code toggles the displayss
function toggleDisplay(htmlElement) {
	if (htmlElement.style.display == "block") {
		htmlElement.style.display = "none";
	}
	else {
		htmlElement.style.display = "block";
	}
}

let toCalendarButton = document.querySelector("button[name='toggle-to-calendar']");
let toTableButton = document.querySelector("button[name='toggle-to-table']");

let pollLayout = document.querySelector(".table-poll");
let calendarLayout = document.querySelector(".calendar");

toCalendarButton.addEventListener('click', cb.bind(toCalendarButton));

toTableButton.addEventListener('click', cb.bind(toTableButton));


function isInClassList(htmlElement, className) {
  for (var i = 0; i < htmlElement.classList.length; i++) {
    if (className == htmlElement.classList[i]) {
      return true;
    }
  }
  return false;
}


function cb() {
  if (!isInClassList(this, "clicked")) {
    toggleDisplay(pollLayout);
    toggleDisplay(calendarLayout);
    toCalendarButton.classList.toggle("clicked");
    toTableButton.classList.toggle("clicked");

  }
}
