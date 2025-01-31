from openai import OpenAI
import json

api_key = ''

client = OpenAI(api_key=api_key)

def get_response(prompt):
    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt,
        }
    ],
    model="gpt-4-turbo",
    )
    response = chat_completion.choices[0].message.content
    return response

def get_json_response(prompt):
    response = get_response(prompt)
    try:
        response = json.loads(response)
        return response
    except Exception as e:
        print(e)
        return {}

def get_text_lines(file_name):
    lines = []
    with open(file_name, 'r') as file:
        lines = file.readlines()
    return lines

def get_json_from_file(file_name):
    with open(file_name, 'r') as file:
        data = json.load(file)
        file.close()
        return data

def write_lines_to_file(lines, file_name):
    file_string = '\n'.join(lines)
    with open(file_name, 'w+') as file:
        file.write(file_string)
        file.close()

def write_json_to_file(json_data, file_name):
    with open(file_name, 'w+') as file:
        file.write(json.dumps(json_data, indent=4))
        file.close()