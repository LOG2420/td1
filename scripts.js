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


const activeGreen = "#EBF7D4";

// ====================================================
// ==================== Model =========================
// ====================================================

/**
 * A data object which will serve as as an object's prototype
 * for function delegation
 * @typedef {Object} DataObject
 * @property {function} __init__ - The function which
 * fills the object with data received from Json information
 * @property {function} tallyCalculator - The function which
 * internally computes the the number of participants which 
 * are available for a given dates
 * @property {function} convertToAMPM - A function which takes
 * a time string formatted to a 24:00 clock and reformats it
 * for a 12:00 clock
 * @property {function} computeEndTime - A function which takes
 * a time string and a time interval and returns a time string 
 * that represents start+interval
 * @property {function} parseCalendar - A function that modifies
 * the received calendar from the JSON as to make it easy to use
 * in the consructor functions
 */

var DataObject = {
  /**
   * @function
   * The function which
   * fills the object with data received from Json information
   * 
   * @param {Object} jsonData - The json data that will be placed into 
   * the DataObject instance
   */
  __init__ : function(jsonData) {
    this.unparsedCalendar = jsonData.Calendrier;
    this.participants = [];
    jsonData.Participants.forEach(function(Participant){
      let participant = {
        name : Participant.Nom,
        status : Participant.Statut,
        availabilities :Participant["Disponibilités"]
      };

      this.participants.push(participant);
    }.bind(this))
  },

  /**
   * @function
   * The function which
   * internally computes the the number of participants which 
   * are available for a given dates
   * 
   * @param {Number} dayPosition - The index of the dayPosition in the 
   * parsedCalendar Array
   */
  tallyCalculator : function(dayPosition){
    let tally = 0;
    this.participants.forEach(function(participant) {
      if (participant.availabilities[dayPosition]) {
        tally++;
      }
    });
    return tally;
  },

  /**
   * @function
   * A function which takes
   * a time string formatted to a 24:00 clock and reformats it
   * for a 12:00 clock
   * 
   * @param {String} timeString - The tim string in format "13:00" that will
   * be converted into an AMPM time string of formate "1:00 PM"
   * 
   * @returns The converted time String
   */
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

  /**
   * @function
   * A function which takes
   * a time string and a time interval and returns a time string 
   * that represents start+interval
   * 
   * @param {String} startTimeString - The start string (formatted in 24:00 time)
   * @param {String} durationMinutes - The length of time in minutes
   * 
   * @returns an endTime converted to AMPM time
   */
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
    return endTimeString;
  },
  /**
   * @function
   * A function that modifies
   * the received calendar from the JSON as to make it easy to use
   * in the consructor functions
   */
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
        dateObject.endTime = this.convertToAMPM(dateObject.endTime);
        this.parsedCalendar.push(dateObject);
      }.bind(this));
    }
  }

}

// ====================================================
// ============= Constructor functions ================
// ====================================================


// =============== Helper functions ===================
/**
   * @function
   * A function which takes
   * a time string and a time interval and returns a time string 
   * that represents start+interval
   * 
   * @param {String} classNames - The names of the class to be added to the div
   * 
   * @returns a classified div
   */
function makeClassifiedDiv(classNames) {
  let div = document.createElement("div");
  div.classList.add.apply(div.classList, arguments);
  return div;
}


/**
   * @function
   * A function which takes
   * a time string and a time interval and returns a time string 
   * that represents start+interval
   * 
   * @param {String} iconKey - The correct key to access the icon html string
   * contained in the icons object
   * @param {String} iconEnvironmentClass - The class name given to the wrapper div
   * to place the icon inside of the given environment
   * 
   * @returns the wrapped icon
   */
function makeWrappedIcon(iconKey, iconEnvironmentClass){
  
  let icons = {
    checkTally: '<svg class="feather feather-tally"><use xlink:href="svg/feather-sprite.svg#check"/></svg>',
    checkGreen: '<svg class="feather feather-green"><use xlink:href="svg/feather-sprite.svg#check"/></svg>',
    user: '<svg class="feather feather-user"><use xlink:href="svg/feather-sprite.svg#user"/></svg>'
  }

  let wrap = makeClassifiedDiv(iconEnvironmentClass); 
  wrap.innerHTML= icons[iconKey];
  return wrap;
}

