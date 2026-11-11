// A visible user-activated download plus a copyable fallback. Never claims file delivery.
export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}
export function csvText(rows) { return rows.map(row => row.map(csvCell).join(',')).join('\r\n'); }
export function presentExport(filename, content, mime = 'text/csv;charset=utf-8') {
  document.getElementById('export-dialog')?.close();
  const dialog = document.createElement('dialog');
  dialog.id = 'export-dialog';
  const heading = document.createElement('h2'); heading.id='export-title'; heading.textContent='Your export is ready';
  dialog.setAttribute('aria-labelledby','export-title');
  const status=document.createElement('p'); status.setAttribute('role','status');
  status.textContent='Choose Download CSV, then check your browser downloads. If downloading is blocked, select and copy the CSV below.';
  const link=document.createElement('a'); link.className='button primary'; link.textContent='Download CSV';
  const url=URL.createObjectURL(new Blob([content],{type:mime}));
  link.href=url; link.download=filename;
  link.onclick=()=>{status.textContent='Download requested. Check your browser downloads; this page cannot confirm that the file was saved. The CSV below remains available to copy.';};
  const select=document.createElement('button'); select.type='button'; select.className='button'; select.textContent='Select CSV text';
  const textarea=document.createElement('textarea'); textarea.readOnly=true; textarea.rows=12;
  textarea.setAttribute('aria-label','Export CSV contents'); textarea.value=content;
  textarea.style.cssText='display:block;width:100%;min-height:240px;margin:16px 0;font:12px/1.5 monospace;white-space:pre;';
  select.onclick=()=>{textarea.focus();textarea.select();status.textContent='CSV selected. Press Ctrl+C or Command+C to copy, then paste into a text file and save with a .csv extension.';};
  const close=document.createElement('button');close.type='button';close.className='button';close.textContent='Close export';close.onclick=()=>dialog.close();
  const note=document.createElement('p');note.textContent=filename+' · '+new TextEncoder().encode(content).length.toLocaleString()+' bytes · no data uploaded';
  dialog.append(heading,status,link,document.createTextNode(' '),select,note,textarea,close);
  // Retain the Blob until the user is finished; no short timer races with slow downloads.
  dialog.addEventListener('close',()=>{URL.revokeObjectURL(url);dialog.remove();},{once:true});
  document.body.append(dialog);dialog.showModal();
}
