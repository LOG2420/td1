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


// This part of the code will run on load to fill the information in the html from the css
function constructDateBox(dateInformation){

}




function constructTallyBox(tally) {

}


// Fucntional (missing SVG functionaly)
function constructNameBox(name) {
  let box = document.createElement("div");
  // let svg = document.createElement("svg");
  // let text = document.createElement("use");
  let nameSpan = document.createElement("span");
  nameSpan.innerText = name
  // box.appendChild(svg);
  box.appendChild(nameSpan);
  return box
}

// Functional
function constructDecisionBox() {
  let box = document.createElement("div");
  box.classList.add("decision-box");
  return box;
}

// functional
function constructCheckBox() {
  box = constructDecisionBox();
  box.classList.add("checked");
  return box;
}

// Functional
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
    row.appendChild(constructNameBox(participant.name));
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

function tallyCalculator() {

}

function parseDate(dateString) {

}

// This part of the code toggles the displayss
function toggleDiplay(htmlElement) {
	if (htmlElement.style.display == "block") {
		htmlElement.style.display == "none";
	}
	else {
		htmlElement.style.display == "block";
	}
}

// On page load

ConstructTable(intel);

// let layoutSwitchButton = document.querySelector("button['switch-layouts']");
// let pollLayout = document.querySelector(".poll-layout");
// let calendarLayout = document.querySelector(".calendar-layout");
//
// layoutSwitchButton.addEventListener('click', e=>{
// 	toggleDispay(pollLayout);
// 	toggleDiplay(calendarLayout);
// })
