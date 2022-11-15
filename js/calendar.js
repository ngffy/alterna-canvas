var cur_date = new Date("10/13/2022");
// initCalendar(['computer_graphics', 'senior_design', 'ui']);

function initCalendar(classes){
    let assignments = JSON.parse(sessionStorage.getItem("all_assignments"));

    for (let i = 0; i < classes.length; i++){
        let cur_class = classes[i];
        let class_assignments = assignments[cur_class];

        for (let j = 0; j < class_assignments.length; j++) {
            let item = class_assignments[j];
        }
    }
}

function addCalItem(html, item){
    let day_mapping = {"10/10/22": "day0",
                    "10/11/22": "day1",
                    "10/12/22": "day2",
                    "10/13/22": "day3",
                    "10/14/22": "day4",
                    "10/15/22": "day5",
                    "10/16/22": "day6",}


    let cal_item = `<div class="card bg-light"><div class="card-body">${item.title}<hr>11:59pm</div></div>`;

    return html + cal_item
}

function filterCal(filter){
    if (filter == "Computer Graphics") {
        document.getElementById("event1").style.visibility = "visible";
        document.getElementById("event2").style.visibility = "hidden";
        document.getElementById("event3").style.visibility = "hidden";
    } else if (filter == "UI") {
        document.getElementById("event1").style.visibility = "hidden";
        document.getElementById("event2").style.visibility = "visible";
        document.getElementById("event3").style.visibility = "visible";
    } else if (filter == "Senior Design") {
        document.getElementById("event1").style.visibility = "hidden";
        document.getElementById("event2").style.visibility = "hidden";
        document.getElementById("event3").style.visibility = "hidden";
    } else {
        document.getElementById("event1").style.visibility = "visible";
        document.getElementById("event2").style.visibility = "visible";
        document.getElementById("event3").style.visibility = "visible";
    }
}