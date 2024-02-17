# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
import modal

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_stacked_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_stacked_excel(req: List[Dict]):
    """
    'req' follows the structure:

    ```
    [
        {
            chartData: {...},
            tableData: {...},
        },
        {
            chartData: {...},
            tableData: {...},
        },
        ...
    ]
    ```

    Each object in the array takes on the same format for ChartJS data.
    """
    import io
    from fastapi.responses import StreamingResponse
    import xlsxwriter

    # Create an in-memory output file for the new workbook.
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})

    # Create a default font format for the workbook.
    default_font_format = workbook.add_format({'font_name': 'Arial', 'font_size': 8})

    # Create a format for the column titles with center alignment and a bottom border.
    title_format = workbook.add_format({'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})

    # Create a format for center alignment for other cells.
    center_format = workbook.add_format({'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8 })

    # Starting row for the first dataset's data
    data_start_row = 1

    # Initialize a variable to track the chart position for the first chart
    chart_placement_row = None

    for index, item in enumerate(req):
        chartData = item['chartData']
        labels = chartData['labels']
        datasets = chartData['datasets']

        # Only create a new worksheet for the first item, otherwise use the existing worksheet
        if index == 0:
            worksheet = workbook.add_worksheet()

        # Column titles: "Date" followed by each dataset's label.
        columnTitles = ["Date"] + [dataset["label"] for dataset in datasets]

        # Write column titles with the title format.
        for col, title in enumerate(columnTitles):
            worksheet.write(0, col, title, title_format)  # Start from A1

        # Write data for the current dataset
        for row, label in enumerate(labels):
            worksheet.write(data_start_row + row, 0, label, center_format)  # Write the date label in the first column
            for col, dataset in enumerate(datasets):
                dataPoint = dataset['rawData'][row]
                # Convert to number if possible
                try:
                    dataPoint = float(dataPoint)
                except ValueError:
                    pass
                worksheet.write(data_start_row + row, col + 1, dataPoint, center_format)  # Write the data point

        # Calculate the ending row for the current dataset's data
        data_end_row = data_start_row + len(labels)

        # Set the column widths plus some additional spacing and center alignment.
        for col, width in enumerate(columnTitles):
            worksheet.set_column(col, col, max(len(width), 10), center_format)  # Use a minimum width of 10

        # Add the stacked bar chart to the right of the table for the current dataset
        chart = workbook.add_chart({'type': 'column', 'subtype': 'percent_stacked'})
        for i, dataset in enumerate(datasets):
            colors = ['#1CAFF2', '#FF6384', '#4BC0C0', '#FB9551', '#9966FF', '#FFCE56', '#92A3A8']
            background_color = colors[i % len(colors)]

            chart.add_series({
                'name': dataset['label'],
                'categories': f'=Sheet1!$A${data_start_row + 1}:$A${data_end_row}',
                'values': f'=Sheet1!${chr(66 + i)}${data_start_row + 1}:${chr(66 + i)}${data_end_row}',
                'data_labels': {'value': False, 'position': 'inside_end'},
                'fill': {'color': background_color}
            })

        # Formatting the chart
        chart.set_legend({'position': 'top'})
        chart.set_x_axis({
            'num_font': {'rotation': -90 if len(labels) > 30 else 0, 'color': '#404040'},
            'line': {'color': '#D9D9D9'}
        })
        chart.set_y_axis({'visible': False, 'major_gridlines': {'visible': False}})

        # Remove chart border
        chart.set_chartarea({'border': {'none': True}})

        # Determine the size of the graph based on the dataset length
        x_scale = 3 if len(labels) > 30 else 2 if len(labels) >= 10 else 1
        chart.set_size({'x_scale': x_scale, 'y_scale': 1})

        if index == 0:
            # Place the first chart to the right of the table
            chart_position = f'K{data_start_row + 2}'  # Position the first chart to the right of the table
            chart_placement_row = data_start_row + 2  # Save the row position for the first chart
        else:
            # Calculate the position for subsequent charts to be placed under the first chart, separated by 4 empty rows
            if chart_placement_row is not None:
                chart_placement_row += len(labels) + 18/x_scale  # Move down for the next chart placement
            chart_position = f'K{chart_placement_row}'

        worksheet.insert_chart(chart_position, chart)

        # Update the starting row for the next dataset's data
        data_start_row = data_end_row + 2  # Skip two rows for spacing between datasets

    # Close the workbook before sending the data.
    workbook.close()

    # Rewind the buffer.
    output.seek(0)

    # Return the Excel file as a streaming response
    return StreamingResponse(io.BytesIO(output.getvalue()), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")