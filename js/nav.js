addNav();

async function addNav() {
	nav = await fetch("nav.html");
	content = await nav.text();

	document.getElementById("nav").innerHTML = content;

	page = sessionStorage.getItem("selectedClass");
	if (String(page) === "null") {
		document.getElementById("Home").classList.add("active");
	} else {
		document.getElementById(page).classList.add("active");
	}
}
