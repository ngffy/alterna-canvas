initializePage();

function initializePage() {
  // Get current page name and store in local storage
  let path = window.location.pathname;
  let page = "";
  if (path == "/") {
    page = "index.html";
  } else {
    page = path.split("/").pop();
  }

  if (page == "index.html") {
    sessionStorage.setItem("selectedClass", null);
  } else if (sessionStorage.getItem("selectedClass") !== null) {
    loadClass();
  }
	displayClassHome();
}

/*
 * Use after clicking on a nav tab to set the new tab to active and make the
 * others inactive
 * TODO: This might need to be modified to also reset modules tab
 */
function resetActiveNav(activeNav) {
	ul = document.getElementById(activeNav).parentElement.parentElement;
	lis = ul.children;
	for (var i = 0; i < lis.length; i++) {
		span = lis[i].children[0];
		span.classList.remove("active");
	}

	document.getElementById(activeNav).classList.add("active");
}

async function fillMainContent(path) {
	file = await fetch(path);
	html = await file.text();

	document.getElementById("main-content").innerHTML = html;
}

function displayClassHome() {
	fillMainContent("templates/class-home.html");
	resetActiveNav("nav-home");
}

function displayAnnouncements() {
	fillMainContent("templates/announcements.html");
	resetActiveNav("nav-announcements");
}

function addGroup(name) {
	assignmentGroup = document.createElement("article");
	assignmentGroup.classList.add("row", "col-9", "card")

	header = document.createElement("header");
	header.classList.add("card-header")

	h = document.createElement("h3");
	h.setAttribute("contenteditable", "true");
	h.innerHTML = name;

	assignmentGroup.appendChild(header);
	header.appendChild(h);

	assignmentGroupDiv = document.getElementById("groups");
	assignmentGroupDiv.appendChild(assignmentGroup);

	return assignmentGroup;
}

function createAssignmentCard(name) {
	assignmentCard = document.createElement("section");
	assignmentCard.classList.add("card", "card-body");
	assignmentCard.innerHTML = name;

	return assignmentCard;
}

/*
 * Return an object where each key is all the different assignment groups and
 * the values are the objects representing the assignments within that group
 */
async function getAssignmentGroups() {
	path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/data.txt";
	file = await fetch(path);
	data = await file.json();

	groups = {};

	for (idx in data) {
		obj = data[idx];
		if ("student-group" in obj) {
			group = obj["student-group"];
			if (!(group in groups)) {
				groups[group] = [];
			}

			groups[group].push(obj);
		}
	}

	return groups;
}

/*
 * Display HTML elements that organize class assignments into groups indicated
 * by the student-group attribute in the class's json file
 */
async function displayAssignments() {
	groups = await getAssignmentGroups();

	main = document.getElementById("main-content");
	main.innerHTML = "";
	assignmentGroupDiv = document.createElement("div");
	assignmentGroupDiv.id = "groups";
	main.appendChild(assignmentGroupDiv);

	addButton = document.createElement("button");
	addButton.classList.add("btn", "btn-primary");
	main.appendChild(addButton);
	addButton.innerHTML = "Add Group";
	addButton.addEventListener("click", () => {addGroup("Unnamed Group")});

	for (group in groups) {
		if (group === "null") {
			assignmentGroup = addGroup("Ungrouped");
		} else {
			assignmentGroup = addGroup(group);
		}

		assignmentRow = document.createElement("section");
		assignmentRow.classList.add("card-body", "row");
		assignmentGroup.appendChild(assignmentRow);

		for (idx in groups[group]) {
			assignment = groups[group][idx];

			div = document.createElement("div");
			div.classList.add("col");
			assignmentRow.appendChild(div);

			assignmentCard = createAssignmentCard(assignment["title"]);
			div.appendChild(assignmentCard);
		}
	}

	resetActiveNav("nav-assignments");
}

async function displayGrades() {
	file = await fetch("templates/grades.html");
	html = await file.text();

	// Get grade weighting
	let weights = JSON.parse(sessionStorage.getItem("class_weights"));

	// Update grade weighting
	html = updateWeights(html, weights);

	// Create sections for the weight groups
	html = createGradeGroups(html, weights);

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-grades");
}

function displayClassSyllabus() {
	path = "course-data/" + getClassFolder() + "/course_info/syllabus.html";

	fillMainContent(path)
	resetActiveNav("nav-syllabus");
}

