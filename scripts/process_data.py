import pandas as pd
import json
import os

def process():
    print("Reading Excel file...")
    # Read sheets and drop empty IDs (like total rows)
    df_services = pd.read_excel('services_all-3-5-2026.xlsx', sheet_name='งานบริการ')
    df_services = df_services.dropna(subset=['service_id'])
    
    df_projects = pd.read_excel('services_all-3-5-2026.xlsx', sheet_name='โครงการ')
    df_projects = df_projects.dropna(subset=['project_id'])

    services_records = df_services.to_dict(orient='records')
    projects_records = df_projects.to_dict(orient='records')

    data = {
        "services": services_records,
        "projects": projects_records
    }

    # Clean up NaNs
    for s in data['services']:
        for k, v in s.items():
            if pd.isna(v):
                s[k] = None

    for p in data['projects']:
        for k, v in p.items():
            if pd.isna(v):
                p[k] = None

    os.makedirs('public', exist_ok=True)
    with open('public/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False)
    
    print(f"Saved {len(services_records)} services and {len(projects_records)} projects to public/data.json")

if __name__ == "__main__":
    process()
