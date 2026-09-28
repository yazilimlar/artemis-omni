#!/usr/bin/env python3
"""
Generates a clean PDF invoice from a Squarespace order dict.
Uses Playwright (headless Chromium) for pixel-perfect PDF rendering.
"""

import json, datetime, hashlib, pathlib, asyncio, re, base64, os
import urllib.request
from playwright.async_api import async_playwright

SOLD_BY    = "Prime Industrial"

# ── Helpers ───────────────────────────────────────────────────────────────────

def _v(money_dict):
    return float((money_dict or {}).get("value", 0))

def _fmt(val):
    return f"${float(val):,.2f}"

def _long(iso):
    try:
        d = datetime.date.fromisoformat(str(iso)[:10])
        return d.strftime("%B %-d, %Y")
    except Exception:
        return str(iso)

def _short(iso):
    try:
        d = datetime.date.fromisoformat(str(iso)[:10])
        return d.strftime("%b %-d, %Y")
    except Exception:
        return str(iso)

def _add(iso, days):
    try:
        d = datetime.date.fromisoformat(str(iso)[:10]) + datetime.timedelta(days=days)
        return d.isoformat()
    except Exception:
        return str(iso)

def _order_number(order_id):
    """Deterministic Amazon-style order number based on Squarespace order ID."""
    h = hashlib.md5(order_id.encode()).hexdigest()
    a = str(int(h[:7], 16))[:7].zfill(7)
    b = str(int(h[7:15], 16))[:8].zfill(8)
    return f"112-{a}-{b}"

def _img_to_b64(url):
    """Download an image URL and return a data URI for inline embedding."""
    if not url:
        return ""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
        ext = url.split("?")[0].split(".")[-1].lower()
        mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
                "gif": "image/gif", "webp": "image/webp"}.get(ext, "image/jpeg")
        return f"data:{mime};base64,{base64.b64encode(data).decode()}"
    except Exception:
        return ""

def _esc(s):
    return str(s or "").replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

# ── HTML builder ──────────────────────────────────────────────────────────────

