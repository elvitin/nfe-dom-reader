import argparse
import os
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler


class SPARequestHandler(SimpleHTTPRequestHandler):
    """Serves files from `directory`. If a path doesn't map to a real file and
    looks like a client-side route (no file extension), it falls back to /index.html.
    """

    # Silence the overly verbose default logging (optional)
    def log_message(self, format, *args):
        return

    def do_GET(self):
        # If it's a direct hit (file or directory), serve normally
        full_path = self.translate_path(self.path)

        # Serve directories and existing files as usual
        if os.path.isdir(full_path) or os.path.exists(full_path):
            return super().do_GET()

        # SPA-style fallback: if no "." in last path segment, try index.html
        if "." not in os.path.basename(self.path):
            self.path = "/index.html"
            return super().do_GET()

        # Otherwise, let the base handler return 404
        return super().do_GET()


def main():
    parser = argparse.ArgumentParser(description="Simple static file server with SPA fallback.")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--dir", default=".", help="Directory to serve (default: current directory)")
    args = parser.parse_args()

    serve_dir = os.path.abspath(args.dir)
    if not os.path.isdir(serve_dir):
        raise SystemExit(f"Directory to serve does not exist: {serve_dir}")

    # Ensure index.html exists for a nicer experience
    index_path = os.path.join(serve_dir, "index.html")
    if not os.path.exists(index_path):
        print(f"Warning: {index_path} was not found. You'll get 404s for '/'.")

    # Build a handler that serves from the chosen directory
    def handler_factory(*h_args, **h_kwargs):
        return SPARequestHandler(*h_args, directory=serve_dir, **h_kwargs)

    httpd = ThreadingHTTPServer(("0.0.0.0", args.port), handler_factory)
    print(f"Serving '{serve_dir}' at http://localhost:{args.port} (press Ctrl+C to stop)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
