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
	    Availabilities : [1,0,0,0,0,0,0,0,0]
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

var dataObject = {
  __init__ : function(intel) {
    this.unparsedCalendar = intel.Calendrier;
    this.participants = [];
    intel.Participants.forEach(function(Participant){
      let participant = {
        name : Participant.Nom,
        status : Participant.Statut,
        availabilities :Participant.Availabilities
      };

      this.participants.push(participant);
    }.bind(this))
  },

  tallyCalculator : function(dayPosition){
    let tally = 0;
    this.participants.forEach(function(participant) {
      if (participant.availabilities[dayPosition]) {
        tally++;
      }
    });
    return tally;
  },

  convertToAMPM : function(timeString) {
    let timeArray = timeString.split(":");

    if (timeArray[0] > 12) {
      return (timeArray[0] - 12).toString() + ":" + timeArray[1].toString() + " PM";
    }
    else if (timeArray[0] == 12) {
      return (timeArray[0]).toString() + ":" + timeArray[1].toString() + " PM";
    }
    else {
      return (timeArray[0]).toString() + ":" + timeArray[1].toString() + " AM";
    }
  },

  computeEndTime: function(startTimeString, durationMinutes){

    let startTimeArray = startTimeString.split(":");

    let startHour = Number(startTimeArray[0]);
    let durationHours = 0;

    while(durationMinutes >= 60) {
      durationHours += 1;
      durationMinutes -=60;
    }

    let startMinute = Number(startTimeArray[1]);

    let endHour = startHour + durationHours;
    let endMinute = startMinute + durationMinutes;

    let endMinuteString = endMinute.toString();
    if (endMinute < 10)
    {
      endMinute += "0";
    }

    let endTimeString =  endHour.toString() + ":" + endMinute.toString() + ":" + startTimeArray[2];
    return this.convertToAMPM(endTimeString);
  },

  parseCalendar : function() {
    if(!this.parsedCalendar){
      this.parsedCalendar = [];
      this.unparsedCalendar.forEach(function(dateElement) {
        dateArray = dateElement[0].split(" ");
        dateObject = {
          weekDay : dateArray[0],
          month : dateArray[1],
          day : dateArray[2],
          year : dateArray[3],
          startTime : dateArray[4],
          durationMinutes : dateElement[1]
        };

        dateObject.endTime = this.computeEndTime(dateObject.startTime, dateObject.durationMinutes);
        dateObject.startTime = this.convertToAMPM(dateObject.startTime);
        this.parsedCalendar.push(dateObject);
      }.bind(this));
    }
  }

}



// ====================================================
// ============= Constructor functions ================
// ====================================================



// This part of the code will run on load to fill the information in the html from the css
function constructDateBox(dateInformation){
  let box = document.createElement("div");
  box.classList.add("option-box");

  let dateBox = document.createElement("div");
  dateBox.classList.add("date");

  let month = document.createElement("div");
  month.classList.add("date-word");
  month.innerText = dateInformation.month;

  let number = document.createElement("div");
  number.classList.add("date-number");
  number.innerText = dateInformation.day;

  let weekDay = document.createElement("div");
  weekDay.classList.add("date-word");
  weekDay.innerText = dateInformation.weekDay;

  dateBox.appendChild(month);
  dateBox.appendChild(number);
  dateBox.appendChild(weekDay);

  box.appendChild(dateBox);

  let timeInterval = document.createElement("div");
  timeInterval.classList.add("time-interval");

  let startTime = document.createElement("div");
  startTime.classList.add("hour");
  startTime.innerText = dateInformation.startTime;

  let endTime = document.createElement("div");
  endTime.classList.add("hour");
  endTime.innerText = dateInformation.endTime;

  timeInterval.appendChild(startTime);
  timeInterval.appendChild(endTime);

  box.appendChild(timeInterval);
  return box;
}

function constructTallyBox(tally) {
  let box = constructTableCell();
  box.classList.add("tally");

  let tallyNumber = document.createElement("span");
  tallyNumber.classList.add("tally-number");
  tallyNumber.innerText = tally.toString();
  box.appendChild(tallyNumber);
  return box;
}

function constructCheckBox() {
  let box = constructTableCell();
  box.classList.add("checkbox");

  let input = document.createElement("div");
  input.classList.add("input-checkbox");
  box.appendChild(input);

  return box;
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
function constructTableCell() {
  let box = document.createElement("div");
  box.classList.add("table-cell");
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
function constructGreenBox() {
  box = constructTableCell();
  box.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>';
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
  box = constructTableCell();
  box.classList.add("empty");
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
function ConstructTable(intel) {

  let container = document.querySelector(".table-poll .container");
  let rowDates = document.querySelector(".container> :first-child");
  let rowTally = document.querySelector(".container> :nth-child(2)");
  let rowInput = document.querySelector(".container> :nth-child(3)");

  let i = 0
  intel.parsedCalendar.forEach(function(dateObject){
    rowDates.appendChild(constructDateBox(dateObject));
    rowTally.appendChild(constructTallyBox(intel.tallyCalculator(i)));
    rowInput.appendChild(constructCheckBox());
    i++;
  });


  // Constructing the partcipant table
  intel.participants.forEach(function(participant) {
    if(participant.status == "EnCours"){
      document.querySelector('input[type="text"]').value = participant.name;
      let i = 0
      intel.parsedCalendar.forEach(function(dateObject){
        if(participant.availabilities[i]){
          // the +1 is here to skip the first column
          rowDates.children[i+1].style.backgroundColor = "#CDEAA1";
          rowTally.children[i+1].style.backgroundColor = "#CDEAA1";
          rowInput.children[i+1].classList.add("checked");

        }
        i++;
      });
    }
    else{
      let row = document.createElement("div");
      console.log(row);
      row.classList.add("row");
      console.log(participant);
      console.log(participant.name);
      row.appendChild(constructNameBox(participant.name));
      participant.availabilities.forEach(function(isAvailable){
        if(isAvailable) {
          row.appendChild(constructGreenBox());
        }
        else {
          row.appendChild(constructEmptyBox());
        }
      });
      container.appendChild(row);
    }
  })
}


// On page load


var data = Object.create(dataObject);

data.__init__(intel);
data.parseCalendar();

console.log(data);
ConstructTable(data);


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

// ====================================================
// ============= Front-end features ===================
// ====================================================

function selectDate(){
  $(".option-box").addClass("selected-background");
  $(".tally").addClass("selected-background");
  document.getElementsByClassName("input-checkbox").checked = true;

}
document.getElementsByClassName("input-checkbox").addEventListener("click", selectDate);

function hoverCheckBox() {
  
}

document.addEventListener("mouseover", joverCheckBox)