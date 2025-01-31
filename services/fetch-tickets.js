import fs from 'fs';
// import axios from 'axios';
const { fetch } = utils;

const ticketIds = [
    "215431000159528001", 
    "215431000160320825", "215431000161918264", "215431000159287945", 
    "215431000159105013", "215431000160535512", "215431000159840025", "215431000159625061", 
    "215431000160155001", "215431000160606924"
]

const orgId = '653124861';
const authToken = '1000.24ed6582cd3f3a64b9eab5df82b3221e.24e6305ab7f6800b3b9ee8e2025c706a';
const outputFile = 'tickets975.json';

async function fetchTickets() {
    let results = [];
    let cnt = 0;
    for (const ticketId of ticketIds) {
        cnt++;
        try {

            const url = `https://desk.zoho.com/api/v1/tickets/${ticketId}`;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'orgId': orgId,
                    'Authorization': `Zoho-oauthtoken ${authToken}`
                },
            };
            const ticketResult = await fetch.fetchWithTimeout(url, requestOptions);
            const ticket = ticketResult.data;
            // ticket.customFields = null;
            // ticket.cf = null;


            const url1 = `https://desk.zoho.com/api/v1/tickets/${ticketId}/resolution`;
            const requestOptions1 = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'orgId': orgId,
                    'Authorization': `Zoho-oauthtoken ${authToken}`
                },
            };
            const resolutionResult = await fetch.fetchWithTimeout(url1, requestOptions1);
            const resolution = resolutionResult.data;

            ticket.resolution = resolution;

            if (ticket.errorCode) throw ticket;

            console.log(`Ticket ${cnt}: ${ticketId} processed`)
            results.push(ticket);
            // return result.data;

        } catch (error) {
            console.log(`Ticket: ${ticketId} errred `);
            // console.error(`Error fetching ticket ${ticketId}:`, error.response ? error.response.data : error.message);
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`Tickets saved to ${outputFile}`);
}

export default {
    fetchTickets: tryCatchWrapper(fetchTickets)
}