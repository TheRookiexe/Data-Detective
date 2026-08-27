import re
import numpy as np


def is_identifier(column_name):
    column = column_name.lower().strip()

    if column in ["index", "row_id"]:
        return True

    if column.startswith("unnamed:"):
        return True

    tokens = re.split(r"[ _]+", column)

    return "id" in tokens


def analyze_visualizations(df, overview, quality, findings):

    data_type = overview["data_types"]
    numeric_cols = []
    non_numeric_cols = []
    vis = []

    for col in data_type:
        column_name = col["column"]
        column_type = col["data_type"]

        if column_type in ["int64", "int", "float", "float64"]:
            numeric_cols.append(column_name)
            unique_values = df[column_name].nunique()

            if is_identifier(column_name):
                vis.append({
                    "column": column_name,
                    "unique_values": unique_values,
                    "type": "identifier"
                })
            else:
                values = df[column_name].dropna()

                counts, bin_edges = np.histogram(values, bins=20)

                vis.append({
                    "column": column_name,
                    "unique_values": unique_values,
                    "type": "histogram",
                    "data": {
                        "bins": [round(value, 2) for value in bin_edges.tolist()],
                        "counts": counts.tolist()
                    }
                })

        # Non-numeric columns
        elif column_type in ["str"]:
            non_numeric_cols.append(column_name)

            unique_values = df[column_name].nunique()

            if unique_values <= 10:
                value_counts = df[column_name].value_counts()

                vis.append({
                    "column": column_name,
                    "unique_values": unique_values,
                    "type": "bar",
                    "data": {
                        "labels": value_counts.index.tolist(),
                        "values": value_counts.values.tolist()
                    }
                })
            else:
                vis.append({
                    "column": column_name,
                    "unique_values": unique_values,
                    "type": "high_cardinality"
                })

    return {
        "numeric_columns": numeric_cols,
        "non_numeric_columns": non_numeric_cols,
        "vis": vis
    }