const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Define the path to the temp directory
const tempDir = path.join(__dirname, 'public'); // Serving from 'public' directory

// Ensure the 'public' directory exists or create it
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const router = express.Router();

// Route to generate boarding pass and return a URL for downloading the PDF
router.post('/generate', (req, res) => {
  const {
    passengerName,
    flightNumber,
    departureAirport,
    destinationAirport,
    departureTime,
    boardingTime,
    gateNumber,
    seatNumber,
    ticketNumber,
  } = req.body;

  // Validate required fields
  if (!passengerName || !flightNumber || !departureAirport || !destinationAirport || !departureTime || !boardingTime || !gateNumber || !seatNumber || !ticketNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create a new PDF document
  const doc = new PDFDocument();
  const fileName = 'boarding_pass.pdf';
  const filePath = path.join(tempDir, fileName); // Save in the 'public' directory

  // Pipe the PDF document to the file
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Add data to the PDF
  doc.fontSize(20).font('Helvetica-Bold').text('Boarding Pass', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(12).font('Helvetica');
  doc.text(`Passenger Name: ${passengerName}`);
  doc.text(`Flight Number: ${flightNumber}`);
  doc.text(`Departure: ${departureAirport}`);
  doc.text(`Destination: ${destinationAirport}`);
  doc.text(`Date: ${departureTime.split(' ')[0]}`);
  doc.text(`Departure Time: ${departureTime}`);
  doc.text(`Boarding Time: ${boardingTime}`);
  doc.text(`Gate: ${gateNumber}`);
  doc.text(`Seat: ${seatNumber}`);
  doc.text(`Ticket Number: ${ticketNumber}`);
  doc.moveDown(2);
  doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  // Finalize the document
  doc.end();

  // Send the file URL once the PDF is fully written
  writeStream.on('finish', () => {
    // Return a URL like this
    const fileUrl = `/boarding_pass/${fileName}`; // This will be accessible publicly via /boarding_pass/boarding_pass.pdf

    res.json({ message: 'Boarding pass generated', url: fileUrl });
  });

  // Handle any error during the PDF creation process
  writeStream.on('error', (err) => {
    console.error('Error writing the PDF:', err);
    res.status(500).send('Error generating boarding pass.');
  });
});

// Serve the generated PDF from the 'public' directory
router.use('/boarding_pass', express.static(tempDir));

module.exports = router;
