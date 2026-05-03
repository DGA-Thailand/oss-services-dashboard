import pandas as pd

try:
    df = pd.read_excel('services_all-3-5-2026.xlsx', sheet_name='งานบริการ')
    print('--- Columns ---')
    print(df.columns.tolist())
    
    print('\n--- Statuses ---')
    print(df['สถานะ'].value_counts(dropna=False))
    
    reason_cols = [c for c in df.columns if 'เหตุผล' in c or 'reason' in c.lower()]
    print(f'\nReason columns found: {reason_cols}')
    
    for col in reason_cols:
        print(f'\n--- {col} ---')
        print(df[col].value_counts(dropna=False))
except Exception as e:
    print(f"Error: {e}")
