#!/usr/bin/env python3
"""One-click launcher for Insert Prompt Studio.

Usage:
  python run_studio.py
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import socket
import webbrowser

PORT_CANDIDATES = [8080, 8081, 8090, 9000]
ROOT = Path(__file__).resolve().parent


def pick_port() -> int:
    for port in PORT_CANDIDATES:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise RuntimeError("사용 가능한 포트를 찾지 못했습니다. 다른 프로세스를 종료해 주세요.")


def main() -> None:
    port = pick_port()
    url = f"http://127.0.0.1:{port}/index.html"

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("=" * 70)
    print("Insert Prompt Studio 실행 준비 완료")
    print(f"접속 주소: {url}")
    print("종료하려면 이 창에서 Ctrl+C")
    print("=" * 70)

    webbrowser.open(url)
    server.serve_forever()


if __name__ == "__main__":
    main()
