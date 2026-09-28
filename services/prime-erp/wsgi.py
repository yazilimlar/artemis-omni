"""Only open the ERP after its data and access credentials are installed."""

import os
import re
import sqlite3
from pathlib import Path

from flask import Flask


def ready():
    root = Path(os.environ.get("ERP_DATA_DIR", "/var/data"))
    database = root / "prime_industrial.db"
    if not database.is_file():
        return False
    if not os.environ.get("ERP_SESSION_SECRET"):
        return False
    password_hash = os.environ.get("ERP_PASSWORD_SHA256", "")
    if not (re.fullmatch(r"[0-9a-fA-F]{64}", password_hash) or os.environ.get("ERP_PASSWORD")):
        return False
    try:
        with sqlite3.connect(database.as_uri() + "?mode=ro", uri=True) as conn:
            if conn.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                return False
            tables = {row[0] for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('orders', 'invoices')"
            )}
            return tables == {"orders", "invoices"}
    except sqlite3.Error:
        return False


if ready():
    from erp_server import app
else:
    app = Flask(__name__)

    @app.route("/health")
    def health():
        return "maintenance", 200

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def maintenance(path):
        return "Prime ERP is being prepared for migration.", 503
