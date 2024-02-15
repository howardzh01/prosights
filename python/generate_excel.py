# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
import modal

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_excel(req: Dict):
    """
    'req' follows the structure:

    ```
    {
        columnTitles: [Title1, Title2, ...]
        datasets: [
            {
                Title1: [datapoint1, datapoint2, ...],
                Title2: [datapoint1, datapoint2, ...],
                ...
            },
            {
                Title1: [datapoint1, datapoint2, ...],
                Title2: [datapoint1, datapoint2, ...],
                ...
            },
            ...
        ]
    }
    ```

    The very first row are column titles. Then multiple datasets are supported, separated vertically by a blank row.
    The length of the columnTitles array must be equal to the number of keys in each object in the datasets array.
    """
    import io
    from fastapi.responses import StreamingResponse
    import xlsxwriter

    # Extract the data from the request.
    columnTitles = req.get("columnTitles", [])
    datasets = req.get("datasets", [])

    # Create an in-memory output file for the new workbook.
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()

    # Initialize a list to keep track of the maximum width of each column.
    max_widths = [len(title) for title in columnTitles]

    # Create a default font format for the workbook.
    default_font_format = workbook.add_format({'font_name': 'Arial', 'font_size': 8})

    # Create a format for the column titles with center alignment and a bottom border.
    title_format = workbook.add_format({'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})

    # Create a format for center alignment for other cells.
    center_format = workbook.add_format({'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8 })

    # Write column titles with the title format and calculate column widths.
    for col, title in enumerate(columnTitles):
        worksheet.write(1, col + 1, title, title_format)  # Start from B2 instead of A1
        # Adjust column width if necessary
        max_widths[col] = max(max_widths[col], len(title))

    # Current row after writing column titles.
    current_row = 2  # Adjust starting row to 2 for data entries
    
    for dataset in datasets:
        for col, title in enumerate(columnTitles):
            data = dataset.get(title, [])
            for row, item in enumerate(data, start=current_row):
                # Check if the data is equal to "--", leave it blank instead
                value = "" if item == "--" else item
                worksheet.write(row, col + 1, value, center_format)
                # Update max_widths for the current column if necessary
                max_widths[col] = max(max_widths[col], len(str(value)))
        # Update current_row for the next dataset, adding 2 empty rows as separator.
        current_row += len(data) + 2

    # Set the column widths plus some additional spacing and center alignment.
    for col, width in enumerate(max_widths):
        worksheet.set_column(col + 1, col + 1, width + 2, center_format)  # Adding 2 for additional spacing

    # Apply the default font format to the column titles and data.
    worksheet.set_row(0, None)  # Apply to the title row
    for row_num in range(1, current_row):
        worksheet.set_row(row_num, None)  # Apply to each data row

    # Apply the default font format to the column titles and data.
    worksheet.set_row(0, None, default_font_format)  # Apply to the title row
    for row_num in range(1, current_row):
        worksheet.set_row(row_num, None, default_font_format)  # Apply to each data row

    # After writing all the data to the worksheet, add the charts for each dataset.
    current_chart_row = 2  # Initialize the row for the data for the first chart
    current_graph_row = 2  # Initialize the row for the graph for the first chart
    for dataset in datasets:
        current_chart_row, current_graph_row = add_chart_for_dataset(worksheet, workbook, dataset, columnTitles, current_chart_row, current_graph_row)

    # Close the workbook before sending the data.
    workbook.close()

    # Rewind the buffer.
    output.seek(0)

    return StreamingResponse(io.BytesIO(output.getvalue()), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

# Function to add a chart for a given dataset
def add_chart_for_dataset(worksheet, workbook, dataset, columnTitles, data_starting_row, graph_starting_row):
    chart = workbook.add_chart({'type': 'column'})
    dataset_length = len(dataset[columnTitles[0]])
    data_start_row = data_starting_row + 1  # Data starts one row after the data_starting_row
    data_end_row = data_start_row + dataset_length - 1

    chart.add_series({
        'name': 'Headcount',
        'categories': f'=Sheet1!$B${data_start_row}:$B${data_end_row}',
        'values': f'=Sheet1!$C${data_start_row}:$C${data_end_row}',
        'data_labels': {
            'value': True,
            'position': 'outside_end',
            'font': {'name': 'Arial', 'size': 8, 'color': '#404040'}
        },
        'fill': {'color': '#1CAFF2'},
        'border': {'none': True},
        'gap': 30,  # Decrease the gap to make bars thicker, adjust as needed
    })

    # Remove the chart border.
    chart.set_chartarea({
        'border': {'none': True}
    })

    # Remove the chart title, legend, and y-axis gridlines and labels.
    chart.set_title({'none': True})
    chart.set_legend({'none': True})
    chart.set_y_axis({'visible': False, 'major_gridlines': {'visible': False}})

    chart.set_x_axis({
        'num_font': {'rotation': -90 if dataset_length > 30 else 0, 'size': 8, 'name': 'Arial', 'color': '#404040'},
        'line': {'color': '#D9D9D9'},
        'major_tick_mark': 'none',
        'minor_tick_mark': 'none'
    })

    x_scale = 3 if dataset_length > 30 else 2 if dataset_length >= 10 else 1
    worksheet.insert_chart(f'F${graph_starting_row}', chart, {'x_scale': x_scale, 'y_scale': 1})

    return data_end_row + 2, graph_starting_row + 20