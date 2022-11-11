async function getGrades() {
    // Get grade weighting
    let path = 'course-data/' + getClassFolderName() + "/course_info/grading.json"
    let weighting = await fetch(path);

    weighting = await weighting.json();

    console.log(weighting);

    // Update weighting section
    let weight_html = "";

    document.getElementById("grade_weights").innerHTML = weight_html;

    // Create cards for each weight section
}

function getClassFolderName() {
    let className = sessionStorage.getItem("selectedPage");
    return className.toLowerCase().replace(" ", "_")
}