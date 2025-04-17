
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { getCaseById, getEvidenceByCase, getReportsByCase } from '../../utils/caseManagement';
import { Case, Evidence, Report } from '../../types';
import { downloadFile } from '../../utils/fileStorage';
import { format, parseISO, isValid } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';

interface CaseDetailProps {
  caseId: string;
  open: boolean;
  onClose: () => void;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ caseId, open, onClose }) => {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<{ type: 'evidence' | 'report'; id: string } | null>(null);
  const [showQR, setShowQR] = useState(false);
  
  useEffect(() => {
    if (caseId) {
      const caseItem = getCaseById(caseId);
      if (caseItem) {
        setCaseData(caseItem);
        setEvidences(getEvidenceByCase(caseId));
        setReports(getReportsByCase(caseId));
      }
    }
  }, [caseId]);
  
  const handleDownload = (item: Evidence | Report) => {
    // Check if the item has filePath property and is Evidence type with fileName
    if ('filePath' in item && item.filePath) {
      // For Evidence, we expect fileName to exist
      // For Report, we'll use a default or the title if available
      const filename = 'fileName' in item ? item.fileName : ('title' in item ? item.title : 'report');
      
      const content = downloadFile(item.filePath);
      if (content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  
  const handleShowQR = (type: 'evidence' | 'report' | 'case', id: string) => {
    setSelectedItem({ type: type as 'evidence' | 'report', id });
    setShowQR(true);
  };

  // Safe date formatting function
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid Date';
      }
      return format(date, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  // Function to get status badge color
  const getStatusBadge = (status: Case['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Open</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Function to get priority badge color
  const getPriorityBadge = (priority: Case['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{caseData?.title || 'Case Details'}</DialogTitle>
          </DialogHeader>
          
          {caseData && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evidence">Evidence ({evidences.length})</TabsTrigger>
                <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Case ID</p>
                    <p className="font-mono">{caseData.id}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p>{formatDate(caseData.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div>{getStatusBadge(caseData.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <div>{getPriorityBadge(caseData.priority)}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{caseData.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => handleShowQR('case', caseData.id)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Show Case QR Code
                  </Button>
                </div>
              </TabsContent>
              
              {/* Evidence Tab */}
              <TabsContent value="evidence">
                {evidences.length > 0 ? (
                  <div className="space-y-4">
                    {evidences.map((evidence) => (
                      <div key={evidence.id} className="border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{evidence.fileName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Uploaded by {evidence.uploadedBy} on {formatDate(evidence.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownload(evidence)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleShowQR('evidence', evidence.id)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm">{evidence.description}</p>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Hash: {evidence.hash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No evidence has been uploaded yet</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports">
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Submitted by {report.submittedBy} on {formatDate(report.submittedAt)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
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
                              onClick={() => handleShowQR('report', report.id)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {report.content && (
                          <div className="mt-4 p-3 border rounded bg-white">
                            <p className="text-sm whitespace-pre-wrap">{report.content}</p>
                          </div>
                        )}
                        
                        {report.summary && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium">AI Summary</h5>
                            <p className="text-sm text-muted-foreground">{report.summary}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No reports have been submitted yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-xs bg-white">
          <DialogHeader>
            <DialogTitle>QR Code Access</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {selectedItem && (
              <>
                <QRCodeSVG 
                  value={`digiforensics://${selectedItem.type}/${selectedItem.id}`} 
                  size={200} 
                  level="H"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan this QR code to access the {selectedItem.type}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaseDetail;
