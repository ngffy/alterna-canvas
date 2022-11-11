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

async function displayClassModule(module_num) {
  // Function to retrieve specified class module info and load it into template
	module_num_str = String(module_num)
	if (module_num_str.length === 1) {
		module_num_str = "0" + module_num_str
	}

	className = sessionStorage.getItem("selectedClass");
	path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/course_info/pages/" + module_num_str + ".html";
	page = await fetch(path);

  // Read in correct class module
  info_html = await page.text();

  // Put info into main content section of template
  document.getElementById("main-content").innerHTML = info_html;
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

async function displayAnnouncements() {
	announcements = await fetch("templates/announcements.html");
	html = await announcements.text();

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-announcements");
}

async function displayClassHome() {
	home = await fetch("templates/class-home.html");
	html = await home.text();

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-home");
}

async function displayClassSyllabus() {
	className = sessionStorage.getItem("selectedClass");
	path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/course_info/syllabus.html";

	syllabus = await fetch(path);
	html = await syllabus.text();

	document.getElementById("main-content").innerHTML = html;
	resetActiveNav("nav-syllabus");
}

function loadClass() {
  className = sessionStorage.getItem("selectedClass");

  document.getElementById("class_name").innerHTML = className;
}
