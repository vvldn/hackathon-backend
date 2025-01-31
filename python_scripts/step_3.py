import csv
import json

def isYes(value):
  return value.lower() == 'yes' or value.lower() == 'true'

def isNotNo(value):
  no_values = ['no', 'none', '', 'n/a', 'false', '-']
  return value.lower() not in no_values

def filter_junk_key_words(keywords):
  junk_words = ['', 'n/a', 'none', 'no', 'false', '-', 'true', 'yes']
  # case insensitive check for junk words
  return [keyword for keyword in keywords if keyword.lower() not in junk_words]

def read_csv_file(file_name):
  with open(file_name, 'r') as file:
    reader = csv.reader(file)
    rows = [row for row in reader]
  # remove the header
  rows = rows[1:]
  return rows

def get_summary_dictionary(rows):
  # row = ['ticket_id','booking_id','description','IsTechnicalIssue','TechnicalIssue', 'isSpaceIssue', 'Amenity', 'SpaceExperience', 'Location', 'ConfusingUserJourney', 'ConfusingFeature', 'TechInterventionNeeded', 'ProductInterventionNeeded', 'statusType', 'status', 'isEscalated', 'createdTime', 'closedTime', 'assigneeId', 'hoursToClose']
  # summary =
  '''
    {
      offlineIssues: {
        keyWords: [
          {
            word: '',
            frequency: 10,
          }
        ],
      },
      techAndProductIssues: {
        keyWords: [
          {
          word: '',
          frequency: 10,
          }
        ],
      },
      confusingIssues: {
        keyWords: [
          {
          word: '',
          frequency: 10,
          }
        ],
      }
    }
  '''
  summary = {
    'offlineIssues': {
      'keyWords': []
    },
    'techAndProductIssues': {
      'keyWords': []
    },
    'confusingIssues': {
      'keyWords': []
    }
  }
  for row in rows:
    isTechnicalIssue = isYes(row[3])
    isProductIssue = isNotNo(row[12]) or isNotNo(row[11])
    isConfusingUserJourney = isYes(row[9])
    isOfflineIssue = isYes(row[5]) or isNotNo(row[6]) or isNotNo(row[7]) or isNotNo(row[8])
    if (isOfflineIssue):
      keywords = filter_junk_key_words([row[6], row[7], row[8]])
      for keyword in keywords:
        if keyword:
          found = False
          for word in summary['offlineIssues']['keyWords']:
            if word['word'] == keyword:
              word['frequency'] += 1
              found = True
              break
          if not found:
            summary['offlineIssues']['keyWords'].append({'word': keyword, 'frequency': 1, 'ticket_id': row[0] })
    if (isTechnicalIssue or isProductIssue):
      keywords = filter_junk_key_words([row[4], row[11], row[12]])
      for keyword in keywords:
        if keyword:
          found = False
          for word in summary['techAndProductIssues']['keyWords']:
            if word['word'] == keyword:
              word['frequency'] += 1
              found = True
              break
          if not found:
            summary['techAndProductIssues']['keyWords'].append({'word': keyword, 'frequency': 1,  'ticket_id': row[0] })
    if (isConfusingUserJourney):
      keywords = filter_junk_key_words([row[10]])
      for keyword in keywords:
        if keyword:
          found = False
          for word in summary['confusingIssues']['keyWords']:
            if word['word'] == keyword:
              word['frequency'] += 1
              found = True
              break
          if not found:
            summary['confusingIssues']['keyWords'].append({'word': keyword, 'frequency': 1,  'ticket_id': row[0] })
  return summary

def print_json_file(summary):
  file_name = 'summary.json'
  with open(file_name, 'w') as file:
    json.dump(summary, file, indent=2)

def main():
  file_name = 'combined_tickets_with_additional_data.csv'
  rows = read_csv_file(file_name)
  summary = get_summary_dictionary(rows)
  print_json_file(summary)
  print('done')

if __name__ == '__main__':
  main()
