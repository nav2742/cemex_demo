const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');


const tempDir = path.join(__dirname, '../temp');

// Check if the 'temp' directory exists, if not, create it
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true }); // This will create the 'temp' directory and any necessary parent directories
}

const router = express.Router();

// Route to generate boarding pass as a downloadable PDF (with data passed in the body)
router.post('/generate', (req, res) => {
  // Destructure data from request body
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

  // Validate the required fields
  if (!passengerName || !flightNumber || !departureAirport || !destinationAirport || !departureTime || !boardingTime || !gateNumber || !seatNumber || !ticketNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create a new PDF document
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '../temp', 'boarding_pass.pdf'); // Temporary path for storing the generated PDF

  // Pipe the PDF to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Add the data to the PDF (boarding pass layout)
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

  // Once the PDF is ready, send it as a download
  doc.on('end', function () {
    res.download(filePath, 'boarding_pass.pdf', (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        return res.status(500).send('Error generating boarding pass.');
      }

      // Clean up the generated PDF after sending it
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting the file:', err);
      });
    });
  });
});

module.exports = router;
