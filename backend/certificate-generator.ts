import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ICertificate } from './database';
import fs from 'fs/promises';
import { storage } from './storage';

export async function generateCertificatePdf(certificate: ICertificate): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1122.5, 793.75]); // A4 landscape size in points

    // Get active template
    const activeTemplate = await storage.getActiveTemplate();
    if (!activeTemplate) {
        throw new Error('No active template found. Please set an active template.');
    }

    // Load certificate template image from active template's path
    const templateImageBytes = await fs.readFile(activeTemplate.filePath);
    const templateImage = await pdfDoc.embedPng(templateImageBytes);

    // Draw the template image on the page
    page.drawImage(templateImage, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
    });

    // Load fonts
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add content to the certificate
    const { recipientName, courseName, issueDate, certificateId } = certificate;
    const issueDateString = new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Draw Recipient Name
    page.drawText(recipientName, {
        x: 100,
        y: 450,
        font: helveticaBoldFont,
        size: 48,
        color: rgb(0.1, 0.1, 0.1),
    });

    // Draw Course Name
    page.drawText(`For successfully completing the ${courseName} course`, {
        x: 100,
        y: 350,
        font: helveticaFont,
        size: 24,
        color: rgb(0.2, 0.2, 0.2),
    });

    // Draw Issue Date
    page.drawText(`Issued on: ${issueDateString}`, {
        x: 100,
        y: 250,
        font: helveticaFont,
        size: 18,
        color: rgb(0.3, 0.3, 0.3),
    });

    // Draw Certificate ID
    page.drawText(`Certificate ID: ${certificateId}`, {
        x: 100,
        y: 150,
        font: helveticaFont,
        size: 12,
        color: rgb(0.5, 0.5, 0.5),
    });

    // Save the PDF to a Uint8Array
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}
