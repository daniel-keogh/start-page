class Note {
    constructor(content) {
        this.content = content;
        this.timestamp = new Date().valueOf();
    }
}

class NoteElement extends HTMLElement {
    connectedCallback() {
        const ts = +this.getAttribute("timestamp");
        const date = new Date(ts).toLocaleDateString("default", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });

        this.innerHTML = (`
            <div class="note">
                <p class="note__content">${this.getAttribute("content")}</p>
                <div class="note__meta">
                    <p>${date}</p>
                    <a class="note__dismiss">&times;</a>
                </div> 
            </div>
        `);

        this.querySelector(".note__dismiss").addEventListener("click", () => {
            const event = new CustomEvent("dismiss");
            const note = this.querySelector(".note");
            note.classList.add("note--deleted");
            note.addEventListener("animationend", () => {
                this.dispatchEvent(event);
                this.remove();
            });
        });
    }
}

class NotesManager {
    #key = "Notes";
    #notes = []

    constructor() {
        customElements.define("app-note", NoteElement);
    }

    load() {
        this.#notes = JSON.parse(localStorage.getItem(this.#key)) ?? [];
        this.#notes.forEach(note => this.attachElement(note));
    }

    add(content) {
        if (!content) {
            return;
        }

        const note = new Note(content);
        this.#notes.push(note);
        this.attachElement(note);

        localStorage.setItem(this.#key, JSON.stringify(this.#notes));
    }

    removeOne(note) {
        const index = this.#notes.findIndex(n => n.timestamp === note.timestamp);

        if (index !== -1) {
            this.#notes.splice(index, 1);
            localStorage.setItem(this.#key, JSON.stringify(this.#notes));
        }
    }

    attachElement(note) {
        const el = document.createElement("app-note");
        el.setAttribute("content", note.content);
        el.setAttribute("timestamp", note.timestamp);
        el.addEventListener("dismiss", () => this.removeOne(note));
        document.querySelector(".notes__list").append(el);
    }
}

export const notes = new NotesManager();