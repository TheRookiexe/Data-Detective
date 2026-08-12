def analyze_findings(overview, quality):
    # missing values
    missing_vals =  quality["missing_values"]
    curr_col_per = 0
    for col in missing_vals:
        if float(col["percentage"]) > curr_col_per:
            curr_col_per = round(col["percentage"],2)
            curr_col = col["column"]
    if curr_col_per == 0:
        highest_missing_percentage='There are no columns with missing-values'
    else:
        highest_missing_percentage=f'{curr_col} column has the highest missing-value rate at {curr_col_per}%.'

    # data type
    numeric = 0
    overview_data_type= overview["data_types"]
    for item in overview_data_type:
        if item["data_type"] in ["int64", "int", "float", "float64"]:
            numeric+=1 
    numeric_percentage = round(float(numeric/len(overview_data_type)*100), 2)
    numeric_columns_percentage=''
    if numeric_percentage == 0:
        numeric_columns_percentage='Dataset does not contain any numeric columns.'
    elif numeric_percentage > 0:
        numeric_columns_percentage=f'{numeric} of {len(overview_data_type)} columns are numeric ({numeric_percentage}%).'

    # dataset completeness
    dataset_completeness = ''
    if quality["dataset_completeness"] >= 95:
        dataset_completeness=f'The dataset has high completeness, with {quality["dataset_completeness"]}% of rows containing no missing values.'
    elif quality["dataset_completeness"] >= 80:
        dataset_completeness=f'The dataset has moderate completeness, with {quality["dataset_completeness"]}% of rows containing no missing values.'
    elif quality["dataset_completeness"] < 80:
        dataset_completeness=f'The dataset has relatively low completeness, with {quality["dataset_completeness"]}% of rows containing no missing values.'

    # duplicated rows
    duplicate_rows = ''
    if quality["duplicated_rows"] == 0:
        duplicate_rows ='No duplicate rows were detected.'
    elif quality["duplicated_rows"] > 0:
        duplicate_rows=f'{quality["duplicated_rows"]} duplicate rows were detected.'

    insights = [
        dataset_completeness,
        duplicate_rows,
        highest_missing_percentage,
        numeric_columns_percentage
    ]

    return{
        "insights":insights,
    }