def build_invoice_html(order):
    order_id      = order.get("id", "unknown")
    created_iso   = str(order.get("createdOn", ""))[:10]
    fulfilled_iso = str(order.get("fulfilledOn", "") or "")[:10]
    # Invoice date = fulfillment date (or order date if not fulfilled yet)
    invoice_iso   = fulfilled_iso if fulfilled_iso else created_iso
    # Delivery date = invoice date + 2 days
    delivered_iso = _add(invoice_iso, 2)
    return_iso    = _add(delivered_iso, 30)
    inv_number    = _order_number(order_id)

    addr = order.get("shippingAddress") or order.get("billingAddress") or {}
    name = f"{addr.get('firstName','')} {addr.get('lastName','')}".strip()
    addr2 = addr.get("address2") or ""
    city_line = f"{addr.get('city','')}, {addr.get('state','')} {addr.get('postalCode','')}".strip(", ")
    country = "United States" if addr.get("countryCode","US") in ("US","USA") else addr.get("countryCode","")
    addr_lines = [name, addr.get("address1","")]
    if addr2: addr_lines.append(addr2)
    addr_lines += [city_line, country]
    ship_to_html = "<br>".join(_esc(l) for l in addr_lines if l)

    subtotal  = _v(order.get("subtotal"))
    tax       = _v(order.get("taxTotal"))
    shipping  = _v(order.get("shippingTotal"))
    grand     = _v(order.get("grandTotal"))
    before_tax = subtotal + shipping

    line_items = order.get("lineItems", [])
    items_html = ""
    for li in line_items:
        qty        = int(li.get("quantity", 1))
        unit_price = _v(li.get("unitPricePaid"))
        line_total = qty * unit_price
        img_url    = li.get("imageUrl") or li.get("imgSrc", "")
        img_b64    = _img_to_b64(img_url) if img_url else ""
        img_html   = (f'<img src="{img_b64}" alt="Product" style="width:90px;height:90px;object-fit:contain;">'
                      if img_b64 else
                      '<div style="width:90px;height:90px;background:#f7f7f7;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;">No Image</div>')
        items_html += f"""
        <div style="display:flex;align-items:flex-start;gap:18px;padding:16px 0;border-bottom:1px solid #e8e8e8;">
          <div style="position:relative;flex-shrink:0;">
            {img_html}
            <div style="position:absolute;right:-6px;bottom:-6px;min-width:22px;height:20px;padding:0 5px;background:#111;color:#fff;border-radius:999px;font-size:11px;font-weight:700;text-align:center;line-height:20px;">{qty}</div>
          </div>
          <div style="flex:1;">
            <div style="font-weight:700;color:#007185;font-size:13px;margin-bottom:4px;">{_esc(li.get('productName',''))}</div>
            <div style="font-size:12px;color:#565959;">Sold by: {_esc(SOLD_BY)}</div>
            <div style="font-size:12px;color:#565959;">Return window closed on {_esc(_short(return_iso))}</div>
          </div>
          <div style="font-weight:700;color:#B12704;font-size:13px;white-space:nowrap;">{_fmt(line_total)}</div>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page {{ size: letter; margin: 18mm 18mm 18mm 18mm; }}
  * {{ box-sizing: border-box; }}
  body {{ font-family: "Amazon Ember", Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #111; margin: 0; padding: 0; background: #fff; }}
  a {{ color: #007185; text-decoration: none; }}
  h1 {{ font-size: 24px; font-weight: 400; margin: 0 0 6px 0; }}
  .meta {{ color: #565959; font-size: 13px; margin-bottom: 16px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }}
  .meta span {{ margin-right: 24px; }}
  .cols {{ display: flex; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }}
  .col {{ flex: 1; }}
  .col h3 {{ font-size: 13px; font-weight: 700; margin: 0 0 6px 0; }}
  .summary-table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
  .summary-table td {{ padding: 2px 0; }}
  .summary-table td:last-child {{ text-align: right; }}
  .total-row td {{ font-weight: 700; color: #B12704; font-size: 14px; border-top: 1px solid #ccc; padding-top: 6px; }}
  .shipbox {{ border: 1px solid #D5D9D9; border-radius: 8px; padding: 16px 20px; }}
  .delivery-note {{ font-size: 13px; color: #111; margin-bottom: 10px; }}
  .delivery-label {{ font-weight: 700; font-size: 16px; margin-bottom: 12px; }}
  .store-header {{ background: #232f3e; color: #fff; padding: 10px 16px; border-radius: 6px 6px 0 0; margin-bottom: 0; display: flex; align-items: center; gap: 12px; }}
  .store-name {{ color: #febd69; font-size: 18px; font-weight: 700; letter-spacing: 0.5px; }}
  .watermark {{ font-size: 10px; color: #999; text-align: center; margin-top: 24px; border-top: 1px solid #eee; padding-top: 8px; }}
</style>
</head>
<body>

<div style="padding: 0;">
  <h1>Order Details</h1>
  <div class="meta">
    <span>Ordered on <strong>{_esc(_long(invoice_iso))}</strong></span>
    <span>Order # <strong>{_esc(inv_number)}</strong></span>
  </div>

  <div class="cols">
    <div class="col">
      <h3>Ship to</h3>
      <div style="font-size:13px;line-height:1.6;">{ship_to_html}</div>
    </div>
    <div class="col">
      <h3>Payment method</h3>
      <div style="font-size:13px;">Visa ending in 8005<br><a href="#">View related transactions</a></div>
    </div>
    <div class="col">
      <h3>Order Summary</h3>
      <table class="summary-table">
        <tr><td>Item(s) Subtotal:</td><td>{_esc(_fmt(subtotal))}</td></tr>
        <tr><td>Shipping &amp; Handling:</td><td>{_esc(_fmt(shipping))}</td></tr>
        <tr><td>Total before tax:</td><td>{_esc(_fmt(before_tax))}</td></tr>
        <tr><td>Estimated tax collected:</td><td>{_esc(_fmt(tax))}</td></tr>
        <tr class="total-row"><td>Grand Total:</td><td>{_esc(_fmt(grand))}</td></tr>
      </table>
    </div>
  </div>

  <div class="shipbox">
    <div class="delivery-note">Your package was left near the front door or porch.</div>
    <div class="delivery-label">Delivered {_esc(_short(delivered_iso))}</div>
    {items_html}
  </div>

  <div class="watermark">
    Sold by {_esc(SOLD_BY)} &bull; Generated {_esc(_long(invoice_iso))}
  </div>
</div>
</body>
</html>"""

    return html, inv_number, _fmt(grand)


async def _html_to_pdf_async(html_str, output_path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page    = await browser.new_page()
        await page.set_content(html_str, wait_until="domcontentloaded")
        await page.pdf(
            path=str(output_path),
            format="Letter",
            print_background=True,
            margin={"top": "18mm", "right": "18mm", "bottom": "18mm", "left": "18mm"},
        )
        await browser.close()


def generate_pdf(order, output_path=None):
    """
    Generate a PDF invoice for the given Squarespace order dict.
    Returns (pdf_path, invoice_number, grand_total_str).
    """
    html, inv_number, grand = build_invoice_html(order)
    if output_path is None:
        output_path = pathlib.Path(os.environ.get("ERP_DATA_DIR", str(pathlib.Path(__file__).parent))) / f"invoice_{inv_number}.pdf"
    output_path = pathlib.Path(output_path)
    asyncio.run(_html_to_pdf_async(html, output_path))
    return output_path, inv_number, grand


# ── CLI test ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import requests, sys
    api_key = os.environ.get("SQUARESPACE_API_KEY", "")
    if not api_key:
        raise SystemExit("SQUARESPACE_API_KEY is required")
    HEADERS = {"Authorization": f"Bearer {api_key}"}

    order_id = sys.argv[1] if len(sys.argv) > 1 else None
    if order_id:
        r = requests.get(f"https://api.squarespace.com/1.0/commerce/orders/{order_id}", headers=HEADERS)
        order = r.json()
    else:
        # Use most recent order
        r = requests.get("https://api.squarespace.com/1.0/commerce/orders?limit=1", headers=HEADERS)
        order = r.json()["result"][0]

    pdf_path, inv_number, grand = generate_pdf(order)
    print(f"✓ PDF saved: {pdf_path}")
    print(f"  Invoice #: {inv_number}")
    print(f"  Total:     {grand}")
