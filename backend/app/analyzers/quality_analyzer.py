def analyze_quality(df):
    df_missing_vals = [
        {
            "column": col,
            "missing": int(df[col].isna().sum()),
            "percentage": round((float(df[col].isna().sum()/len(df[col])*100) if len(df) > 0 else 0.0),2),
        }
        for col in df.columns
    ]
    
    memory_usage_mb = round(float((df.memory_usage(deep=True).sum()) / 100000),2)

    return {
        "missing_values": df_missing_vals,
        "duplicated_rows": int(df.duplicated().sum()),
        "memory_usage_mb": memory_usage_mb,
        "dataset_completeness": round((float((df.dropna(how='any').shape[0])/(len(df))*100) if len(df) > 0 else 100.0),2) 
    }
