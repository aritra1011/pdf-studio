
/* =========================================
   PDF STUDIO - COMPLETE JAVASCRIPT
   Browser-based PDF tools
========================================= */

const { PDFDocument, degrees, rgb, StandardFonts } = PDFLib;

const $ = (id) => document.getElementById(id);

const grid = $("tool-grid");
const search = $("tool-search");
const workspace = $("workspace");
const title = $("workspace-title");
const description = $("workspace-description");
const dropzone = $("dropzone");
const fileInput = $("file-input");
const browse = $("browse-files");
const fileList = $("file-list");
const options = $("tool-options");
const runButton = $("run-tool");
const clearButton = $("clear-files");
const closeButton = $("close-workspace");
const statusBox = $("status");

let selectedTool = null;
let selectedFiles = [];

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const tools = [
  {
    id: "compress",
    name: "Compress PDF",
    icon: "🗜️",
    category: "optimize",
    desc: "Reduce PDF file size",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "merge",
    name: "Merge PDF",
    icon: "📑",
    category: "organize",
    desc: "Combine multiple PDF files",
    accept: ".pdf",
    multiple: true
  },
  {
    id: "split",
    name: "Split PDF",
    icon: "✂️",
    category: "organize",
    desc: "Extract selected pages",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "pdf-jpg",
    name: "PDF to JPG",
    icon: "🖼️",
    category: "convert",
    desc: "Convert PDF pages into images",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "jpg-pdf",
    name: "JPG to PDF",
    icon: "📷",
    category: "convert",
    desc: "Convert images into a PDF",
    accept: "image/jpeg,image/png",
    multiple: true
  },
  {
    id: "rotate",
    name: "Rotate PDF",
    icon: "🔄",
    category: "edit",
    desc: "Rotate PDF pages",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "watermark",
    name: "Add Watermark",
    icon: "💧",
    category: "edit",
    desc: "Add text watermark",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "reorder",
    name: "Reorder Pages",
    icon: "📃",
    category: "organize",
    desc: "Change PDF page order",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "resize",
    name: "Customize Page Size",
    icon: "📐",
    category: "edit",
    desc: "Change page dimensions",
    accept: ".pdf",
    multiple: false
  },
  {
    id: "text",
    name: "PDF to Text",
    icon: "📝",
    category: "convert",
    desc: "Extract selectable text",
    accept: ".pdf",
    multiple: false
  }
];

function renderTools(filter = "all", query = "") {
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = tools.filter(tool => {
    const categoryMatch =
      filter === "all" || tool.category === filter;

    const queryMatch =
      (tool.name + " " + tool.desc)
        .toLowerCase()
        .includes(query.toLowerCase());

    return categoryMatch && queryMatch;
  });

  filtered.forEach(tool => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "tool-card";
    card.innerHTML = `
      <span class="tool-icon">${tool.icon}</span>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
      <span class="tool-arrow">Open tool →</span>
    `;

    card.addEventListener("click", () => openTool(tool.id));
    grid.appendChild(card);
  });

  if (!filtered.length) {
    grid.textContent = "No tools found.";
  }
}

function openTool(id) {
  selectedTool = tools.find(t => t.id === id);
  selectedFiles = [];

  if (!selectedTool) return;

  title.textContent = selectedTool.name;
  description.textContent = selectedTool.desc;

  fileInput.accept = selectedTool.accept;
  fileInput.multiple = selectedTool.multiple;

  fileList.hidden = true;
  fileList.innerHTML = "";
  options.innerHTML = "";
  statusBox.textContent = "";

  dropzone.hidden = false;
  runButton.disabled = true;
  clearButton.disabled = true;

  createOptions();

  workspace.hidden = false;
  workspace.scrollIntoView({ behavior: "smooth" });
}

function createOptions() {
  if (!selectedTool) return;

  if (selectedTool.id === "split") {
    options.innerHTML = `
      <label>Pages to extract</label>
      <input id="page-range" type="text"
        placeholder="Example: 1-3, 5, 8">
      <small>Enter page numbers separated by commas.</small>
    `;
  }

  if (selectedTool.id === "rotate") {
    options.innerHTML = `
      <label>Rotation angle</label>
      <select id="rotation">
        <option value="90">90 degrees</option>
        <option value="180">180 degrees</option>
        <option value="270">270 degrees</option>
      </select>
    `;
  }

  if (selectedTool.id === "watermark") {
    options.innerHTML = `
      <label>Watermark text</label>
      <input id="watermark-text" type="text"
        value="PDF Studio" placeholder="Enter watermark">
    `;
  }

  if (selectedTool.id === "reorder") {
    options.innerHTML = `
      <label>New page order</label>
      <input id="page-order" type="text"
        placeholder="Example: 3,1,2,4">
      <small>Enter every page number in the new order.</small>
    `;
  }

  if (selectedTool.id === "resize") {
    options.innerHTML = `
      <label>Page size</label>
      <select id="page-size">
        <option value="a4">A4</option>
        <option value="a3">A3</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
    </select>
    `;
  }

  if (selectedTool.id === "compress") {
    options.innerHTML = `
      <label>Image quality</label>
      <select id="quality">
        <option value="0.75">High quality</option>
        <option value="0.55" selected>Balanced</option>
        <option value="0.35">Smaller file</option>
      </select>
      <small>Compression converts pages into images.
      Text selection and vector quality will be lost.</small>
    `;
  }
}

function showStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.className = "status " + type;
}

function updateFiles() {
  fileList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "file-item";
    item.textContent =
      `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    fileList.appendChild(item);
  });

  fileList.hidden = selectedFiles.length === 0;
  runButton.disabled = selectedFiles.length === 0;
  clearButton.disabled = selectedFiles.length === 0;

  if (selectedFiles.length) {
    showStatus(`${selectedFiles.length} file(s) selected.`);
  }
}

function addFiles(files) {
  if (!selectedTool) return;

  const incoming = Array.from(files);

  const valid = incoming.filter(file => {
    if (selectedTool.id === "jpg-pdf") {
      return ["image/jpeg", "image/png"].includes(file.type);
    }
    return file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
  });

  if (!valid.length) {
    showStatus("Please select a supported file.", "error");
    return;
  }

  selectedFiles = selectedTool.multiple
    ? [...selectedFiles, ...valid]
    : [valid[0]];

  updateFiles();
}

browse.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", event => {
  addFiles(event.target.files);
  fileInput.value = "";
});

dropzone.addEventListener("dragover", event => {
  event.preventDefault();
  dropzone.classList.add("dragging");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragging");
});

dropzone.addEventListener("drop", event => {
  event.preventDefault();
  dropzone.classList.remove("dragging");
  addFiles(event.dataTransfer.files);
});

clearButton.addEventListener("click", () => {
  selectedFiles = [];
  updateFiles();
  showStatus("Files cleared.");
});

closeButton.addEventListener("click", () => {
  workspace.hidden = true;
  selectedFiles = [];
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function outputName(file, suffix = "processed") {
  return file.name.replace(/\.pdf$/i, "") +
    "-" + suffix + ".pdf";
}

async function loadPDF(file) {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes);
}

function parsePages(value, total) {
  const pages = [];

  value.split(",").forEach(part => {
    part = part.trim();

    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);

      if (a < 1 || b < a || b > total) {
        throw new Error("Invalid page range.");
      }

      for (let i = a; i <= b; i++) pages.push(i - 1);
    } else {
      const n = Number(part);

      if (!Number.isInteger(n) || n < 1 || n > total) {
        throw new Error("Invalid page number.");
      }

      pages.push(n - 1);
    }
  });

  return [...new Set(pages)];
}

async function mergePDF() {
  const output = await PDFDocument.create();

  for (const file of selectedFiles) {
    const source = await loadPDF(file);
    const pages = await output.copyPages(
      source,
      source.getPageIndices()
    );
    pages.forEach(page => output.addPage(page));
  }

  const bytes = await output.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    "merged.pdf"
  );
}

async function splitPDF() {
  const source = await loadPDF(selectedFiles[0]);
  const range = $("page-range").value.trim();

  const pages = parsePages(range, source.getPageCount());
  const output = await PDFDocument.create();

  const copied = await output.copyPages(source, pages);
  copied.forEach(page => output.addPage(page));

  const bytes = await output.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(selectedFiles[0], "split")
  );
}

async function rotatePDF() {
  const pdf = await loadPDF(selectedFiles[0]);
  const angle = Number($("rotation").value);

  pdf.getPages().forEach(page => {
    page.setRotation(degrees(
      (page.getRotation().angle + angle) % 360
    ));
  });

  const bytes = await pdf.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(selectedFiles[0], "rotated")
  );
}

async function watermarkPDF() {
  const pdf = await loadPDF(selectedFiles[0]);
  const text = $("watermark-text").value.trim();

  if (!text) throw new Error("Enter watermark text.");

  const font = await pdf.embedFont(StandardFonts.Helvetica);

  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();

    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: 34,
      font,
      color: rgb(0.65, 0.72, 0.82),
      opacity: 0.35,
      rotate: degrees(35)
    });
  });

  const bytes = await pdf.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(selectedFiles[0], "watermarked")
  );
}

async function reorderPDF() {
  const source = await loadPDF(selectedFiles[0]);
  const order = $("page-order").value.trim();
  const pages = order.split(",").map(Number);
  const total = source.getPageCount();

  if (
    pages.length !== total ||
    pages.some(n => !Number.isInteger(n) || n < 1 || n > total) ||
    new Set(pages).size !== total
  ) {
    throw new Error(
      `Enter all ${total} page numbers exactly once.`
    );
  }

  const output = await PDFDocument.create();
  const copied = await output.copyPages(
    source,
    pages.map(n => n - 1)
  );

  copied.forEach(page => output.addPage(page));

  const bytes = await output.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(selectedFiles[0], "reordered")
  );
}

async function resizePDF() {
  const pdf = await loadPDF(selectedFiles[0]);
  const size = $("page-size").value;

  const sizes = {
    a4: [595.28, 841.89],
    a3: [841.89, 1190.55],
    letter: [612, 792],
    legal: [612, 1008]
  };

  const [width, height] = sizes[size];

  pdf.getPages().forEach(page => {
    page.setSize(width, height);
  });

  const bytes = await pdf.save();
  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(selectedFiles[0], size)
  );
}

async function jpgToPDF() {
  const pdf = await PDFDocument.create();

  for (const file of selectedFiles) {
    const bytes = await file.arrayBuffer();

    const image = file.type === "image/png"
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);

    const page = pdf.addPage([image.width, image.height]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
  }

  const result = await pdf.save();

  downloadBlob(
    new Blob([result], { type: "application/pdf" }),
    "images-to-pdf.pdf"
  );
}

async function pdfToJPG() {
  const file = selectedFiles[0];
  const data = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(data)
  }).promise;

  const zip = new JSZip();

  for (let i = 1; i <= pdf.numPages; i++) {
    showStatus(`Converting page ${i} of ${pdf.numPages}...`);

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise;

    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    zip.file(`page-${i}.jpg`, blob);
    canvas.width = 0;
    canvas.height = 0;
  }

  const result = await zip.generateAsync({ type: "blob" });
  downloadBlob(result, "pdf-pages.zip");
}

async function pdfToText() {
  const data = await selectedFiles[0].arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(data)
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    showStatus(`Extracting page ${i} of ${pdf.numPages}...`);

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text += `\n\n--- Page ${i} ---\n\n`;
    text += content.items.map(item => item.str).join(" ");
  }

  downloadBlob(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
    "pdf-text.txt"
  );
}

async function compressPDF() {
  const file = selectedFiles[0];
  const quality = Number($("quality").value);
  const data = await file.arrayBuffer();

  const source = await pdfjsLib.getDocument({
    data: new Uint8Array(data)
  }).promise;

  const output = await PDFDocument.create();

  for (let i = 1; i <= source.numPages; i++) {
    showStatus(`Compressing page ${i} of ${source.numPages}...`);

    const page = await source.getPage(i);
    const viewport = page.getViewport({ scale: 1.2 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport
    }).promise;

    const imageBlob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );

    const imageBytes = await imageBlob.arrayBuffer();
    const image = await output.embedJpg(imageBytes);

    const newPage = output.addPage([
      viewport.width,
      viewport.height
    ]);

    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  const bytes = await output.save({
    useObjectStreams: true
  });

  downloadBlob(
    new Blob([bytes], { type: "application/pdf" }),
    outputName(file, "compressed")
  );
}

async function runTool() {
  if (!selectedTool || !selectedFiles.length) return;

  runButton.disabled = true;
  showStatus("Processing your file. Please wait...");

  try {
    switch (selectedTool.id) {
      case "merge":
        await mergePDF();
        break;

      case "split":
        await splitPDF();
        break;

      case "rotate":
        await rotatePDF();
        break;

      case "watermark":
        await watermarkPDF();
        break;

      case "reorder":
        await reorderPDF();
        break;

      case "resize":
        await resizePDF();
        break;

      case "jpg-pdf":
        await jpgToPDF();
        break;

      case "pdf-jpg":
        await pdfToJPG();
        break;

      case "text":
        await pdfToText();
        break;

      case "compress":
        await compressPDF();
        break;

      default:
        throw new Error("This tool is not available.");
    }

    showStatus("Success! Your file is ready to download.", "success");

  } catch (error) {
    console.error(error);
    showStatus(
      error.message || "Something went wrong. Please try again.",
      "error"
    );
  } finally {
    runButton.disabled = false;
  }
}

runButton.addEventListener("click", runTool);

if (search) {
  search.addEventListener("input", () => {
    const active = document.querySelector(".tab.active");
    renderTools(active?.dataset.filter || "all", search.value);
  });
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t =>
      t.classList.remove("active")
    );

    tab.classList.add("active");
    renderTools(tab.dataset.filter, search?.value || "");
  });
});

$("year").textContent = new Date().getFullYear();

renderTools();

/* PDF STUDIO INITIALIZED */
console.log("PDF Studio is ready!");
