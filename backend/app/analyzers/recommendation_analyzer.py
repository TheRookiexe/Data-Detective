def analyze_recommendations(overview, quality, findings):

    # total missing values
    col_info = quality["missing_values"]
    findings_data = findings["data"]
    total_missing_values = 0
    missing_vals = ''
    for item in col_info:
        total_missing_values+=item["missing"]
    if total_missing_values > 0:
        missing_vals = f'Review the {total_missing_values} missing values across the dataset, particularly in the {findings_data["highest_missing"]["column"]} column.'

    #duplicated rows
    duplicate_rows = ''
    if quality["duplicated_rows"] > 0:
        duplicate_rows = f'Review the {quality["duplicated_rows"]} duplicated rows and remove them if they represent repeated records.'

    #completeness
    completeness = ''
    if findings_data["data_completeness"] < 80:
        completeness = f'Investigate the missing data because dataset completeness is {findings_data["data_completeness"]}%, below the 80% threshold.'

    suggestions = []
    if missing_vals:
        suggestions.append(missing_vals)
    if duplicate_rows:
        suggestions.append(duplicate_rows)
    if completeness:
        suggestions.append(completeness)


    return{
        "suggestions": suggestions
    }