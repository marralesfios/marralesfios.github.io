"use strict";
let lit = localStorage.getItem("lit") === "1";
function set_page() {
    if (lit) {
        document.documentElement.classList.add("invert");
    }
    else {
        document.documentElement.classList.remove("invert");
    }
}
set_page();
addEventListener("DOMContentLoaded", () => {
    document.getElementById("light").addEventListener("click", () => {
        if (lit = !lit) {
            localStorage.setItem("lit", "1");
        }
        else {
            localStorage.removeItem("lit");
        }
        set_page();
    });
    for (const el of document.getElementsByTagName("img")) {
        el.addEventListener("click", () => {
            window.open(el.src);
        });
    }
});
