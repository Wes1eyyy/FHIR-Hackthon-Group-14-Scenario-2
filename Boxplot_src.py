import requests
from datetime import datetime
import matplotlib.pyplot as plt
import re

def is_pure_numeric_id(s):
    return re.match(r'^\d+$', s) is not None

def calculate_age(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    today = datetime.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def fetch_patient_details(patient_id):
    base_url = f"https://hapi.fhir.org/baseR4/Patient/{patient_id}?_elements=gender,birthDate"
    header = {"Accept": "application/fhir+json"}
    response = requests.get(base_url, headers=header).json()
    
    gender = response.get("gender", "Unknown")
    birth_date = response.get("birthDate", None)
    
    age = None
    if birth_date:
        age = calculate_age(birth_date)
    
    return gender, age

def fetch_conditions_and_patients(condition, request_limit=1):
    base_url = f"https://hapi.fhir.org/baseR4/Condition?_content={condition}&_elements=subject"
    header = {"Accept": "application/fhir+json"}
    patient_details = []

    for _ in range(request_limit):
        response = requests.get(base_url, headers=header).json()
        if "entry" in response:
            for entry in response['entry']:
                resource = entry['resource']
                patient_id = resource['subject']['reference'].split('/')[1]

                if is_pure_numeric_id(patient_id):
                    gender, age = fetch_patient_details(patient_id)
                    patient_details.append({"id": patient_id, "gender": gender, "age": age})
        
        next_link = [link['url'] for link in response.get('link', []) if link['relation'] == 'next']
        if next_link:
            base_url = next_link[0] 
        else:
            break

    return patient_details

def plot_age_distribution_by_gender(patient_info, condition, filename='boxplot.png'):
    ages_male = [p['age'] for p in patient_info if p['gender'] == 'male']
    ages_female = [p['age'] for p in patient_info if p['gender'] == 'female']
    
    ages_by_gender = {'Male': ages_male, 'Female': ages_female}
    
    fig, ax = plt.subplots()
    ax.boxplot(ages_by_gender.values(), labels=ages_by_gender.keys())
    ax.set_title(f'{condition} Boxplot Age Distribution by Gender({len(patient_info)} number of patients)')
    ax.set_xlabel('Gender')
    ax.set_ylabel('Age')
    plt.savefig(filename)
    #plt.show()

    plt.close()

condition = "Asthma"
Datasets_size = 3  # 1 represents 20 patients ()
patient_info = fetch_conditions_and_patients(condition, Datasets_size)
for info in patient_info:
    print(info)

plot_age_distribution_by_gender(patient_info, condition)