// ── PDF Generator
const PDFDocument = require("pdfkit")
const generatePDF = (notes) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Title
    doc
      .fontSize(22)
      .fillColor("#4F8EF7")
      .text(notes.title, { align: "center" });
    doc.moveDown();

    // Overview
    doc.fontSize(12).fillColor("#555").text(notes.overview);
    doc.moveDown(2);

    // Sections
    notes.sections?.forEach((sec, idx) => {
      doc
        .fontSize(15)
        .fillColor("#222")
        .text(`${idx + 1}. ${sec.heading}`);
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#444").text(sec.content);
      doc.moveDown();

      sec.keyPoints?.forEach((point) => {
        doc.fontSize(11).fillColor("#333").text(`  • ${point}`);
      });

      if (sec.code) {
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#27ae60").font("Courier").text(sec.code);
        doc.font("Helvetica");
      }
      doc.moveDown(1.5);
    });

    // Key Takeaways
    if (notes.keyTakeaways?.length > 0) {
      doc.fontSize(15).fillColor("#4F8EF7").text("Key Takeaways");
      doc.moveDown(0.5);
      notes.keyTakeaways.forEach((t) => {
        doc.fontSize(11).fillColor("#333").text(`  ✓ ${t}`);
      });
    }

    doc.end();
  });
};

module.exports = generatePDF;