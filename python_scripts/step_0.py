# read a csv file and get ticket descriptions
# output: a list of ticket descriptions

import csv

def readFileAndGetDescriptions(fileName):
    descriptions = []
    ticketIds = []
    bookingIds = []
    with open(fileName, 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            # row format:
            # ,,,"[Ticket Description]"
            descriptions.append(row[5])
            ticketIds.append(row[8])
            bookingIds.append(row[9])
    return descriptions, ticketIds, bookingIds

def printOutput(descriptions):
    for description in descriptions:
        print(description)

def main():
    fileName = 'tickets.csv'
    descriptions, ticketIds, bookingIds = readFileAndGetDescriptions(fileName)
    ticket_length = len(ticketIds)
    formatted_rows = []
    for i in range(ticket_length):
        formatted_rows.append([ticketIds[i], bookingIds[i], descriptions[i]])
    with open('formatted_tickets.csv', 'w+', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(formatted_rows)

if __name__ == '__main__':
    main()