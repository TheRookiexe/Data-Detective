import pandas as pd

def analyze_overview(df):
    df_datatypes = [{
            "column": col,
            "data_type": str(df[col].dtypes)
        }
        for col in df.columns
    ]
    return{
            "rows": df.shape[0],
            "columns": df.shape[1],
            "column_names": df.columns.tolist(),
            "data_types": df_datatypes
        }

