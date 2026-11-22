// PDF Generator for AI Lecture Study Notes
const PDFDocument = require("pdfkit");

const generatePDF = (notes = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const title = String(notes.title || "Lecture Study Notes");
      const overview = String(notes.overview || "");
      const sections = Array.isArray(notes.sections) ? notes.sections : [];
      const keyTakeaways = Array.isArray(notes.keyTakeaways)
        ? notes.keyTakeaways
        : [];

      // Header Accent Bar
      doc.rect(0, 0, doc.page.width, 8).fill("#4F46E5");
      doc.moveDown(0.5);

      // Badge
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#6366F1")
        .text("AI STUDY NOTES", { align: "center", characterSpacing: 2 });
      doc.moveDown(0.3);

      // Title
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#0F172A")
        .text(title, { align: "center" });
      doc.moveDown(0.8);

      // Subtle Divider
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .lineWidth(1)
        .strokeColor("#E2E8F0")
        .stroke();
      doc.moveDown(1);

      // Overview
      if (overview) {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor("#4F46E5")
          .text("Overview");
        doc.moveDown(0.3);
        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#334155")
          .text(overview, { lineGap: 4 });
        doc.moveDown(1.4);
      }

      // Sections
      sections.forEach((sec, idx) => {
        if (!sec) return;
        const heading = String(sec.heading || `Section ${idx + 1}`);
        const content = String(sec.content || "");
        const keyPoints = Array.isArray(sec.keyPoints) ? sec.keyPoints : [];
        const codeText =
          typeof sec.code === "string" && sec.code.trim()
            ? sec.code.trim()
            : null;

        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .fillColor("#1E293B")
          .text(`${idx + 1}. ${heading}`);
        doc.moveDown(0.4);

        if (content) {
          doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("#334155")
            .text(content, { lineGap: 3 });
          doc.moveDown(0.6);
        }

        if (keyPoints.length > 0) {
          keyPoints.forEach((point) => {
            doc
              .font("Helvetica")
              .fontSize(10.5)
              .fillColor("#475569")
              .text(`  •  ${String(point)}`, { indent: 8, lineGap: 2 });
          });
          doc.moveDown(0.6);
        }

        if (codeText) {
          doc.moveDown(0.2);
          doc
            .font("Courier")
            .fontSize(9.5)
            .fillColor("#0F766E")
            .text(codeText, { indent: 12, lineGap: 2 });
          doc.font("Helvetica");
          doc.moveDown(0.6);
        }

        doc.moveDown(0.8);
      });

      // Key Takeaways
      if (keyTakeaways.length > 0) {
        doc
          .moveTo(50, doc.y)
          .lineTo(doc.page.width - 50, doc.y)
          .lineWidth(1)
          .strokeColor("#E2E8F0")
          .stroke();
        doc.moveDown(0.8);

        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .fillColor("#4F46E5")
          .text("Key Takeaways");
        doc.moveDown(0.5);

        keyTakeaways.forEach((item) => {
          doc
            .font("Helvetica")
            .fontSize(10.5)
            .fillColor("#1E293B")
            .text(`  -  ${String(item)}`, { indent: 8, lineGap: 3 });
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generatePDF;