/**
   * @function
   * a function which takes dateInformation and constructs
   * a date section with this information
   * 
   * @param {Object} dateInformation - an element of the parseCalendar array
   * in the {@link DataObject} 
   * 
   * @returns a formatted date section
   */
function makeDateSection(dateInformation) {
  let dateSection = makeClassifiedDiv("date");

  let month = makeClassifiedDiv("date-word")
  month.innerText = dateInformation.month;

  let number = makeClassifiedDiv("date-number")
  number.innerText = dateInformation.day;

  let weekDay = makeClassifiedDiv("date-word")
  weekDay.innerText = dateInformation.weekDay;

  dateSection.appendChild(month);
  dateSection.appendChild(number);
  dateSection.appendChild(weekDay);

  return dateSection;
}

/**
   * @function
   * a function which takes dateInformation and constructs
   * a time interval section (found below the time section)
   * 
   * @param {Object} dateInformation - an element of the parseCalendar array
   * in the {@link DataObject} 
   * 
   * @returns a formatted time interval section
   */
function makeTimeIntervalSection(dateInformation) {
  let timeInterval = makeClassifiedDiv("time-interval");

  let startTime = makeClassifiedDiv("hour");
  startTime.innerText = dateInformation.startTime;

  let endTime = makeClassifiedDiv("hour");
  endTime.innerText = dateInformation.endTime;

  timeInterval.appendChild(startTime);
  timeInterval.appendChild(endTime);

  return timeInterval;
}

/**
   * @function
   * A function that constructs a date box from given date data by assembling
   * the date section (top) and the time interval section (bottom)
   * 
   * @param {Object} dateInformation - an element of the parseCalendar array
   * in the {@link DataObject} 
   * 
   * @returns a constructed date box
   */
function constructDateBox(dateInformation){
  let box = makeClassifiedDiv("option-box");

  box.appendChild(makeDateSection(dateInformation));
  box.appendChild(makeTimeIntervalSection(dateInformation));

  return box;
}

/**
   * @function
   * A that makes a tally box by combining the given tally with 
   * a check svg icon
   * 
   * @param tally - The tally number to insert into the tally box
   * 
   * @returns an endTime converted to AMPM time
   */
function constructTallyBox(tally) {
  let box = constructTableCell();
  box.classList.add("tally");

  let tallyNumber = makeClassifiedDiv("tally-number");
  tallyNumber.innerText = tally.toString();

  let wrappedIcon = makeWrappedIcon("checkTally", "tally-result");
  wrappedIcon.appendChild(tallyNumber);

  box.appendChild(wrappedIcon);
  return box;
}

function constructCheckBox() {
  let box = constructTableCell();
  console.log(box);
  box.classList.add("checkbox");

  let input = makeClassifiedDiv("input-checkbox");
  box.appendChild(input);

  return box;
}

/** @todo fix this function */
function constructNameBox(name) {
  let box = makeClassifiedDiv("name-box");

  let wrappedIcon = makeWrappedIcon("user", "a");
  let nameSpan = document.createElement("span");
  nameSpan.innerText = name;
  wrappedIcon.appendChild(nameSpan);

  box.appendChild(wrappedIcon);

  // box.appendChild(nameSpan);
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
  return makeClassifiedDiv("table-cell");
}


/**
 * @function
 * 
 * Constructs a div.decison-box html element.
 *
 * @return
 * The box basic decision box html element.
 */
function constructGreenBox() {

  let wrappedIcon = makeWrappedIcon("checkGreen", "icon-wrap-green");
  
  let box = constructTableCell();
  // box.innerHTML = '<svg class="feather feather-green"><use xlink:href="svg/feather-sprite.svg#check"/></svg>';
  box.classList.add("checked");
  box.appendChild(wrappedIcon);
  return box;
}


/**
 * @function
 * Constructs a div.decison-box html element.
 * @return
 * The box basic decision box html element.
 */
function constructEmptyBox() {
  let box = constructTableCell();
  box.classList.add("empty");
  return box;
}

/**
 * @function
 * Constructs a div.decison-box html element.
 * @return
 * The box basic decision box html element.
 */
