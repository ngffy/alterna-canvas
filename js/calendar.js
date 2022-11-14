initCalendar(['computer_graphics', 'senior_design', 'ui']);

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