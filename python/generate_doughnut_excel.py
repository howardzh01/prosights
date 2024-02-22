# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
import modal

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_doughnut_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_doughnut_excel(req: Dict, workbook, sheetName="Sheet1", poweredBy=None):
    """
    'req' follows the structure:

    ```
    {
        columnTitles: [Category1, Category2, ...]
        datasets: [
            {
                Label1: datapoint,
                Label2: datapoint,
                ...
            },
            {
                Label1: datapoint,
                Label2: datapoint,
                ...
            },
            ...
        ]
    }
    ```

    Each category forms a section of data that will be converted to Excel doughnut charts.
    Each dataset will be labeled and separated by 2 blank rows. The length of the columnTitles
    array must be equal to the number of objects in the datasets array.
    """
    columnTitles = req.get("columnTitles", [])
    datasets = req.get("datasets", [])

    worksheet = workbook.add_worksheet(sheetName)

    max_widths = [len(title) for title in columnTitles] + [len("Visits")]

    default_font_format = workbook.add_format({'font_name': 'Arial', 'font_size': 8})

    title_format = workbook.add_format({'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8, 'bottom_color': 'black'})

    center_format = workbook.add_format({'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})

    current_row = 1

    if poweredBy:
        # Merge three cells for the "POWERED BY" text
        powered_by_format = workbook.add_format({'bold': True, 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})
        worksheet.merge_range('B2:D2', f"Powered by {poweredBy}", powered_by_format)
        # Adjust the starting row for data entries if "POWERED BY" text is added
        current_row += 2

    for index, dataset in enumerate(datasets):
        worksheet.write(current_row, 1, columnTitles[index], title_format)
        worksheet.write(current_row, 2, "Visits", title_format)
        current_row += 1
        for label, datapoint in dataset.items():
            worksheet.write(current_row, 1, label, center_format)
            worksheet.write(current_row, 2, datapoint, center_format)
            current_row += 1
        current_row += 2

    for col, width in enumerate(max_widths):
        worksheet.set_column(col + 1, col + 1, width + 2, center_format)

    worksheet.set_row(0, None, default_font_format)
    for row_num in range(1, current_row):
        worksheet.set_row(row_num, None, default_font_format)

    current_chart_row = 4 if poweredBy else 2  # Initialize the row for the data for the first chart
    current_graph_row = 2  # Initialize the row for the graph for the first chart
    for dataset in datasets:
        current_chart_row, current_graph_row = add_doughnut_chart_for_dataset(workbook, worksheet, dataset, current_chart_row, current_graph_row, sheetName)

def add_doughnut_chart_for_dataset(workbook, worksheet, dataset, data_starting_row, graph_starting_row, sheet_name="Sheet1"):
    chart = workbook.add_chart({'type': 'doughnut'})
    dataset_length = len(dataset)
    data_start_row = data_starting_row + 1  # Data starts one row after the data_starting_row
    data_end_row = data_start_row + dataset_length - 1

    safe_sheet_name = f"'{sheet_name}'"
    chart.add_series({
        'categories': f'={safe_sheet_name}!$B${data_start_row}:$B${data_end_row}',
        'values': f'={safe_sheet_name}!$C${data_start_row}:$C${data_end_row}',
        'data_labels': {
            'percentage': True,
            'font': {'name': 'Arial', 'size': 8, 'color': '#404040'}
        },
        'points': [{'fill': {'color': '#1CAFF2'}}],
        'border': {'none': True},
    })

     # Set the legend properties.
    chart.set_legend({'position': 'right', 'font': {'color': '#404040'}})
    chart.set_title({'none': True})

    worksheet.insert_chart(f'F${graph_starting_row}', chart, {'x_scale': 1, 'y_scale': 1})

    return data_end_row + 3, graph_starting_row + 20