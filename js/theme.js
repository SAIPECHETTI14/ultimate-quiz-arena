const themeToggle = document.getElementById("themeToggle");

// Load Theme

if(localStorage.getItem("theme") === "light"){

  document.body.classList.add("light-mode");

  themeToggle.textContent = "☀️";

}

// Toggle Theme

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light-mode");

  if(document.body.classList.contains("light-mode")){

    localStorage.setItem("theme", "light");

    themeToggle.textContent = "☀️";

  }else{

    localStorage.setItem("theme", "dark");

    themeToggle.textContent = "🌙";

  }

});