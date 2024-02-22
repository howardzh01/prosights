# This function generates Excel files and is deployed to Modal
from typing import List, Dict
import logging
import modal

# Set up basic logging
logging.basicConfig(level=logging.INFO)

xlsxwriter_image = modal.Image.debian_slim().pip_install("xlsxwriter")

stub = modal.Stub("generate_divider_excel")

@stub.function(image=xlsxwriter_image)
@modal.web_endpoint(method="POST")
def generate_divider_excel(req, workbook, sheetName="Sheet1", poweredBy=None, sheetTabColor="#FF0000"):
    worksheet = workbook.add_worksheet(sheetName)
    worksheet.set_tab_color(sheetTabColor)
