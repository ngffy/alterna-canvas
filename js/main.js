initializePage();

function initializePage() {
	addNav();
  // Get current page name and store in local storage
  let path = window.location.pathname;
  let page = "";
  if (path == "/") {
    page = "index.html";
  } else {
    page = path.split("/").pop();
  }

  if (page == "index.html") {
    sessionStorage.setItem("selectedPage", null);
  } else if (sessionStorage.getItem("selectedPage") !== null) {
    loadClass();
  }

	if (sessionStorage.getItem("getSyllabus")) {
		className = sessionStorage.getItem("selectedPage");
		path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/course_info/syllabus.html";
		getClassSyllabus(path);
	}
}

async function getClassModule(module_num) {
  // Function to retrieve specified class module info and load it into template
	module_num_str = String(module_num)
	if (module_num_str.length === 1) {
		module_num_str = "0" + module_num_str
	}

	className = sessionStorage.getItem("selectedPage");
	path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/course_info/pages/" + module_num_str + ".html";
	page = await fetch(path);

  // Read in correct class module
  info_html = await page.text();

  // Put info into main content section of template
  document.getElementById("main-content").innerHTML = info_html;
}

async function getClassSyllabus(path) {
  // Function to retrieve class syllabus info and load it into template
	syllabus = await fetch(path);

  // Read in correct class syllabus
  info_html = await syllabus.text();

  // Put info into main content section of template
  document.getElementById("main-content").innerHTML = info_html;
}

function loadClass() {
  className = sessionStorage.getItem("selectedPage");

  document.getElementById("class_name").innerHTML = className;
}

function selectClass(className) {
  sessionStorage.setItem("selectedPage", className);
}

async function addNav() {
	nav = await fetch("nav.html");
	content = await nav.text();

	document.getElementById("nav").innerHTML = content;

	page = sessionStorage.getItem("selectedPage");
	if (page === "null") {
		document.getElementById("Home").classList.add("active");
	} else {
		document.getElementById(page).classList.add("active");
	}
}
