"""Update stored artifact paths after a private data transfer to ERP_DATA_DIR."""

import argparse
import os
import sqlite3
from pathlib import Path


PATH_COLUMNS = {
    "invoices": ("pdf_path",),
    "tax_generated_forms": ("pdf_path", "zip_path", "efile_path"),
    "tax_packages": ("zip_path",),
}


def migrate(database, old_root, new_root, apply=False):
    old_root = str(Path(old_root).expanduser().resolve()).rstrip("/") + "/"
    new_root = str(Path(new_root).expanduser().resolve()).rstrip("/") + "/"
    if old_root == new_root:
        raise ValueError("Old and new data directories are identical")
    if not database.is_file():
        raise FileNotFoundError(database)

    counts = {}
    with sqlite3.connect(database) as conn:
        if conn.execute("PRAGMA quick_check").fetchone()[0] != "ok":
            raise RuntimeError("Database integrity check failed")
        for table, columns in PATH_COLUMNS.items():
            for column in columns:
                where = f"substr({column}, 1, ?) = ?"
                count = conn.execute(
                    f"SELECT COUNT(*) FROM {table} WHERE {where}", (len(old_root), old_root)
                ).fetchone()[0]
                counts[f"{table}.{column}"] = count
                if apply and count:
                    conn.execute(
                        f"UPDATE {table} SET {column} = ? || substr({column}, ?) WHERE {where}",
                        (new_root, len(old_root) + 1, len(old_root), old_root),
                    )
        if not apply:
            conn.rollback()
        elif conn.execute("PRAGMA quick_check").fetchone()[0] != "ok":
            raise RuntimeError("Post-migration integrity check failed")
    return counts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--old-root", required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    new_root = Path(os.environ.get("ERP_DATA_DIR", "/var/data"))
    for column, count in migrate(
        new_root / "prime_industrial.db", args.old_root, new_root, args.apply
    ).items():
        print(f"{column}: {count} path(s)")
    print("Applied" if args.apply else "Preview only")
