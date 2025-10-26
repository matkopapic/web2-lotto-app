import {getCurrentUser} from "../utils/getCurrentUser.js";
import {User} from "../models/user.js";
import {renderUser} from "../utils/renderUser.js";
import {getActiveRound} from "../utils/getActiveRound.js";
import {RoundInfo} from "../models/roundInfo.js";
import {formatDate} from "../utils/formatDate.js";

let currentUser: User | null = null;
let activeRound: RoundInfo | null = null;

const mainContent = document.getElementById("main-content") as HTMLDivElement;

function renderMain() {
    mainContent.innerHTML = "";

    if (!activeRound) {
        const roundErrorMessage = document.createElement("p");
        roundErrorMessage.innerHTML = 'There has been error while loading the latest round, please try again';
        mainContent.appendChild(roundErrorMessage);
        return
    }

    const roundStatusMessage = document.createElement("p");
    roundStatusMessage.classList.add("round-status-message");
    const createNewTicket = document.createElement("p");

    if (activeRound.drawnAt && activeRound.drawnNumbers) {
        roundStatusMessage.innerHTML = `
        <span class="round-status-message-highlight">Round ${activeRound.roundNum} has ended</span> and the numbers have been drawn: <span class="round-status-message-highlight">${activeRound.drawnNumbers}</span></br>
        Wait until the next round begins to enter a new ticket.
        `
    } else if (activeRound.endedAt) {
        roundStatusMessage.innerHTML = `
        <span class="round-status-message-highlight">Round ${activeRound.roundNum} has ended</span>, and we are waiting for numbers to be drawn.</br>
        The drawn numbers will be published here.</br>
        Wait until the next round begins to enter a new ticket.
        `
    } else {
        roundStatusMessage.innerHTML = `
        <span class="round-status-message-highlight"> Round ${activeRound.roundNum} is active.</span></br>
        You can enter tickets at the link below.
        `
        createNewTicket.innerHTML = '<a href="/new-ticket">New ticket</a>';
    }
    mainContent.appendChild(roundStatusMessage);
    mainContent.appendChild(createNewTicket);

    if (!currentUser) {
        const loginMsg = document.createElement("p");
        loginMsg.innerHTML = '<a href="/login">Login</a> to continue';
        mainContent.appendChild(loginMsg);
        return
    }

    renderTickets(activeRound);
}

function renderTickets(roundInfo: RoundInfo) {
    if (!roundInfo.userTickets) return
    const ticketListMessage = document.createElement("p");
    if (roundInfo.userTickets.length == 0) {
        ticketListMessage.innerHTML = `You haven't entered any ticket for round number ${roundInfo.roundNum}`
    } else {
        ticketListMessage.innerHTML = `You have entered ${roundInfo.userTickets.length} tickets for round number ${roundInfo.roundNum}`
    }
    mainContent.appendChild(ticketListMessage);

    if (roundInfo.userTickets.length == 0) return

    const tableContainer = document.createElement("div") as HTMLDivElement;
    tableContainer.classList.add("table-container");
    tableContainer.innerHTML = `
        <table>
            <thead>
            <tr class="table-headers">
                <th>Round Number</th>
                <th>Document Number</th>
                <th>Numbers</th>
                <th>Entered At</th>
                <th>Link</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    `
    const tableBody = tableContainer.querySelector("tbody") as HTMLTableSectionElement;

    roundInfo.userTickets.forEach((ticket) => {
        const ticketListItem = document.createElement("tr");
        ticketListItem.innerHTML = `
            <td>${activeRound?.roundNum}</td>
            <td>${ticket.documentNum}</td>
            <td>${ticket.numbers}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <a href="/ticket/${ticket.id}">View</a>
            </td>
        `;

        tableBody.appendChild(ticketListItem);
    })

    mainContent.appendChild(tableContainer);
}

async function init() {
    let currentUserPromise = getCurrentUser();
    let activeRoundPromise = getActiveRound();
    currentUser = await currentUserPromise;
    activeRound = await activeRoundPromise;
    renderUser(currentUser);
    renderMain();
}

document.addEventListener("DOMContentLoaded", init);