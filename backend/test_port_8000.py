from http.server import HTTPServer, BaseHTTPRequestHandler
import sys

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Port 8000 is reachable!")

def run():
    print("Starting minimal server on port 8000...")
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, SimpleHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    run()
