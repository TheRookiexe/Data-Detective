import re
def analyze_visualizations(df ,overview, quality, findings):
    data_type = overview["data_types"]
    numeric_cols = []
    non_numeric_cols = []
    vis = []
    for col in data_type:
        if col["data_type"] in ["int64", "int", "float", "float64"]:
            numeric_cols.append(col["column"])
            if "id" in re.split(r"[ _]+", col["column"].lower()):
                vis.append({
                    "column": col["column"],
                    "unique_values": df[col["column"]].nunique(),
                    "type": "identifier"
                })
            else: 
                vis.append({
                    "column": col["column"],
                    "unique_values": df[col["column"]].nunique(),
                    "type": "histogram"
                })
        elif col["data_type"] in ["str"]:
            non_numeric_cols.append(col["column"])
            if df[col["column"]].nunique() <= 10:
                vis.append({
                    "column": col["column"],
                    "unique_values": df[col["column"]].nunique(),
                    "type": "bar"
                })
            else:
                vis.append({
                    "column": col["column"],
                    "unique_values": df[col["column"]].nunique(),
                    "type": "high_cardinality"
                })
    return{
        "numeric_columns": numeric_cols,
        "non_numeric_columns": non_numeric_cols,
        "vis": vis
    }