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
}

function getClassModule(module_num) {
  // Function to retrieve specified class module info and load it into template

  // Read in correct class module
  info_html = "";

  // Put info into main content section of template
  document.getElementById("main-content").innerHTML = info_html;
}

function getClassSyllabus() {
  // Function to retrieve class syllabus info and load it into template

  // Read in correct class syllabus
  info_html = "";

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
