import util as util
import csv

failure_responses = []


def generate_prompt_for_tickets(tickets):
  # questions are an array [[question_id, booking_id, description]]
  # formatted_questions = array of ['question_id - description']
  backslash_n = '\\n'
  formatted_tickets = []
  for ticket in tickets:
    formatted_tickets.append(f'{ticket[0]} - {ticket[2]}')
  prompt = f"""
  The following questions are specified in this format:

  QuestionId: responseType
    Question Text

  Questions

  IsTechnicalIssue: Boolean
    Was this ticket raised because the user experienced a technical glitch? for instance,
    unable to book is a technical glitch. Not recieving credits is a technical glitch.

  TechnicalIssue: Enumerator
    In a single enumerator style word, describe the technical issue. For instance, if the user is not able to see the booking, list it as unable_to_view_booking

  isSpaceIssue: Boolean
    Was this issue raised because the user did not enjoy the booking? For instance, noisy workspace is a space issue.

  Amenity: Single Word
    Was there a particular amenity they had a problem with? (eg parking, wifi, coffee etc)

  SpaceExperience: Enumerator
    was there a particular aspect about the space they had a problem with (eg poor lighting, no good ambience etc)

  Location: Boolean
    Were they having difficulty in finding the space? Or did they not like the space

  ConfusingUserJourney: Small Text
    Was this ticket raised because the user did not understand what was going on? For instance, them booking a space by mistake is confusing user journey

  ConfusingFeature: Small Text
    if the user was confused, what exactly were they confused about? use an enum
  
  TechInterventionNeeded: Small Text
    If this kind of ticket can be resolved by a technical enhancement, what would that be? For instance, better email communication or monitoring, error handling etc.
    A space related technical issue is not a tech intervention, only the app/website issues 

  ProductInterventionNeeded: Small Text
    If this kind of ticket can be resolved by a product enhancement, what would that be? For instance, better error modal, better booking flow etc.
    A space related issue is not a product intervention, only the app/website issues 

  For each of the following tickets raised by users, answer all of the above questions.

  Report the answer in the following format:

  ticket_id - question_id - answer

  Do NOT ADD ANY EXTRA TEXT OR COMMENTS. JUST THE ANSWERS IN THE SPECIFIC FORMAT.
  Tickets:
  ```
  {backslash_n.join(formatted_tickets)}
  ```
  """
  return prompt

def prompt_and_get_responses(tickets):
  prompt = generate_prompt_for_tickets(tickets)
  response = util.get_response(prompt)
  # response = ticket_id - question_id - answer
  responses = response.split('\n')
  responses = [response.split(' - ') for response in responses]
  return responses

def parse_responses(ticket_responses, input_file_rows):
  # ticket_responses = [[ticket_id, question_id, answer]]
  # input_file_rows = [[ticket_id, booking_id, description]]
  # output_file_rows = [[ticket_id, booking_id, description, question_id1:answer1, question_id2:answer2, ...]]
  output_file_rows = []
  for input_row in input_file_rows:
    try:
      ticket_id = input_row[0]
      booking_id = input_row[1]
      description = input_row[2]
      response_row = [ticket_id, booking_id, description]
      for ticket_response in ticket_responses:
        # replace - and spaces from ticket responses
        formatted_ticket_response = ticket_response[0].replace('-', '').replace(' ', '')
        if formatted_ticket_response == ticket_id:
          response_row.append(f'{ticket_response[1]}:{ticket_response[2]}')
      is_input_row_found_in_tickets = False
      for response in response_row[3:]:
        if response.startswith('IsTechnicalIssue'):
          is_input_row_found_in_tickets = True
      if is_input_row_found_in_tickets:
        output_file_rows.append(response_row)
    except Exception as e:
      print('Error parsing responses for ticket', input_row[0])
  return output_file_rows

def generate_csv(rows, question_ids, header):
  # row = [ticket_id, booking_id, description, question_id1:answer1, question_id2:answer2, ...]
  # makes sure that question answers are in a fixed order of question ids
  # output = [[ticket_id, booking_id, description, answer1, answer2, ...]]
  output_rows = []
  for row in rows:
    output_row = [row[0], row[1], row[2]]
    for question_id in question_ids:
      answer = ''
      for response in row[3:]:
        if response.startswith(question_id):
          answer = response.split(':')[1]
      output_row.append(answer)
    output_rows.append(output_row)
  if (header):
    output_rows.insert(0, header)
  return output_rows

def print_file(rows, file_name):
  with open(file_name, 'w+', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(rows)

def read_file(file_name):
  with open(file_name, 'r') as file:
    reader = csv.reader(file)
    rows = [row for row in reader]
  return rows

def write_file(rows, file_name):
  with open(file_name, 'w+', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(rows)

def test():
  batch_size = 10
  input_file = 'formatted_tickets.csv'
  input_file_rows = read_file(input_file)
  for i in range(0, len(input_file_rows), batch_size):
    tickets = input_file_rows[i:i+batch_size]
    prompt_responses = prompt_and_get_responses(tickets)
    parsed_rows = parse_responses(prompt_responses, input_file_rows)
    header = ['ticket_id', 'booking_id', 'description', 'IsTechnicalIssue', 'TechnicalIssue', 'isSpaceIssue', 'Amenity', 'SpaceExperience', 'Location', 'ConfusingUserJourney', 'ConfusingFeature', 'TechInterventionNeeded', 'ProductInterventionNeeded']
    csv_file = generate_csv(parsed_rows, ['IsTechnicalIssue', 'TechnicalIssue', 'isSpaceIssue', 'Amenity', 'SpaceExperience', 'Location', 'ConfusingUserJourney', 'ConfusingFeature', 'TechInterventionNeeded', 'ProductInterventionNeeded'], header)
    file_name = f'tagged_tickets_{i}.csv'
    write_file(csv_file, file_name)
    print(f'Saved responses to {file_name}')
    write_file(failure_responses, 'failure_responses.csv')

if __name__ == '__main__':
    test()