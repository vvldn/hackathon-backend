# Data Pipeline for Offline Analysis

## Step 1
From all the tickets for a month, take relevant fields - ticketId, user's description and bookingId (if present)
```
python3 step0.py
```
creates output `formatted_tickets.csv`

## Step 2
From the sanitized output, tag each query with our primary criterias, including technical challenges, product intervention etc for each ticket. Uses openAI apis, and processes the query in a batch of 10.

```
python3 step1.py
```
creates output `tagged_tickets.csv`

## Step 3
Add additional information to the tickets (currently done offline since zoho apis took time) - including when the ticket was closed, resolution status etc.
```
python3 step2.py
```
creates output `populated_tickets.csv`

## Step 4
Create a summary json of the populated ticket to generate insights dynamically
```
python3 step3.py
```
creates output `summary.json`

---

The Express App refers to the `summary.json` to generate analytics and insights to present to the user. `summary.json` acts as a condensed repository of all the trends needed for us to generate these insights.