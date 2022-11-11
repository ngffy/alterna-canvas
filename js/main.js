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

	if (sessionStorage.getItem("getSyllabus")) {
		className = sessionStorage.getItem("selectedClass");
		path = "course-data/" + className.toLowerCase().replace(" ", "_") + "/course_info/syllabus.html";
		getClassSyllabus(path);
	}
}

function getClassModule(module_num) {
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

async function getClassSyllabus(path) {
  // Function to retrieve class syllabus info and load it into template
	syllabus = await fetch(path);

  // Read in correct class syllabus
  info_html = await syllabus.text();

  // Put info into main content section of template
  document.getElementById("main-content").innerHTML = info_html;
}

function loadClass() {
  className = sessionStorage.getItem("selectedClass");

  document.getElementById("class_name").innerHTML = className;
}

function selectClass(className) {
  sessionStorage.setItem("selectedClass", className);
}
