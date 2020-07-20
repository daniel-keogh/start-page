import searchEngines from "./searchEngines";
import { notes } from "./notes";

const defaultEngine = searchEngines.find(se => se.key === "d");
let searchEngine = defaultEngine;

notes.load();

const searchButton = document.querySelector(".search-btn__button");
const searchInput = document.querySelector(".search-box__input");
const searchLabel = document.querySelector(".search-box__label");
const noteInput = document.querySelector(".notes__input");

searchInput.value = "";
noteInput.value = "";

// Event Listeners
searchButton.addEventListener("click", search);

searchInput.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        search();
        return;
    }

    const query = e.target.value.toLowerCase();
    const temp = searchEngines.find(se => `${query} `.startsWith(se.key + " "));

    searchEngine = temp ?? defaultEngine;

    searchLabel.textContent = `Search ${searchEngine.name}`;
});

noteInput.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && e.target.value) {
        notes.add(e.target.value);
        noteInput.value = "";
    }
});

// Search for the term in the search box
function search() {
    const query = searchInput.value.split(" ");

    // Omit the search engine's "key" from the query
    const keys = searchEngines.map(se => se.key);
    if (keys.includes(query[0].toLowerCase())) {
        query.shift();
    }

    location.href = `${searchEngine.url}${encodeURIComponent(query.join(" "))}`;
}

// Show date & time
(function () {
    const currentDate = document.querySelector(".today__date");
    const currentTime = document.querySelector(".today__time");

    function refresh() {
        const today = new Date();

        const hh = today.getHours();
        const mm = `${today.getMinutes()}`.padStart(2, "0");

        currentDate.innerHTML = today.toLocaleDateString("default", {
            weekday: "short",
            day: "numeric",
            month: "long",
        });
        currentTime.innerHTML = `${hh}:${mm}`;
    }

    refresh();
    setInterval(refresh, 1000);
})();