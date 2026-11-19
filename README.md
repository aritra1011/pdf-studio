# PDF Studio 2.0

A responsive, browser-based PDF utility website designed for GitHub Pages.

## Deploy
1. Upload the contents of this folder to the root of your GitHub repository.
2. Keep `index.html`, `style.css`, and `script.js` together in the repository root.
3. Keep `favicon.svg` inside the `assets` folder.
4. In GitHub, open **Settings → Pages**.
5. Select **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.

## Included tools
- Compress PDF (rasterizes pages; text/vector content is not preserved)
- Merge PDF
- Split/extract pages
- Delete pages
- Reorder pages
- Rotate pages
- Add text watermark
- Add page numbers
- Resize page canvas
- PDF to JPG
- JPG/PNG to PDF
- Extract selectable text
- View PDF info
- Dark mode

## Notes and limitations
- PDF processing is performed locally in the browser using PDF-Lib and PDF.js loaded from public CDNs.
- An internet connection is required to load these libraries.
- Large files may use significant phone memory.
- Compression converts pages to images, so searchable/selectable text, links, forms and vector sharpness are lost.
- PDF password encryption/decryption and PDF-to-Word are not included in this static GitHub Pages build; these need additional specialist libraries or a secure backend.
- Test with copies of your documents before relying on the output.

## File structure
```
pdf-studio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── favicon.svg
```
