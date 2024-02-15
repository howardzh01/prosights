import xlsxwriter
import io
import sys

# Create a workbook in memory
output = io.BytesIO()

# Pass the BytesIO object to xlsxwriter
workbook = xlsxwriter.Workbook(output, {'in_memory': True})
worksheet = workbook.add_worksheet()

# Some data we want to write to the worksheet.
data = ["Hello, world!"]

# Start from the first cell. Rows and columns are zero indexed.
row = 0
col = 0

# Iterate over the data and write it out row by row.
for item in data:
    worksheet.write(row, col, item)

# Close the workbook which will also write the data to the BytesIO object
workbook.close()

# Rewind the buffer
output.seek(0)

# Read the buffer's content as binary data
excel_data = output.getvalue()

# Close the BytesIO object
output.close()

# Print the binary data to stdout so that Node.js can read it
sys.stdout.buffer.write(excel_data)