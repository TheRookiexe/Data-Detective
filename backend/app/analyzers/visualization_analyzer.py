def analyze_visualizations(overview, quality, findings):
    data_type = overview["data_types"]
    numeric_cols = []
    non_numeric_cols = []
    vis = []
    for col in data_type:
        if col["data_type"] in ["int64", "int", "float", "float64"]:
            numeric_cols.append(col["column"])
            vis.append({
                "column": col["column"],
                "type": "histogram"
            })
        else:
            non_numeric_cols.append(col["column"])
            vis.append({
                "column": col["column"],
                "type": "bar"
            })
    
    return{
        "numeric_columns": numeric_cols,
        "non_numeric_columns": non_numeric_cols,
        "vis": vis
    }