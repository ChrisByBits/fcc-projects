const tracker = document.querySelector(".cursor-tracker");
const trail = document.querySelector(".cursor-trail");

const form = document.querySelector("form");

form.addEventListener("mouseenter", function() {
  tracker.style.display = "none";
  trail.style.display = "none";
});


form.addEventListener("mouseleave", function() {
  tracker.style.display = "block";
  trail.style.display = "block";
});

document.addEventListener("mousemove", function(event) {
  const x = event.pageX;
  const y = event.pageY;
  
  tracker.style.left = x - 15 + "px";
  tracker.style.top = y - 15 + "px";
  
  const line = document.createElement("div");
  line.classList.add("motion-line");
  line.style.left = x + "px";
  line.style.top = y + "px";
  trail.appendChild(line);
  
  const lines = trail.querySelectorAll(".motion-line");
  if (lines.length > 20) {
    lines[0].remove();
  }
});