async function displayClassModule(mod_num) {
	file = await fetch("templates/module.html");
	html = await file.text();

	let mod_data = JSON.parse(sessionStorage.getItem("module_data"));
	mod_data = mod_data["module"+mod_num];

	// Update template for given module
	html = html.replace("moduleName", `Module ${mod_num}: ${mod_data.title}`);
	html = html.replace("posted", `Posted: ${mod_data.start_or_posted}`);
	
	let tbody = "";
	for (let i = 0; i < mod_data.files.length; i++){
		let item = mod_data.files[i];

		let btn = "";
		if (item.name.endsWith(".html")){
			btn = `<button class="btn btn-primary" onclick="displayModuleItem(${mod_num}, ${i})" style="width:100%">View</button>`;
		} else {
			let path = `course-data/${getClassFolder()}/${item.folder}/${item.name}`;
			btn = `<a class="btn btn-primary" href=${path} download" style="width:100%">Download</a>`;
		}

		tbody += `<tr><td>${item.title}</td><td>${item.type}</td><td>${item.end_or_due}</td><td><span class="bi-check-square"></span></td><td>${btn}</td></tr>`;
	}
	
	html = html.replaceAll("tbodyHere", tbody);

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-modules");
}

function displayModuleItem(mod_num, i) {
	let mod_data = JSON.parse(sessionStorage.getItem("module_data"));
	mod_data = mod_data["module"+mod_num];
	let item = mod_data.files[i];

	let path = `course-data/${getClassFolder()}/${item.folder}/${item.name}`;

	fillMainContent(path);
	resetActiveNav("nav-modules");
}

async function constructModules() {
	path = "course-data/" + getClassFolder() + "/data.txt";

	file = await fetch(path);
	class_data = await file.json();

	let module_data = {};

	// Find all data associated w/ module
	for (let i = 0; i < class_data.length; i++) {
		let item = class_data[i];

		if (item.name.startsWith("module")) {
			module_data[item.name] = item;
			module_data[item.name]["files"] = [];
		} else if (item.module.startsWith("module")) {
			module_data[item.module]["files"].push(item);
		}
	}

	// Set up links to modules in navbar
	createModuleLinks(module_data)

	// Store module data in session storage for later usage
	sessionStorage.setItem("module_data", JSON.stringify(module_data));
}

function createModuleLinks(mod_data) {
	let html = "";

	for (let i = 1; i <= Object.keys(mod_data).length; i++){
		html += `<li><a class="dropdown-item" onclick="displayClassModule(${i})">Module ${i}</a></li>`
	}

	document.getElementById("module-dropdown").innerHTML = html;
}

function loadClass() {
  className = sessionStorage.getItem("selectedClass");

  document.getElementById("class_name").innerHTML = className;

  // Retrieve and store class data for modules
  constructModules();

  // Retrieve and store grading info for class
  getGradeWeighting();
}

function getClassFolder() {
	let className = sessionStorage.getItem("selectedClass");
	return className.toLowerCase().replace(" ", "_");
}

async function getGradeWeighting() {
	// Get grade weighting
    let path = 'course-data/' + getClassFolder() + "/course_info/grading.json";
    let file = await fetch(path);

    weighting = await file.json();

	sessionStorage.setItem("class_weights", JSON.stringify(weighting));
}

function createGradeGroups(html, weights) {
	groups_html = "";

	for (let i = 0; i < Object.keys(weights).length; i++){
		let key = Object.keys(weights)[i];
		let group_card = `<section class="card"><header class="card-header"><h3>${key}</h3></header><section class="card-body"><table class="table table-striped"><thead><tr><th>Assignment Name</th><th>Grade</th></tr></thead><tbody></tbody></table></section></section>`

		// TODO: put assignments in card

		groups_html += group_card;
	}

	return html.replace("groupsHere", groups_html)
}

function updateWeights(html, weights) {
	let weight_html= "";

	for (let i = 0; i < Object.keys(weights).length; i++){
		let key = Object.keys(weights)[i];
		let value = Math.round(weights[key] * 100);

		weight_html += `<tr><td>${key}</td><td>${value}%</td><td>100%</td></tr>`;
	}

	return html.replace("weightsHere", weight_html)
}
