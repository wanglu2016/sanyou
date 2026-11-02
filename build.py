from pathlib import Path

root = Path(__file__).resolve().parent
html = (root / 'src/shell.html').read_text(encoding='utf-8')
for key, name in [('STYLE', 'style.css'), ('ENGINE', 'engine.js'), ('ART', 'art.js'), ('APP', 'app.js')]:
    html = html.replace('/*' + key + '*/', (root / 'src' / name).read_text(encoding='utf-8'))
for name in ['index.html', 'sanyou-offline.html']:
    (root / name).write_text(html, encoding='utf-8')
print(f'Built two self-contained HTML files ({len(html.encode()):,} bytes each).')
