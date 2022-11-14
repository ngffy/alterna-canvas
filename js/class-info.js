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

async function displayClassHome() {
	file = await fetch("templates/class-home.html");
	html = await file.text();

	// Populate most recent announcement
	let item = JSON.parse(sessionStorage.getItem("announcements"))[0];
	html = html.replace("announcementHere", `<h5>${item.title}</h5><b>${item.date} ${item.time}</b><p>${item.text}</p>`)

	
	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-home");
}

async function displayAnnouncements() {
	file = await fetch("templates/announcements.html");
	html = await file.text();

	let announcements = JSON.parse(sessionStorage.getItem("announcements"));

	announce_html = "";
	for (let i = 0; i < announcements.length; i++) {
		let item = announcements[i];

		announce_html += `<section class="card"><header class="card-header"><h5>${item.title}</h5>From: ${item.name}</header><section class="card-body">${item.text}</section><section class="card-footer text-end">${item.date} ${item.time}</section></section>`
	}

	html = html.replace("announcementsHere", announce_html)

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-announcements");
}

function displayAssignments() {
	fillMainContent("templates/assignment-groups.html");
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
			btn = `<button class="btn btn-light" onclick="displayModuleItem(${mod_num}, ${i})" style="width:100%">View</button>`;
		} else {
			let path = `course-data/${getClassFolder()}/${item.folder}/${item.name}`;
			btn = `<a class="btn btn-light" href=${path} download" style="width:100%">Download</a>`;
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

  // Retrieve and store announcements for class
  getAnnouncements();
}

async function getAnnouncements() {
	let path = 'course-data/' + getClassFolder() + "/course_info/announcements.json";
    let file = await fetch(path);

    let announcements = await file.json();

	sessionStorage.setItem("announcements", JSON.stringify(announcements));
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
		let group_card = `<section class="card"><header class="card-header"><h3>${key}</h3></header><section class="card-body"><table class="table dark-bg"><thead><tr><th>Assignment Name</th><th>Grade</th></tr></thead><tbody></tbody></table></section></section>`

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