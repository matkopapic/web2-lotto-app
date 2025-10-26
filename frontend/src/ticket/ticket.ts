import {RoundInfo} from "../models/roundInfo.js";
import {formatDate} from "../utils/formatDate.js";
import {getTicketInfo} from "../utils/getTicketInfo.js";

const roundNum = document.getElementById("round-num") as HTMLElement;
const startedAtText = document.getElementById("started-at") as HTMLElement;
const roundStatus = document.getElementById("round-status") as HTMLElement;
const drawnNumbersText = document.getElementById("drawn-numbers") as HTMLElement;
const qrCodeImg = document.getElementById("qr-code") as HTMLImageElement;
const ticketId = document.getElementById("ticket-id") as HTMLElement;
const ticketDocumentNum = document.getElementById("ticket-document") as HTMLElement;
const ticketNumbers = document.getElementById("ticket-numbers") as HTMLElement;
const ticketDate = document.getElementById("ticket-entered") as HTMLElement;
const loadingText = document.getElementById("loading-text") as HTMLElement;
const ticketContainer = document.querySelector(".container") as HTMLElement;

function populateTicket(roundInfo: RoundInfo | null) {
    if (!roundInfo) {
        loadingText.innerHTML = "There has been an error while fetching ticket info";
        return
    }

    roundNum.innerHTML = roundInfo.roundNum.toString();
    startedAtText.innerHTML = formatDate(roundInfo.startedAt);

    if (!roundInfo.endedAt && !roundInfo.drawnAt) {
        roundStatus.innerHTML = "Round is currently ongoing.";
    } else if (roundInfo.endedAt && !roundInfo.drawnAt) {
        roundStatus.innerHTML = `Round has ended at ${roundInfo.endedAt}. Draw has not been done yet.`;
    } else if (roundInfo.drawnAt) {
        roundStatus.innerHTML = `Numbers have been drawn at ${roundInfo.drawnAt}!`;
    }

    if (roundInfo.drawnNumbers && roundInfo.drawnNumbers.length > 0) {
        drawnNumbersText.innerHTML = `Drawn numbers: ${roundInfo.drawnNumbers.toString()}`;
    }

    if (!roundInfo.userTickets) {
        loadingText.innerHTML = "There has been an error while fetching ticket info";
        return
    }

    const ticket = roundInfo.userTickets[0];

    ticketId.innerHTML = ticket.id;
    ticketDocumentNum.innerHTML = ticket.documentNum;
    ticketNumbers.innerHTML = ticket.numbers.join(", ");
    ticketDate.innerHTML = formatDate(ticket.createdAt);

    qrCodeImg.src = `/ticket/${ticket.id}/code`;

    loadingText.classList.add("hidden");
    ticketContainer.classList.remove("hidden");
}

async function init() {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const ticketId = pathSegments[1];
    const roundInfo = await getTicketInfo(ticketId);

    populateTicket(roundInfo);
}

document.addEventListener("DOMContentLoaded", init);
