
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { loadData } from '../../utils/fileStorage';
import { Report, Case } from '../../types';
import { format } from 'date-fns';
import { Eye, Download, QrCode } from 'lucide-react';
import { downloadFile } from '../../utils/fileStorage';
import { QRCodeSVG } from 'qrcode.react';

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [cases, setCases] = useState<Record<string, Case>>({});
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  useEffect(() => {
    const loadReports = () => {
      const allReports = loadData('reports') || [];
      const allCases = loadData('cases') || [];
      
      // Create a map of case IDs to cases
      const caseMap: Record<string, Case> = {};
      allCases.forEach((c: Case) => {
        caseMap[c.id] = c;
      });
      
      setReports(allReports);
      setCases(caseMap);
    };
    
    loadReports();
  }, []);
  
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };
  
  const handleDownload = (report: Report) => {
    if (report.filePath) {
      const content = downloadFile(report.filePath);
      if (content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  
  const handleShowQRCode = (report: Report) => {
    setSelectedReport(report);
    setShowQRCode(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Investigation Reports</CardTitle>
          <CardDescription>View and manage reports submitted by investigators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{cases[report.caseId]?.title || report.caseId}</TableCell>
                    <TableCell>{report.submittedBy}</TableCell>
                    <TableCell>{format(new Date(report.submittedAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.filePath && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShowQRCode(report)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No reports have been submitted yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Report Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport && !showQRCode} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Submitted by {selectedReport.submittedBy} on {format(new Date(selectedReport.submittedAt), 'PPP')}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Case: {cases[selectedReport.caseId]?.title || selectedReport.caseId}
                </p>
              </div>
              
              <div className="border rounded-md p-4 bg-gray-50">
                {selectedReport.content ? (
                  <pre className="whitespace-pre-wrap text-sm">{selectedReport.content}</pre>
                ) : (
                  <p className="italic text-muted-foreground">No content available</p>
                )}
              </div>
              
              {selectedReport.summary && (
                <>
                  <h3 className="text-lg font-semibold">AI-Generated Summary</h3>
                  <div className="border rounded-md p-4 bg-blue-50">
                    <p>{selectedReport.summary}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Report QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {selectedReport && (
              <>
                <QRCodeSVG 
                  value={`digiforensics://reports/${selectedReport.id}`} 
                  size={200} 
                  level="H"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan this QR code to access the report
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportList;
