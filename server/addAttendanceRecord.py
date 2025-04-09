import json

new_record ={
    "id": "2345",
    "eventId": "7800",
    "taId": "123",
    "date": "2025-03-27",
    "status": "Present"
  }

jsonFile = "../public/attendance.json"

try:
    with open(jsonFile, "r") as file:
        data = json.load(file)

    data.append(new_record)

    with open(jsonFile, "w") as file:
        json.dump(data, file ,indent=4)

    print("New attendance record added successfully!")

except (FileNotFoundError, json.JSONDecodeError):
    with open(jsonFile, "w") as file:
        json.dump([new_record], file, indent=4)
    print("File didn't exist or was empty, created a new one with the first record.")

