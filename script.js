/* PDF Studio 4.0 — PDF editing, conversion and OCR */
(() => {
"use strict";
const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;
if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const $ = id => document.getElementById(id);
const tools = [
 ["compress","Compress PDF","Reduce PDF file size","Optimize","▧","PDF"],
 ["merge","Merge PDF","Combine multiple PDF files","Organize","▤","PDF"],
 ["split","Split PDF","Extract a range of pages","Organize","✂","PDF"],
 ["pdfjpg","PDF to JPG","Convert PDF pages into images","Convert","▧","PDF"],
 ["jpgpdf","JPG to PDF","Convert images into a PDF","Convert","▣","Images"],
 ["rotate","Rotate PDF","Rotate all pages or selected pages","Organize","↻","PDF"],
 ["watermark","Add Watermark","Stamp text across your pages","Edit","♨","PDF"],
 ["reorder","Reorder Pages","Set a custom page order","Organize","☷","PDF"],
 ["extract","Extract Pages","Save selected pages as a new PDF","Organize","⇧","PDF"],
 ["delete","Delete Pages","Remove selected pages from a PDF","Organize","⌫","PDF"],
 ["numbers","Add Page Numbers","Add page numbers to every page","Edit","№","PDF"],
 ["resize","Customize Page Size","Resize pages to common paper sizes","Edit","◫","PDF"],
 ["text","PDF to Text","Extract selectable text from a PDF","Convert","▤","PDF"],
 ["protectnote","PDF Security Guide","Learn safe ways to protect a PDF","Edit","♢","Info"],
 ["info","PDF Info","View page count and document details","Edit","ⓘ","PDF"],
 ["word","PDF to Word","Export selectable PDF text as an editable DOCX","Convert","W","PDF"],
 ["ocr","OCR Scanner","Recognize text in scanned PDF pages","Convert","⌕","PDF"],
 ["editor","Advanced PDF Editor","Add text notes and labels to PDF pages","Edit","✎","PDF"],
 ["signature","Add Signature","Place a typed signature on PDF pages","Edit","✍","PDF"],
 ["excel","PDF to Excel","Export extracted PDF text into an Excel workbook","Convert","X","PDF"],
 ["ppt","PDF to PowerPoint","Turn PDF pages into PowerPoint slides","Convert","P","PDF"],
 ["imageword","Image to Word","Create a Word document containing your images","Convert","▧","Images"],
 ["security","Password Protection","Learn about PDF password protection options","Edit","🔒","Info"]
];
let activeTool=null, selectedFiles=[];
const grid=$("toolGrid"), modal=$("toolModal"), input=$("fileInput"), options=$("options");
function renderTools(){
 const category=document.querySelector(".filter.active")?.dataset.filter||"All";
 const query=$("searchTools").value.toLowerCase();
 grid.innerHTML="";
 tools.filter(t=>(category==="All"||t[3]===category)&&(`${t[1]} ${t[2]}`).toLowerCase().includes(query)).forEach(t=>{
  const b=document.createElement("button");b.className="tool-card";b.innerHTML=`<span class="open">Open tool →</span><span class="tool-icon">${t[4]}</span><b>${t[1]}</b><small>${t[2]}</small>`;b.addEventListener("click",()=>openTool(t[0]));grid.appendChild(b);
 });
}
function openTool(id){
 activeTool=tools.find(t=>t[0]===id);selectedFiles=[];input.value="";$("fileList").innerHTML="";$("errorText").textContent="";$("progressWrap").classList.add("hidden");$("runBtn").disabled=true;
 $("modalTitle").textContent=activeTool[1];$("modalDescription").textContent=activeTool[2];$("fileHint").textContent=activeTool[5]==="Images"?"Select one or more JPG or PNG images":"Select PDF files from your device";
 input.accept=activeTool[5]==="Images"?"image/jpeg,image/png": "application/pdf";
 input.multiple=["merge","jpgpdf","imageword"].includes(id);
 options.innerHTML=optionMarkup(id);modal.classList.remove("hidden");
}
function optionMarkup(id){
 const field=(label,name,placeholder,value="")=>`<label>${label}<input name="${name}" placeholder="${placeholder}" value="${value}"></label>`;
 if(id==="split"||id==="extract")return field("Page range (example: 1-3,5)","range","1-3,5","1-3");
 if(id==="delete")return field("Pages to delete (example: 2,4-5)","range","2,4-5","2");
 if(id==="rotate")return `<label>Rotation<select name="angle"><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise</option></select></label>`;
 if(id==="watermark")return field("Watermark text","watermark","CONFIDENTIAL","CONFIDENTIAL");
 if(id==="reorder")return field("New page order (example: 3,1,2)","order","3,1,2","2,1");
 if(id==="numbers")return `<label>Number position<select name="position"><option value="bottom">Bottom center</option><option value="top">Top center</option></select></label>`;
 if(id==="resize")return `<label>Page size<select name="size"><option value="A4">A4</option><option value="Letter">US Letter</option><option value="A5">A5</option></select></label>`;
 if(id==="compress")return `<label>Image quality<select name="quality"><option value="0.75">Balanced</option><option value="0.55">Smaller file</option><option value="0.9">Higher quality</option></select></label><small>Compression rasterizes pages; selectable text and vector detail will be lost.</small>`;
 if(id==="ocr")return `<label>OCR language<select name="language"><option value="eng">English</option><option value="ben">Bengali</option><option value="hin">Hindi</option><option value="eng+ben">English + Bengali</option></select></label><small>Language data downloads when OCR starts. Scanned pages are rendered locally in your browser.</small>`;
 if(id==="word")return `<small>Creates an editable DOCX from selectable PDF text. Complex layouts, columns, tables and images may not match the original PDF exactly.</small>`;
 if(id==="protectnote"||id==="security")return `<p class="hint">This browser-only edition does not currently add or remove PDF passwords. Do not treat a visual signature as a certificate-backed digital signature. Use a trusted PDF application for encryption and certificate signatures.</p>`;
 if(id==="editor")return `<label>Text to add<input name="edittext" placeholder="Type your note or label" value="My note"></label><label>Page number<input name="editpage" type="number" min="1" value="1"></label><label>Font size<input name="fontsize" type="number" min="8" max="72" value="18"></label><small>Adds a text annotation near the upper-left area of the selected page. It does not edit existing PDF text.</small>`;
 if(id==="signature")return `<label>Signature name<input name="signname" placeholder="Your name" value=""></label><label>Page number<input name="signpage" type="number" min="1" value="1"></label><small>Adds a typed visual signature. This is not a cryptographic or certificate-backed digital signature.</small>`;
 if(id==="excel")return `<small>Extracts selectable PDF text into spreadsheet rows. Complex tables may need manual cleanup; scanned PDFs need OCR first.</small>`;
 if(id==="ppt")return `<small>Creates one slide image per PDF page. The slide images are not individually editable text or shapes.</small>`;
 if(id==="imageword")return `<small>Places each selected JPG/PNG image on its own page in an editable Word document.</small>`;
 return "";
}
function addFiles(files){
 selectedFiles=Array.from(files);$("fileList").innerHTML=selectedFiles.map(f=>`<div>✓ ${escapeHtml(f.name)} · ${formatBytes(f.size)}</div>`).join("");$("runBtn").disabled=!selectedFiles.length&&activeTool[0]!=="protectnote";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function formatBytes(n){return n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(2)} MB`;}
function val(name){return options.querySelector(`[name="${name}"]`)?.value||"";}
function parsePages(str,count){let out=[];for(const part of str.split(",").map(s=>s.trim()).filter(Boolean)){if(part.includes("-")){let [a,b]=part.split("-").map(Number);if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||b<a||b>count)throw Error("Invalid page range. Check the page numbers.");for(let i=a;i<=b;i++)out.push(i-1);}else{let n=Number(part);if(!Number.isInteger(n)||n<1||n>count)throw Error("Invalid page number.");out.push(n-1);}}return [...new Set(out)];}
function download(bytes,name,type="application/pdf"){const blob=new Blob([bytes],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
async function readPdf(file){return PDFDocument.load(await file.arrayBuffer());}
async function run(){
 $("runBtn").disabled=true;$("errorText").textContent="";$("progressWrap").classList.remove("hidden");$("progressBar").style.width="25%";$("progressText").textContent="Processing in your browser…";
 try{
  const id=activeTool[0],name=selectedFiles[0]?.name.replace(/\.pdf$/i,"")||"pdf-studio";
  if(id==="protectnote"){alert("PDF password encryption is not included in this browser-only edition.");return;}
  if(id==="info"){const d=await readPdf(selectedFiles[0]);alert(`Pages: ${d.getPageCount()}\\nTitle: ${d.getTitle()||"Not set"}\\nFile size: ${formatBytes(selectedFiles[0].size)}`);return;}
  if(id==="word"){
    if(!window.pdfjsLib)throw Error("PDF text engine did not load. Check your internet connection and refresh.");
    if(!window.docx)throw Error("Word export library did not load. Check your internet connection and refresh.");
    const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise;
    const paragraphs=[];
    for(let p=1;p<=pdf.numPages;p++){
      const page=await pdf.getPage(p),content=await page.getTextContent();
      const lines=[];
      for(const item of content.items){
        if(!item.str || !item.str.trim()) continue;
        lines.push(item.str);
      }
      const pageText=lines.join(" ").replace(/[ \t]+/g," ").trim();
      paragraphs.push(new docx.Paragraph({text:pageText || "[No selectable text on this page]", pageBreakBefore:p>1, spacing:{after:180}}));
      $("progressBar").style.width=`${Math.round(p/pdf.numPages*85)}%`;
      $("progressText").textContent=`Reading page ${p} of ${pdf.numPages}…`;
    }
    const documentFile=new docx.Document({sections:[{properties:{},children:paragraphs}]});
    const blob=await docx.Packer.toBlob(documentFile);
    download(await blob.arrayBuffer(),`${name}.docx`,"application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    return;
  }
  if(id==="ocr"){
    if(!window.pdfjsLib)throw Error("PDF rendering library did not load. Check your internet connection and refresh.");
    if(!window.Tesseract)throw Error("OCR engine did not load. Check your internet connection and refresh.");
    const language=val("language")||"eng";
    const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise;
    const worker=await Tesseract.createWorker(language,1,{logger:m=>{
      if(m.status==="recognizing text"){$("progressBar").style.width=`${Math.max(5,Math.round(m.progress*90))}%`;$("progressText").textContent=`Recognizing text… ${Math.round(m.progress*100)}%`;}
    }});
    const results=[];
    try{
      for(let p=1;p<=pdf.numPages;p++){
        const page=await pdf.getPage(p),vp=page.getViewport({scale:1.7}),canvas=document.createElement("canvas");
        canvas.width=vp.width;canvas.height=vp.height;
        await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
        const result=await worker.recognize(canvas);
        results.push(`--- Page ${p} ---\\n${result.data.text.trim()}`);
        $("progressBar").style.width=`${Math.round(p/pdf.numPages*90)}%`;
        $("progressText").textContent=`OCR page ${p} of ${pdf.numPages}…`;
        canvas.width=canvas.height=1;
      }
    } finally { await worker.terminate(); }
    download(new TextEncoder().encode(results.join("\\n\\n")) ,`${name}-ocr.txt`,"text/plain;charset=utf-8");
    return;
  }
  if(id==="security"){alert("Password encryption is not implemented in this browser-only build. Use a trusted PDF editor for real encryption.");return;}
  if(id==="editor"||id==="signature"){
    const doc=await readPdf(selectedFiles[0]),pages=doc.getPages(),pageNo=Number(val(id==="editor"?"editpage":"signpage")||1);
    if(!Number.isInteger(pageNo)||pageNo<1||pageNo>pages.length)throw Error("Enter a valid page number.");
    const page=pages[pageNo-1],{width,height}=page.getSize(),font=await doc.embedFont(StandardFonts.Helvetica);
    const content=id==="editor"?(val("edittext")||"Note"):("✍ "+(val("signname")||"Signature"));
    const size=id==="editor"?Math.min(72,Math.max(8,Number(val("fontsize")||18))):20;
    page.drawText(content,{x:48,y:height-72,size,font,color:rgb(.12,.25,.55),opacity:.95});
    download(await doc.save(),`${name}-${id}.pdf`);return;
  }
  if(id==="excel"){
    if(!window.pdfjsLib)throw Error("PDF text engine did not load. Check your internet connection and refresh.");
    if(!window.XLSX)throw Error("Excel export library did not load. Refresh and try again.");
    const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise,rows=[["Page","Extracted text"]];
    for(let p=1;p<=pdf.numPages;p++){
      const page=await pdf.getPage(p),content=await page.getTextContent();
      const text=content.items.map(x=>x.str).filter(Boolean).join(" ").trim();
      rows.push([p,text]);
      $("progressBar").style.width=`${Math.round(p/pdf.numPages*85)}%`;
    }
    const book=XLSX.utils.book_new(),sheet=XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(book,sheet,"PDF Text");XLSX.writeFile(book,`${name}.xlsx`);return;
  }
  if(id==="ppt"){
    if(!window.pdfjsLib)throw Error("PDF rendering library did not load. Refresh and try again.");
    if(!window.pptxgen)throw Error("PowerPoint library did not load. Refresh and try again.");
    const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise,pptx=new pptxgen();
    pptx.layout="LAYOUT_WIDE";
    for(let p=1;p<=pdf.numPages;p++){
      const page=await pdf.getPage(p),vp=page.getViewport({scale:1.5}),canvas=document.createElement("canvas");
      canvas.width=vp.width;canvas.height=vp.height;
      await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;
      const slide=pptx.addSlide();slide.addImage({data:canvas.toDataURL("image/png"),x:0,y:0,w:13.333,h:7.5});
      $("progressBar").style.width=`${Math.round(p/pdf.numPages*85)}%`;canvas.width=canvas.height=1;
    }
    await pptx.writeFile({fileName:`${name}.pptx`});return;
  }
  if(id==="imageword"){
    if(!window.docx)throw Error("Word export library did not load. Refresh and try again.");
    const children=[];
    for(let i=0;i<selectedFiles.length;i++){
      const f=selectedFiles[i],bytes=await f.arrayBuffer(),isPng=f.type==="image/png";
      const image= new docx.ImageRun({data:bytes,transformation:{width:520,height:680},type:isPng?"png":"jpg"});
      children.push(new docx.Paragraph({children:[image],pageBreakBefore:i>0}));
    }
    const doc=new docx.Document({sections:[{children}]});
    const blob=await docx.Packer.toBlob(doc);
    download(await blob.arrayBuffer(),"images.docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document");return;
  }
  if(id==="text"){if(!window.pdfjsLib)throw Error("PDF text engine did not load. Check your internet connection and refresh.");let pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise,all=[];for(let p=1;p<=pdf.numPages;p++){let page=await pdf.getPage(p),content=await page.getTextContent();all.push(`--- Page ${p} ---\\n`+content.items.map(x=>x.str).join(" "));}download(new Blob([all.join("\\n\\n")],{type:"text/plain"}),"extracted-text.txt","text/plain");return;}
  if(id==="jpgpdf"){let d=await PDFDocument.create();for(const f of selectedFiles){let bytes=await f.arrayBuffer(),img=f.type==="image/png"?await d.embedPng(bytes):await d.embedJpg(bytes),page=d.addPage([img.width,img.height]);page.drawImage(img,{x:0,y:0,width:img.width,height:img.height});}download(await d.save(),`${name}-images.pdf`);return;}
  if(id==="pdfjpg"){const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise;for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p),vp=page.getViewport({scale:1.5}),canvas=document.createElement("canvas");canvas.width=vp.width;canvas.height=vp.height;await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;const blob=await new Promise(r=>canvas.toBlob(r,"image/jpeg",.9));download(await blob.arrayBuffer(),`${name}-page-${p}.jpg`,"image/jpeg");}return;}
  if(id==="compress"){const pdf=await pdfjsLib.getDocument({data:await selectedFiles[0].arrayBuffer()}).promise,out=await PDFDocument.create(),quality=Number(val("quality")||.75);for(let p=1;p<=pdf.numPages;p++){let page=await pdf.getPage(p),vp=page.getViewport({scale:.9}),canvas=document.createElement("canvas");canvas.width=vp.width;canvas.height=vp.height;await page.render({canvasContext:canvas.getContext("2d"),viewport:vp}).promise;let blob=await new Promise(r=>canvas.toBlob(r,"image/jpeg",quality)),img=await out.embedJpg(await blob.arrayBuffer()),pg=out.addPage([vp.width,vp.height]);pg.drawImage(img,{x:0,y:0,width:vp.width,height:vp.height});$("progressBar").style.width=`${Math.round(p/pdf.numPages*90)}%`;}download(await out.save(),`${name}-compressed.pdf`);return;}
  if(id==="merge"){let out=await PDFDocument.create();for(const f of selectedFiles){let src=await readPdf(f),pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}download(await out.save(),"merged.pdf");return;}
  const src=await readPdf(selectedFiles[0]),count=src.getPageCount(),out=await PDFDocument.create();
  if(id==="split"||id==="extract"){let indices=parsePages(val("range"),count),pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));download(await out.save(),`${name}-pages.pdf`);return;}
  if(id==="delete"){let remove=new Set(parsePages(val("range"),count));let indices=src.getPageIndices().filter(i=>!remove.has(i));if(!indices.length)throw Error("You cannot delete every page.");let pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));download(await out.save(),`${name}-edited.pdf`);return;}
  if(id==="reorder"){let indices=parsePages(val("order"),count);if(indices.length!==count)throw Error(`Enter every page exactly once. This PDF has ${count} pages.`);let pages=await out.copyPages(src,indices);pages.forEach(p=>out.addPage(p));download(await out.save(),`${name}-reordered.pdf`);return;}
  if(id==="rotate"){src.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+Number(val("angle")))%360)));download(await src.save(),`${name}-rotated.pdf`);return;}
  if(id==="watermark"||id==="numbers"){const font=await src.embedFont(StandardFonts.Helvetica);src.getPages().forEach((p,i)=>{let {width,height}=p.getSize();if(id==="watermark"){p.drawText(val("watermark")||"CONFIDENTIAL",{x:width*.12,y:height*.5,size:34,font,color:rgb(.55,.62,.72),opacity:.28,rotate:degrees(35)});}else{let text=String(i+1),size=10,x=width/2-font.widthOfTextAtSize(text,size)/2,y=val("position")==="top"?height-22:18;p.drawText(text,{x,y,size,font,color:rgb(.35,.4,.5)});}});download(await src.save(),`${name}-${id}.pdf`);return;}
  if(id==="resize"){let sizes={A4:[595.28,841.89],Letter:[612,792],A5:[419.53,595.28]},[w,h]=sizes[val("size")||"A4"];src.getPages().forEach(p=>p.setSize(w,h));download(await src.save(),`${name}-resized.pdf`);return;}
  throw Error("This tool is not available yet.");
 }catch(e){$("errorText").textContent=e.message||"Something went wrong. Please try another file.";}
 finally{$("progressBar").style.width="100%";$("progressText").textContent="Finished";$("runBtn").disabled=false;setTimeout(()=>$("progressWrap").classList.add("hidden"),1800);}
}
$("filters").addEventListener("click",e=>{let b=e.target.closest("button[data-filter]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderTools();});
$("searchTools").addEventListener("input",renderTools);$("closeModal").onclick=$("cancelBtn").onclick=()=>modal.classList.add("hidden");$("fileInput").addEventListener("change",e=>addFiles(e.target.files));$("dropZone").addEventListener("dragover",e=>{e.preventDefault();});$("dropZone").addEventListener("drop",e=>{e.preventDefault();addFiles(e.dataTransfer.files);});$("runBtn").addEventListener("click",run);
$("themeBtn").addEventListener("click",()=>document.body.classList.toggle("dark"));
renderTools();
})();