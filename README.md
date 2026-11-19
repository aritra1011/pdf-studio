# PDF Studio 3.0

A responsive browser-based PDF toolkit for GitHub Pages. Files are processed in the browser; there is no PDF Studio upload server.

## Deploy on GitHub Pages
1. Extract this ZIP.
2. Upload/replace the contents of this folder in the root of your repository.
3. Keep `index.html`, `style.css`, and `script.js` together in the repository root.
4. Keep `favicon.svg` inside `assets/`.
5. Open **Settings → Pages**.
6. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.

## Tools
Includes PDF compression (lossy rasterization), merge, split/extract, delete pages, reorder pages, rotate, watermark, page numbers, page resizing, PDF to JPG, JPG/PNG to PDF, selectable-text extraction, PDF info, PDF to Word (text-first editable DOCX), OCR text extraction, and dark mode.

## PDF to Word notes
The DOCX export extracts selectable text and places it into an editable Word document. It does not reproduce the original PDF layout exactly; complex columns, tables, images, forms, and typography may not be preserved. Scanned/image-only PDFs need OCR first.

## OCR notes
OCR renders PDF pages in the browser and uses Tesseract.js. Choose English, Bengali, Hindi, or English+Bengali. OCR language data is downloaded when needed. The result is a `.txt` file, not a searchable PDF. Accuracy depends on scan quality, font, orientation, and language.

## Privacy and requirements
- PDF processing occurs locally in the browser.
- PDF-Lib, PDF.js, docx, and Tesseract.js load from public CDNs, so an internet connection is required.
- Large documents can use significant phone memory and processing time.
- Test on copies of important files. Do not upload confidential documents to a device or browser you do not trust.

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
