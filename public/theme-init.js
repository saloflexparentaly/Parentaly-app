try {
  var m = JSON.parse(localStorage.getItem("parentelia-theme")) || "auto";
  var h = new Date().getHours();
  var t = m === "auto" ? (h >= 7 && h < 19 ? "light" : "dark") : m;
  document.documentElement.setAttribute("data-theme", t);
} catch(e) {
  document.documentElement.setAttribute("data-theme", "dark");
}
