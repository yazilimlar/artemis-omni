import importlib
import os
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


class WsgiGateTest(unittest.TestCase):
    def test_database_and_credentials_are_required_before_api_is_exposed(self):
        with tempfile.TemporaryDirectory() as temp:
            env = {"ERP_DATA_DIR": temp, "ERP_SESSION_SECRET": "", "ERP_PASSWORD_SHA256": ""}
            with patch.dict(os.environ, env):
                import wsgi

                importlib.reload(wsgi)
                self.assertEqual(wsgi.app.test_client().get("/health").status_code, 200)
                self.assertEqual(wsgi.app.test_client().get("/api/summary").status_code, 503)

                database = Path(temp) / "prime_industrial.db"
                with sqlite3.connect(database) as conn:
                    conn.execute("CREATE TABLE orders (id TEXT PRIMARY KEY)")
                    conn.execute("CREATE TABLE invoices (id INTEGER PRIMARY KEY)")

                importlib.reload(wsgi)
                self.assertEqual(wsgi.app.test_client().get("/api/summary").status_code, 503)

                with patch.dict(os.environ, {"ERP_SESSION_SECRET": "test-session-secret", "ERP_PASSWORD_SHA256": "0" * 64}):
                    importlib.reload(wsgi)
                    self.assertEqual(wsgi.app.test_client().get("/api/summary").status_code, 401)
                    self.assertEqual(wsgi.app.test_client().get("/login").status_code, 200)
                    self.assertEqual(wsgi.app.test_client().get("/health").status_code, 200)


if __name__ == "__main__":
    unittest.main()
