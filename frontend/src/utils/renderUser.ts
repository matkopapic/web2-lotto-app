import {User} from "../models/user.js";

const userInfoDiv = document.getElementById("user-info") as HTMLDivElement;
const usernameSpan = document.getElementById("username") as HTMLSpanElement;
const userPic = document.getElementById("user-pic") as HTMLImageElement;
const userDropdown = document.getElementById("user-dropdown") as HTMLDivElement;
const accountEmail = document.getElementById("account-email") as HTMLParagraphElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
const dropdownIndicatorActive = document.getElementById("dropdown-indicator-active") as HTMLDivElement;
const dropdownIndicatorInactive = document.getElementById("dropdown-indicator-inactive") as HTMLDivElement;

export function renderUser(currentUser: User | null) : void {
    if (currentUser) {
        userPic.src = currentUser.picture;
        usernameSpan.textContent = currentUser.username;
        accountEmail.textContent = currentUser.email;

        userInfoDiv.classList.remove("hidden");

        userInfoDiv.addEventListener("click", () => {
            userDropdown.classList.toggle("hidden");
            dropdownIndicatorInactive.classList.toggle("hidden");
            dropdownIndicatorActive.classList.toggle("hidden");
        });

        logoutBtn.addEventListener("click", () => {
            window.location.href = "/logout";
        });
    } else {
        userInfoDiv.classList.add("hidden");
    }
}