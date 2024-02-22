# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
from generate_bar_excel import generate_bar_excel
from generate_doughnut_excel import generate_doughnut_excel
from generate_line_excel import generate_line_excel
from generate_divider_excel import generate_divider_excel
from generate_stacked_excel import generate_stacked_excel
import modal

chart_type_to_function = {
    'bar': generate_bar_excel,
    'line': generate_line_excel,
    'doughnut': generate_doughnut_excel,
    'stacked': generate_stacked_excel,
    'divider': generate_divider_excel,
}

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_master_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_master_excel(req: List):
    """
    'req' follows the structure:

    ```
    [
        {
            type: "bar", // types: bar, line, doughnut, stacked, divider
            sheetName: "Sheet1",
            sheetTabColor: "#FF0000",
            req: {...} // Follows the structure of the corresponding function
            poweredBy: "Semrush",
        },
        ...
    ]
    ```

    We will generate an Excel file with multiple sheets, each corresponding to the type of chart.
    """
    import io
    from fastapi.responses import StreamingResponse
    import xlsxwriter

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})

    for request in req:
        chart_type = request['type']
        if chart_type in chart_type_to_function:
            chart_function = chart_type_to_function[chart_type]
            chart_function.local(request['req'], workbook, request['sheetName'], request['poweredBy'], request['sheetTabColor'])

    workbook.close()
    output.seek(0)
    return StreamingResponse(io.BytesIO(output.getvalue()), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")