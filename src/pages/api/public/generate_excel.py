from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import xlsxwriter

class handler(BaseHTTPRequestHandler):
    
    def do_GET(self):
        # Create a workbook in memory
        output = BytesIO()

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

        # Set headers for the response
        self.send_response(200)
        self.send_header('Content-Disposition', 'attachment; filename="test.xlsx"')
        self.send_header('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        self.end_headers()

        # Write the buffer's content to the response
        self.wfile.write(output.getvalue())

        # Close the BytesIO object
        output.close()

# This part is for local testing only and won't affect Vercel deployment
if __name__ == "__main__":
    PORT = 8000
    server = HTTPServer(('', PORT), handler)
    print(f"Starting server at http://localhost:{PORT}")
    server.serve_forever()