
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to sanitize filenames
const sanitize = (name: string) => name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

/**
 * Converts an array of objects to a CSV blob and triggers download
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Build CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const val = row[header];
        // Handle strings with commas or quotes
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    )
  ].join('\n');

  // Add BOM for Excel compatibility
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Trigger Download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${sanitize(filename)}_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Captures a DOM element as an image and embeds it into a PDF along with a data table
 */
export const exportToPDF = async (elementId: string, data: any[], title: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Capture the visual chart
    const canvas = await html2canvas(element, {
      backgroundColor: '#1e293b', // Match dark theme
      scale: 2 // High resolution
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Initialize PDF (Portrait, A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Header
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Analytics Report: ${title}`, margin, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 26);

    // Add Chart Image
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', margin, 35, imgWidth, imgHeight);

    // Add Data Table Header
    let yPos = 35 + imgHeight + 15;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Data Summary (Top 25)", margin, yPos);
    yPos += 8;

    // Simple Table
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);

    // Filter useful keys (exclude deeply nested objects if any)
    const keys = data.length > 0 ? Object.keys(data[0]).slice(0, 3) : [];
    const colWidth = (pageWidth - (margin * 2)) / keys.length;

    // Draw Table Headers
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPos - 5, pageWidth - (margin * 2), 7, 'F');
    keys.forEach((key, i) => {
       pdf.text(key.toUpperCase(), margin + (i * colWidth) + 2, yPos);
    });
    yPos += 8;

    // Draw Table Rows
    data.slice(0, 25).forEach((row, rowIndex) => {
       if (yPos > pageHeight - 20) {
         pdf.addPage();
         yPos = 20;
       }
       keys.forEach((key, i) => {
         const val = String(row[key] !== undefined ? row[key] : '');
         // Truncate if too long
         const safeVal = val.length > 20 ? val.substring(0, 17) + '...' : val;
         pdf.text(safeVal, margin + (i * colWidth) + 2, yPos);
       });
       // Line
       pdf.setDrawColor(220, 220, 220);
       pdf.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
       yPos += 7;
    });

    pdf.save(`${sanitize(title)}_report_${Date.now()}.pdf`);

  } catch (error) {
    console.error('PDF generation failed', error);
    throw error;
  }
};
