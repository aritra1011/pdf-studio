# PDF Studio 4.0

A browser-based PDF utility website designed for GitHub Pages. PDF files are processed in the browser; there is no PDF Studio upload server.

## Deploy
1. Extract this ZIP.
2. Replace the repository-root `index.html`, `style.css`, `script.js`, and `README.md`.
3. Replace `assets/favicon.svg` while keeping it inside `assets/`.
4. Commit the changes to `main`.
5. In GitHub, open Settings → Pages and ensure deployment uses `main` and `/(root)`.

## Features
Includes PDF compression (lossy rasterization), merge, split/extract, delete pages, reorder, rotate, watermark, page numbers, page resizing, PDF to JPG, JPG/PNG to PDF, selectable text extraction, PDF info, PDF to Word (text-first DOCX), OCR to TXT, text annotations, typed visual signature, PDF text to Excel, PDF pages to PowerPoint slides, and images to Word.

## Important limitations
- **Password protection:** Not implemented. This edition does not encrypt PDFs or remove passwords. Use a trusted PDF application for real encryption.
- **Digital signature:** The signature tool places typed text on a page. It is not a cryptographic or certificate-backed digital signature.
- **Advanced editor:** Adds a new text annotation; it does not modify existing PDF text or provide full layout editing.
- **PDF to Excel:** Exports selectable text into a simple worksheet. It does not reliably reconstruct complex tables. Scanned PDFs need OCR first.
- **PDF to PowerPoint:** Makes one page image per slide. Slide contents are not individually editable.
- **Image to Word:** Places selected images in a DOCX; it does not convert text inside images into editable text.
- **PDF to Word:** Extracts selectable text; original layout may not be preserved.
- Compression rasterizes pages, so selectable text, links, forms and vector details are not preserved.
- Large files can use significant memory, especially on phones.

## Privacy and dependencies
Processing happens locally in the browser. Public CDN libraries are used for PDF handling, OCR, DOCX, XLSX and PPTX, so an internet connection is required. Avoid processing confidential files on shared devices.

## Structure
```
pdf-studio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── favicon.svg
```
