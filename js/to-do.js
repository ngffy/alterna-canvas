var to_do = []

getToDo()
displayToDo()

function getToDo() {
    if (sessionStorage.getItem("to_do_list") === null) {
        sessionStorage.setItem("to_do_list", JSON.stringify(to_do));
    } else {
        to_do = JSON.parse(sessionStorage.getItem("to_do_list"));
    }
}

async function displayToDo() {
    // Display to do items
    let item_html = await fetch("to-do-item.html");
	let item = await item_html.text();
    let content = ""

    for (let i = 0; i < to_do.length; i++) {
        let item_modified = item.replaceAll("idHere", `todo${i}`).replace("labelHere", to_do[i]['title']);

        if (to_do[i]["complete"] === false){
            item_modified = item_modified.replace(" checked", "");
        }

        content += item_modified;
    }

    document.getElementById('todo-list').innerHTML = content;

    // Update progress bar
    let complete = 0;
    for (let i = 0; i < to_do.length; i++) {
        if (to_do[i]['complete']){
            complete += 1;
        }
    }

    let percent = 0; 
    if (to_do.length > 0){
        percent = Math.round(complete / to_do.length * 100)
    }

    content = `<div class="progress"><div class="progress-bar" style="width: ${percent}%;">${percent}%</div></div>`;
    content += `${complete} of ${to_do.length} items complete`;

    document.getElementById('progress').innerHTML = content;
}

function addItem(){
    new_item = {'title': '', 'due_date': null, 'due_time': null, 'class': 'No Class', 'complete': false};
    new_item.title = document.getElementById('new-item-input').value;

    // Reset value in new item input
    document.getElementById('new-item-input').value = "";

    // Add item to list
    to_do.push(new_item);
    sessionStorage.setItem("to_do_list", JSON.stringify(to_do));

    // Update display
    displayToDo();
}

function deleteItem(id){
    let i = id.replace("todo", "");
    to_do.splice(i, 1);

    sessionStorage.setItem("to_do_list", JSON.stringify(to_do));

    displayToDo();
}

function editItem(i){
    let item = to_do[i];

    item.title = document.getElementById("edit-todo-title").value;
    item.due_date = document.getElementById("due-date").value;
    item.due_time = document.getElementById("due-time").value;
    item.class = document.getElementById("class").value;

    sessionStorage.setItem("to_do_list", JSON.stringify(to_do));
    displayToDo();
}

function loadItemEdit(id){
    id = id.replace("todo", "");
    let item = to_do[id];
   
    // Prefill elements with item info
    document.getElementById("edit-todo-title").value = item.title;
    document.getElementById("due-date").value = item.due_date;
    document.getElementById("due-time").value = item.due_time;
    document.getElementById("class").value = item.class;
    document.getElementById("save_edit").onclick = function() {editItem(id)};
}

function toggleComplete(id){
    let val = document.getElementById(id).checked;
    to_do[id.replace("todo", "")]['complete'] = val
    
    sessionStorage.setItem("to_do_list", JSON.stringify(to_do));

    displayToDo();
}