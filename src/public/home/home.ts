import {getCurrentUser, User} from "../utils/getCurrentUser";

let currentUser: User | null = null;

const userInfoDiv = document.getElementById("user-info") as HTMLDivElement;
const usernameSpan = document.getElementById("username") as HTMLSpanElement;
const userPic = document.getElementById("user-pic") as HTMLImageElement;
const userDropdown = document.getElementById("user-dropdown") as HTMLDivElement;
const accountEmail = document.getElementById("account-email") as HTMLParagraphElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;

const mainContent = document.getElementById("main-content") as HTMLDivElement;

function renderUser() {
    if (currentUser) {
        userPic.src = currentUser.picture;
        usernameSpan.textContent = currentUser.username;
        accountEmail.textContent = currentUser.email;

        userInfoDiv.addEventListener("click", () => {
            userDropdown.classList.toggle("hidden");
        });

        logoutBtn.addEventListener("click", () => {
            currentUser = null;
            renderUser();
            renderMain();
        });
    } else {
        usernameSpan.textContent = "";
        userPic.src = "";
        userDropdown.classList.add("hidden");
    }
}

function renderMain() {
    mainContent.innerHTML = "";

    if (!currentUser) {
        const loginMsg = document.createElement("p");
        loginMsg.textContent = "Login to continue";
        mainContent.appendChild(loginMsg);
        return;
    }

    const form = document.createElement("form");

    const docInput = document.createElement("input");
    docInput.type = "text";
    docInput.name = "documentNumber";
    docInput.placeholder = "Document Number";
    docInput.required = true;
    form.appendChild(docInput);

    const numbersInput = document.createElement("input");
    numbersInput.type = "text";
    numbersInput.name = "numbers";
    numbersInput.placeholder = "Enter 6-10 numbers (1-45) separated by commas";
    numbersInput.required = true;
    form.appendChild(numbersInput);

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit";
    form.appendChild(submitBtn);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const doc = docInput.value;
        const nums = numbersInput.value
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n) && n >= 1 && n <= 45);

        if (nums.length < 6 || nums.length > 10) {
            alert("Please enter 6-10 valid numbers between 1 and 45");
            return;
        }

        console.log({ documentNumber: doc, numbers: nums });
        alert(`Submitted: ${doc} → [${nums.join(", ")}]`);
    });

    mainContent.appendChild(form);
}

async function init() {
    currentUser = await getCurrentUser();
    renderUser();
    renderMain();
}

document.addEventListener("DOMContentLoaded", init);