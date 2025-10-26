import {getCurrentUser} from "../utils/getCurrentUser.js";
import {User} from "../models/user.js";
import {renderUser} from "../utils/renderUser.js";

const mainContent = document.getElementById("main-content") as HTMLDivElement;
const form = document.getElementById("ticket-form") as HTMLFormElement;
const documentNumberInput = document.getElementById("document-number-input") as HTMLInputElement;
const documentError = document.getElementById("document-error") as HTMLInputElement;
const ticketNumbersInput = document.getElementById("numbers-input") as HTMLInputElement;
const numbersError = document.getElementById("numbers-error") as HTMLInputElement;

let currentUser: User | null = null;

function renderForm() {
    mainContent.innerHTML = "";

    if (!currentUser) {
        const loginMsg = document.createElement("p");
        loginMsg.innerHTML = '<a href="/login">Login</a> to add a new ticket';
        mainContent.appendChild(loginMsg);
        return
    }

    form.classList.remove("hidden");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const documentNumber = documentNumberInput.value;
        const numbers = ticketNumbersInput.value;

        let isError = false;

        if (documentNumber.length < 1 || documentNumber.length > 20) {
            isError = true;
            documentError.innerHTML = "Document number length must be between 1 and 20";
        } else if (!/^\d+$/.test(documentNumber)) { // check if only digits in string
            isError = true;
            documentError.innerHTML = "Invalid document number, please use only digits 0-9";
        } else {
            documentError.innerHTML = "";
        }


        const nums = numbers
            .split(",")
            .map((n) => n.trim());

        if (nums.length < 6 || nums.length > 10) {
            isError = true;
            numbersError.innerHTML = "Please enter only 6-10 numbers";
        } else if (new Set(nums).size !== nums.length) {
            isError = true;
            numbersError.innerHTML = "Duplicate values are not allowed";
        } else {
            for (let num of nums) {
                let parsedNum = parseInt(num);
                if (isNaN(parsedNum)) {
                    isError = true;
                    if (num.length == 0) {
                        numbersError.innerHTML = "There is an empty value among the numbers";
                    } else {
                        numbersError.innerHTML = `${num} is not a valid number`;
                    }
                    break;
                }

                if (parsedNum < 1 || parsedNum > 45) {
                    isError = true;
                    numbersError.innerHTML = `${num} is not between 1 and 45`;
                    break;
                }

                numbersError.innerHTML = "";
            }
        }

        if (isError) {
            documentError.classList.remove("hidden");
            numbersError.classList.remove("hidden");
            return;
        } else {
            documentError.classList.add("hidden");
            numbersError.classList.add("hidden");
            form.submit();
        }
    });

    mainContent.appendChild(form);
}

async function init() {
    currentUser = await getCurrentUser();
    renderUser(currentUser)
    renderForm();
}

document.addEventListener("DOMContentLoaded", init);