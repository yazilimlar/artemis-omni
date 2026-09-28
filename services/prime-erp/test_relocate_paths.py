import sqlite3
import tempfile
import unittest
from pathlib import Path

from relocate_paths import migrate


class RelocatePathsTest(unittest.TestCase):
    def test_preview_and_apply_only_rewrite_artifacts_under_old_root(self):
        with tempfile.TemporaryDirectory() as temp:
            db = Path(temp) / "prime_industrial.db"
            old = Path(temp) / "old"
            new = Path(temp) / "new"
            with sqlite3.connect(db) as conn:
                conn.execute("CREATE TABLE invoices (pdf_path TEXT)")
                conn.execute("CREATE TABLE tax_generated_forms (pdf_path TEXT, zip_path TEXT, efile_path TEXT)")
                conn.execute("CREATE TABLE tax_packages (zip_path TEXT)")
                conn.execute("INSERT INTO invoices VALUES (?)", (str(old / "invoices_pdf" / "a.pdf"),))
                conn.execute("INSERT INTO tax_generated_forms VALUES (?, ?, ?)",
                             (str(old / "tax_forms" / "a.pdf"), str(old / "tax_forms" / "a.zip"), None))
                conn.execute("INSERT INTO tax_packages VALUES (?)", ("/unrelated/package.zip",))

            self.assertEqual(migrate(db, old, new)["invoices.pdf_path"], 1)
            with sqlite3.connect(db) as conn:
                self.assertEqual(conn.execute("SELECT pdf_path FROM invoices").fetchone()[0],
                                 str(old / "invoices_pdf" / "a.pdf"))

            self.assertEqual(migrate(db, old, new, apply=True)["tax_generated_forms.zip_path"], 1)
            with sqlite3.connect(db) as conn:
                self.assertEqual(conn.execute("SELECT pdf_path FROM invoices").fetchone()[0],
                                 str(new / "invoices_pdf" / "a.pdf"))
                self.assertEqual(conn.execute("SELECT zip_path FROM tax_packages").fetchone()[0],
                                 "/unrelated/package.zip")
                self.assertEqual(conn.execute("PRAGMA quick_check").fetchone()[0], "ok")


if __name__ == "__main__":
    unittest.main()