function ConstructTable(intel) {


  // We start by constructing the first three rows from the calendar data
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


  // This forEach loop iterates over all the participants received in the json data
  intel.participants.forEach(function(participant) {
    // When a participant's status is still ongoing, 
    if(participant.status == "EnCours"){
      document.querySelector('input[type="text"]').value = participant.name;
      let i = 0
      intel.parsedCalendar.forEach(function(dateObject){
        if(participant.availabilities[i]){
          // the +1 is here to skip the first column
          rowDates.children[i+1].style.backgroundColor = activeGreen;
          rowTally.children[i+1].style.backgroundColor = activeGreen;
          rowInput.children[i+1].classList.add("checked");

        }
        i++;
      });
    }
    else{
      let row = document.createElement("div");
      row.classList.add("row");
      row.appendChild(constructNameBox(participant.name));

      for (let index = 0; index <  participant.availabilities.length; index++) {
        if(participant.availabilities[index]) {
          var box = constructGreenBox();
        }
        else {
          var box = constructEmptyBox();
        }
        box.index = index;
        row.appendChild(box);
        
      }
      container.appendChild(row);
    }
  })

  renderDiv.call(document.querySelector("body"), data.parsedCalendar[1], "stuff", true);

}

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

// On page load

var data = Object.create(DataObject);

fetch('cal-data.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    data.__init__(myJson);
    data.parseCalendar();
    ConstructTable(data);
    initFrontEnd(data);
  })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

// var data = Object.create(dataObject);

// data.__init__(intel);
// data.parseCalendar();

// ConstructTable(data);

function findAssociatedName(element) {
  // Element will be a cell in a person's row
  return element.parentNode.firstChild.innerText;
}

function findIfIsAvailable(element) {
  // Element will fall into one of two classes
  return element.classList.contains("checked");
}

function renderDiv(dateInformation){

  // Create the div that will be hovering
  let hoverDiv = document.createElement("div");
  hoverDiv.classList.add("hover-div");
  
  // Construct the top part of the div and attach it to the hover div
  let timeDateWrapper = document.createElement("div");
  timeDateWrapper.appendChild(makeDateSection(dateInformation))
  let timeInterval = makeTimeIntervalSection(dateInformation);
  timeInterval.style.float = "left";
  timeInterval.classList.add("time-interval-hover");
  timeDateWrapper.appendChild(timeInterval);
  hoverDiv.appendChild(timeDateWrapper);
  
  // Horizontal rule seperation
  hoverDiv.appendChild(document.createElement("hr"));

  // Create the bottom half of the div
  let personNameDiv = document.createElement("div");
  personNameDiv.classList.add("hover-person-name");
  personNameDiv.innerText = findAssociatedName(this);

  let availabilityDiv = document.createElement("div");
  availabilityDiv.classList.add("hover-availability");
  availabilityDiv.innerText = findIfIsAvailable(this) ? 'Voted "Yes' : "Didn't vote for this";

  let bottomWrapper = document.createElement("bottomWrapper");
  bottomWrapper.appendChild(personNameDiv);
  bottomWrapper.appendChild(availabilityDiv);
  hoverDiv.appendChild(bottomWrapper);

  this.appendChild(hoverDiv);
}


function initFrontEnd(data) {
  // Front End

let cells = document.querySelectorAll(".table-cell");




var asyncHandler = {
  waitASecondDawg: function(action){
    console.log("startTimer");
    this.timeOutObject = setTimeout(action,1000);
  },
  holdUp: function(){
    console.log("endTimer");
    clearTimeout(this.timeOutObject);
    this.timeOutObject = null;
  }
}

let dankHandler = Object.create(asyncHandler);



cells.forEach((cell)=>{
  // Arrow function does not work because it sets bind by scope context (which 
  // would here be the global object)
  if(!cell.classList.contains("tally")) {
    cell.addEventListener("mouseover", function(e){
      let hoverDiv = document.querySelector(".hover-div")
  
      if(document.querySelector(".hover-div")){
        hoverDiv.parentNode.removeChild(hoverDiv);
      }
      if(dankHandler.timeOutObject) {
        dankHandler.holdUp();
      }
  
      renderDivDate = renderDiv.bind(this, data.parsedCalendar[this.index])
  
      dankHandler.waitASecondDawg(renderDivDate);
    })
  }
}) ;
}
