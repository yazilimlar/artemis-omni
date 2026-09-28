# Prime ERP backend migration

The public Artemis entry point is `/apps/prime-erp`. The Flask service in this
folder must have durable storage for SQLite, invoice PDFs, tax forms, and audit
records. Render configuration is in the repository root `render.yaml`. It
declares a paid single-instance web service and a persistent disk at `/var/data`.
Review the plan and disk costs before applying the Blueprint.

The `/labs/prime-erp` API proxy recently added to Artemis is separate. A cookie
issued after signing in on the ERP host is scoped to that host; it will not
authenticate API calls made from the Artemis host. Leave
`PRIME_ERP_BACKEND_URL` unset for that showcase until its authentication flow
has been designed and tested. The existing `/apps/prime-erp` doorway opens the
ERP on its own HTTPS host and retains the working login behavior.

## Safety gates

- The repository contains **no** database or generated financial documents.
- The original `start_erp.sh`, its backups, and the handover documents must not
  be copied into this repository. The launcher contains credentials.
- A credential previously embedded in the invoice CLI was removed from this
  copy. Rotate the old Squarespace API credential before exposing the hosted app.
- `wsgi.py` serves only maintenance responses until a valid imported database,
  stable session secret, and ERP password or password hash exist.
- Keep the live Mac service and temporary tunnel available until the cutover.

## Prepare a consistent private Mac snapshot

Run this on the Mac shortly before the cutover. Keep the resulting directory
private and out of Git. SQLite's backup API includes committed WAL data.

```bash
umask 077
python3 - <<'PY'
from pathlib import Path
import shutil, sqlite3, datetime

source = Path.home() / 'Library/Application Support/PrimeIndustrial'
target = Path.home() / 'PrimeIndustrial_private_transfer' / datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
target.mkdir(parents=True, mode=0o700)
with sqlite3.connect(source / 'prime_industrial.db') as active:
    with sqlite3.connect(target / 'prime_industrial.db') as copy:
        active.backup(copy)
        assert copy.execute('PRAGMA quick_check').fetchone()[0] == 'ok'
for folder in ('invoices_pdf', 'tax_forms'):
    if (source / folder).is_dir():
        shutil.copytree(source / folder, target / folder)
if (source / 'erp_auth_audit.log').is_file():
    shutil.copy2(source / 'erp_auth_audit.log', target)
print('Private snapshot:', target)
print('Database bytes:', (target / 'prime_industrial.db').stat().st_size)
PY
```

## Stage and cut over

1. Merge the reviewed backend branch only after validating the Docker build.
   Applying `render.yaml` creates a paid service and persistent disk; it does
   not move your data automatically. It initially serves maintenance responses.
2. Set `ERP_SESSION_SECRET` and `ERP_PASSWORD_SHA256` as private Render runtime
   variables. Set any active Squarespace/Plaid integration credentials there as
   well. Do not place them in Git, the ZIP, or chat.
3. Transfer the private snapshot by SSH/SFTP to the service disk `/var/data`.
   Render's service SSH instructions supply the account, hostname, and region.
   Preserve the three directories: `invoices_pdf`, `tax_forms`, and the DB file.
4. In the service shell, preview the stored path changes:

   `python relocate_paths.py --old-root '/Users/YOUR_MAC_USER/Library/Application Support/PrimeIndustrial'`

   Then run again with `--apply` to rewrite historical PDF and tax artifact
   paths. Verify `PRAGMA quick_check` and selected invoice/tax downloads.
5. Restart the service so `wsgi.py` sees the imported database. Confirm public
   `/health` responds and unauthenticated `/api/summary` responds `401`.
   Test password login, invoice PDF, tax files, Squarespace, and bank links.
6. Stop new writes to the Mac ERP, take one final private snapshot, and repeat
   the import while the hosted ERP is in maintenance. Compare record counts and
   files before switching Artemis's `NEXT_PUBLIC_PRIME_ERP_URL` to the hosted
   HTTPS address and redeploying Artemis.
7. Confirm the client's Artemis button and password work. Keep the Mac backup
   until a database backup and restore procedure has been tested on the host.

Do not run both writable copies against the same real transaction workflow
after cutover. The ZIP/source alone is not a deployed ERP or a data backup.
