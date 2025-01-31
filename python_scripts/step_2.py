import csv
import json
from datetime import datetime



def read_data_from_json(file_name):
  with open(file_name, 'r') as file:
    data = json.load(file)
    file.close()
    return data

def read_data_from_csv(file_name):
  with open(file_name, 'r') as file:
    reader = csv.reader(file)
    rows = [row for row in reader]
  # remove the header
  rows = rows[1:]
  return rows

def populate_csv_with_additional_data(csv_data, json_data):
  rows = []
  for row in csv_data:
    ticket_id = row[0]
    for ticket in json_data:
      if ticket['id'] == ticket_id:
        row.append(ticket['statusType'])
        row.append(ticket['status'])
        row.append(ticket['isEscalated'])
        row.append(ticket['createdTime'])
        row.append(ticket['closedTime'])
        row.append(ticket['assigneeId'])
        # closed time - created time in hours = hours for ticket closure
        # created time = "2025-01-09T08:09:07.000Z"
        # closed time = "2025-01-09T08:09:07.000Z"
        if (ticket['closedTime'] == None or ticket['createdTime'] == None):
          row.append(0)
          continue
        created_at = datetime.fromisoformat(ticket['createdTime'].replace('Z', '+00:00'))
        closed_at = datetime.fromisoformat(ticket['closedTime'].replace('Z', '+00:00'))
        hours_to_close = (closed_at - created_at).total_seconds() / 3600
        row.append(hours_to_close)
    rows.append(row)
  return rows

def write_data_to_csv(rows, file_name):
  header = ['ticket_id','booking_id','description','IsTechnicalIssue','TechnicalIssue', 'isSpaceIssue', 'Amenity', 'SpaceExperience', 'Location', 'ConfusingUserJourney', 'ConfusingFeature', 'TechInterventionNeeded', 'ProductInterventionNeeded', 'statusType', 'status', 'isEscalated', 'createdTime', 'closedTime', 'assigneeId', 'hoursToClose']
  rows.insert(0, header)
  with open(file_name, 'w+', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(rows)

def main():
  csv_file = 'combined_tickets.csv'
  json_file = 'tickets.json'
  csv_data = read_data_from_csv(csv_file)
  json_data = read_data_from_json(json_file)
  rows = populate_csv_with_additional_data(csv_data, json_data)
  write_data_to_csv(rows, 'combined_tickets_with_additional_data.csv')
  print('Combined tickets with additional data saved to combined_tickets_with_additional_data.csv')

if __name__ == '__main__':
  main()