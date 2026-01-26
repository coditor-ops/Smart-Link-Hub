import jsPDF, { GState } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalyticsData {
    linkHits: Array<{
        title: string;
        url: string;
        hits: number;
        lastAccessed?: string;
    }>;
    userLocations: Array<{
        country: string;
        city: string;
        count: number;
    }>;
    timestamp: string;
}

export const downloadStatsReport = (data: AnalyticsData) => {
    const doc = new jsPDF();

    // Cyberpunk Color Palette
    const neonGreen = [0, 255, 65];
    const darkBg = [10, 10, 15];

    // Watermark - "Confidential"
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(40);
    doc.setFont("courier", "bold");
    doc.setGState(new GState({ opacity: 0.1 }));
    doc.text("CONFIDENTIAL", 40, 150, { angle: 45 });
    doc.setGState(new GState({ opacity: 1 })); // Reset opacity

    // Title - "Access Terminal Report"
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(0, 0, 210, 40, "F"); // Header background

    doc.setTextColor(neonGreen[0], neonGreen[1], neonGreen[2]);
    doc.setFontSize(22);
    doc.setFont("courier", "bold");
    doc.text("ACCESS TERMINAL REPORT", 14, 25);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`GENERATED: ${data.timestamp}`, 14, 35);

    let finalY = 45;

    // Section 1: Link Hits
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("LINK TRAFFIC ANALYSIS", 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Link Title', 'URL', 'Total Hits', 'Last Accessed']],
        body: data.linkHits.map(link => [
            link.title,
            link.url,
            link.hits,
            link.lastAccessed || 'N/A'
        ]),
        theme: 'grid',
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [0, 255, 65],
            font: 'courier',
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [0, 255, 65]
        },
        styles: {
            font: 'courier',
            fontSize: 10,
            textColor: [20, 20, 20],
            lineColor: [20, 20, 20],
            lineWidth: 0.1
        },
        alternateRowStyles: {
            fillColor: [240, 255, 240]
        }
    });

    // Get Y position after first table
    // @ts-ignore
    finalY = doc.lastAutoTable.finalY + 20;

    // Section 2: User Locations
    doc.setFontSize(14);
    doc.text("GEOSPATIAL ORIGIN DATA", 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Country', 'City', 'Access Count']],
        body: data.userLocations.map(loc => [
            loc.country,
            loc.city,
            loc.count
        ]),
        theme: 'grid',
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [0, 255, 65],
            font: 'courier',
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [0, 255, 65]
        },
        styles: {
            font: 'courier',
            fontSize: 10,
            textColor: [20, 20, 20]
        },
        alternateRowStyles: {
            fillColor: [240, 255, 240]
        }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
            `SMART LINK HUB // SYSTEM SECURE // PAGE ${i} OF ${pageCount}`,
            14,
            doc.internal.pageSize.height - 10
        );
    }

    doc.save('terminal_report.pdf');
};
