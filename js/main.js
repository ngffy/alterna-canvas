addNav();

async function addNav() {
	nav = await fetch("nav.html");
	content = await nav.text();

	document.getElementById("nav").innerHTML = content;
}
