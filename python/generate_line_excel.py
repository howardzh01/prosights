# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
import modal

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_line_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_line_excel(req: List[Dict], workbook, sheetName="Sheet1"):
    """
    'req' follows the structure:

    ```
    [
        {
            chartData: {
                datasets: [
                    {
                        borderWidth: 2,
                        data: [null, null, null, 16, 22, 30, ...], // Same length as labels
                        label: "StockX",
                    },
                    ...
                ],
                labels: ["1Q19", "2Q19", "3Q19", "4Q19", ...] // Same length as datasets.data
            },
            tableData: {
                ...
            },
        },
        ...
    ]
    ```

    Each object in the array takes on the same format for ChartJS data.
    """
    worksheet = workbook.add_worksheet(sheetName)

    # Default font format
    font_format = workbook.add_format({'font_name': 'Arial', 'font_size': 8, 'align': 'center', 'valign': 'vcenter'})
    # Title format
    title_format = workbook.add_format({'bottom': 1, 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})
    # Create a new format for percentage with 0 decimal places
    percentage_format = workbook.add_format({'num_format': '0%', 'align': 'center', 'valign': 'vcenter', 'font_name': 'Arial', 'font_size': 8})


    # Starting cell
    row = 1
    col = 1

    # Initialize the graph_row_index at the beginning of the function
    graph_row_index = 1

    for item in req:
        chartData = item['chartData']
        labels = chartData['labels']
        datasets = chartData['datasets']

        # Column titles for rawData
        rawDataColumnTitles = ["Date"] + [dataset["label"] for dataset in datasets]
        for col_num, title in enumerate(rawDataColumnTitles, start=col):
            worksheet.write(row, col_num, title, title_format)

        # Column titles for original data, shifted to the right by len(rawDataColumnTitles) + 1 for separation
        columnTitles = ["Date"] + [dataset["label"] for dataset in datasets]
        for col_num, title in enumerate(columnTitles, start=col + len(rawDataColumnTitles) + 1):
            worksheet.write(row, col_num, title, title_format)

        # Increment row to start data entry
        row += 1

        for label_index, label in enumerate(labels):
            # Write the date label for rawData
            worksheet.write(row + label_index, col, label, font_format)

            # Write the date label for original data, shifted right by the number of columns in rawData table + 1 for separation
            worksheet.write(row + label_index, col + len(rawDataColumnTitles) + 1, label, font_format)

            for dataset_index, dataset in enumerate(datasets):
                # rawData entry
                rawDataPoint = dataset['rawData'][label_index]
                rawDataPoint = '' if rawDataPoint is None else rawDataPoint  # Convert null to empty cell
                try:
                    rawDataPoint = float(rawDataPoint)
                except:
                    pass
                worksheet.write(row + label_index, col + dataset_index + 1, rawDataPoint, font_format)

                # Original data entry, shifted right by the number of columns in rawData table + 1 for separation
                dataPoint = dataset['data'][label_index]
                dataPoint = '' if dataPoint is None else dataPoint / 100  # Convert null to empty cell
                try:
                    dataPoint = float(dataPoint)
                except:
                    pass
                worksheet.write(row + label_index, col + len(rawDataColumnTitles) + 1 + dataset_index + 1, dataPoint, percentage_format)  # Adjusted index here


        # Set column widths for rawData
        for col_num, title in enumerate(rawDataColumnTitles, start=col):
            worksheet.set_column(col_num, col_num, max(len(title), 10), font_format)

        # Set column widths for original data
        for col_num, title in enumerate(columnTitles, start=col + len(rawDataColumnTitles) + 1):
            worksheet.set_column(col_num, col_num, max(len(title), 10), font_format)

        # Add multi-line chart, positioned to the right of the original data columns
        colors = ['#1CAFF2', '#FF6384', '#4BC0C0', '#FB9551', '#9966FF', '#FFCE56', '#92A3A8']
        chart = workbook.add_chart({'type': 'line'})
        safe_sheet_name = f"'{sheetName}'"
        for i, dataset in enumerate(datasets):
            background_color = colors[i % len(colors)]
            chart.add_series({
                'name': dataset['label'],
                'categories': f'={safe_sheet_name}!${chr(66 + len(rawDataColumnTitles) + 1)}${row + 1}:${chr(66 + len(rawDataColumnTitles) + 1)}${row + len(labels)}',
                'values': f'={safe_sheet_name}!${chr(67 + len(rawDataColumnTitles) + 1 + i)}${row + 1}:${chr(67 + len(rawDataColumnTitles) + 1 + i)}${row + len(labels)}',
                'smooth': True,
                'line': {'color': background_color},
            })

        # Chart formatting and placement adjustments
        chart.set_legend({
            'font': {'name': 'Arial', 'size': 8},
            'position': 'top'
        })
        chart.set_x_axis({
            'num_font': {'name': 'Arial', 'size': 8, 'rotation': -90 if len(labels) > 30 else 0, 'color': '#404040'},
            'line': {'color': '#D9D9D9'},
            'date_axis': True,
            'label_position': 'low',  # This positions the labels low on the axis
        })
        chart.set_y_axis({
            'major_gridlines': {
                'visible': True,
                'line': {'color': '#D9D9D9'}
            },
            'num_font': {'name': 'Arial', 'size': 8, 'color': '#404040'},
            'num_format': '0%',  # This formats the y-axis numbers as percentages with 0 decimal places
        })
        chart.set_chartarea({
            'border': {'none': True},
            'font': {'name': 'Arial', 'size': 8}
        })
        x_scale = 3 if len(labels) > 30 else 2 if len(labels) >= 10 else 1
        chart.set_size({'x_scale': x_scale, 'y_scale': 1})

        # Position the chart using graph_row_index for the chart's row position
        chart_col = col + len(rawDataColumnTitles) + len(columnTitles) + 2
        worksheet.insert_chart(graph_row_index, chart_col, chart, {'x_offset': 15, 'y_offset': 10})

        # Adjust graph_row_index for next set of data, with 3 rows separation
        graph_row_index += 20
        # Adjust row for next set of data, with 2 rows separation
        row += len(labels) + 2
