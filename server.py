"""Simple HTTP server for local development. Run: python server.py"""
import http.server, socketserver, os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress logs

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"RoBby running at http://localhost:{PORT}")
    print("Open this URL in your browser (Chrome/Safari/Firefox)")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()
