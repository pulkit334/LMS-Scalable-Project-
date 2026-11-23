const PDFDocument = require("pdfkit");

const generateCertificate = ({
  studentName = "Student",
  courseName = "Course",
  instructorName = "Instructor",
  completionDate = new Date(),
  certificateId = "CERT-000000",
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 48,
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const W = doc.page.width;
      const H = doc.page.height;

      // Dark obsidian backdrop
      doc.rect(0, 0, W, H).fill("#090b10");

      // Outer gold border
      doc
        .rect(24, 24, W - 48, H - 48)
        .lineWidth(2)
        .strokeColor("#D97706")
        .stroke();

      // Inner subtle slate border
      doc
        .rect(34, 34, W - 68, H - 68)
        .lineWidth(0.75)
        .strokeColor("#334155")
        .stroke();

      // Top accent bar
      doc.rect(W / 2 - 90, 56, 180, 3).fill("#F59E0B");

      // Brand header
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#FBBF24")
        .text("NOTION-X LMS", 0, 74, { align: "center", characterSpacing: 3 });

      // Main Title
      doc
        .font("Helvetica-Bold")
        .fontSize(32)
        .fillColor("#F8FAFC")
        .text("CERTIFICATE OF COMPLETION", 0, 114, {
          align: "center",
          characterSpacing: 1.5,
        });

      doc
        .font("Helvetica")
        .fontSize(13)
        .fillColor("#94A3B8")
        .text("THIS IS PROUDLY PRESENTED TO", 0, 174, {
          align: "center",
          characterSpacing: 2,
        });

      // Student Name
      doc
        .font("Helvetica-Bold")
        .fontSize(36)
        .fillColor("#FBBF24")
        .text(String(studentName), 60, 212, { align: "center", width: W - 120 });

      // Underline beneath name
      doc
        .moveTo(W / 2 - 170, 264)
        .lineTo(W / 2 + 170, 264)
        .lineWidth(1)
        .strokeColor("#475569")
        .stroke();

      // Completion statement
      doc
        .font("Helvetica")
        .fontSize(13)
        .fillColor("#CBD5E1")
        .text("for successfully completing 100% of the curriculum and assessments for", 0, 286, {
          align: "center",
        });

      // Course Title
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#FFFFFF")
        .text(String(courseName), 80, 318, { align: "center", width: W - 160 });

      // Footer Columns: Date | Seal | Instructor
      const footerY = H - 125;

      // Left: Completion Date
      const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc
        .moveTo(90, footerY + 28)
        .lineTo(270, footerY + 28)
        .lineWidth(1)
        .strokeColor("#475569")
        .stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#F1F5F9")
        .text(formattedDate, 90, footerY + 6, { width: 180, align: "center" });
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#64748B")
        .text("DATE OF COMPLETION", 90, footerY + 36, {
          width: 180,
          align: "center",
          characterSpacing: 1,
        });

      // Center Seal
      doc.circle(W / 2, footerY + 18, 28).lineWidth(1.5).strokeColor("#F59E0B").stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#FBBF24")
        .text("VERIFIED", W / 2 - 30, footerY + 13, { width: 60, align: "center" });

      // Right: Instructor
      doc
        .moveTo(W - 270, footerY + 28)
        .lineTo(W - 90, footerY + 28)
        .lineWidth(1)
        .strokeColor("#475569")
        .stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#F1F5F9")
        .text(String(instructorName), W - 270, footerY + 6, {
          width: 180,
          align: "center",
        });
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#64748B")
        .text("LEAD INSTRUCTOR", W - 270, footerY + 36, {
          width: 180,
          align: "center",
          characterSpacing: 1,
        });

      // Certificate ID
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#475569")
        .text(`Certificate ID: ${certificateId}`, 0, H - 54, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateCertificate;
