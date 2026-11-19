# PDF Studio

A responsive, browser-based PDF utility website designed for GitHub Pages. It uses PDF-Lib, PDF.js and JSZip from public CDNs. Supported file processing happens locally in the visitor's browser; there is no upload backend.

## Features

- Compress PDF by rendering pages to optimized JPEG images and rebuilding a PDF
- Merge multiple PDFs
- Split/extract selected pages
- Reorder and extract pages
- Rotate PDF pages
- Add a text watermark
- PDF to JPG (downloads a ZIP of page images)
- JPG/PNG to PDF
- Extract selectable PDF text to TXT
- Export page count and page dimensions
- Resize page canvas to A4 or US Letter

## Important limitations

- **Compression is lossy.** The compressor rasterizes pages, so selectable text, links, forms, accessibility structure and vector quality are not preserved. A compressed file is not guaranteed to be smaller. Keep the original.
- PDF to Word is not included: accurate DOCX conversion requires layout reconstruction and is not reliably achieved by simply extracting text.
- PDF encryption/password protection and password removal are not implemented. Do not treat this project as a security tool.
- Scanned PDFs may not contain selectable text. OCR is not included.
- Large files can use substantial memory. Use smaller files or lower DPI on devices with limited memory.
- Some PDFs with unusual features, encryption, embedded fonts or malformed structures may fail in browser libraries.
- The app depends on third-party CDN scripts and Google Fonts. An internet connection is needed to load them.

## Run locally

You can open `index.html` in a modern browser, but using a local server is recommended:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository named `pdf-studio` (or another name).
2. Upload `index.html`, `style.css`, `script.js`, `README.md` and the `assets` folder to the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish. The site URL will be shown in the Pages settings, usually `https://YOUR-USERNAME.github.io/pdf-studio/`.

## Project structure

```text
pdf-studio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── favicon.svg
```

## Privacy

The application code does not send selected documents to a server. Files are read by the browser's File API and processed locally. The app does load library scripts from third-party CDNs. For a fully offline/self-hosted deployment, download and pin the library files in your repository and update the script references.
