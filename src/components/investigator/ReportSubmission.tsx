
import React, { useState, useRef } from 'react';
import { Case } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { submitReport } from '../../utils/caseManagement';
import { uploadFile } from '../../utils/fileStorage';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, FileText, QrCode } from 'lucide-react';

interface ReportSubmissionProps {
  cases: Case[];
  selectedCase: Case | null;
  onCaseSelect: (caseItem: Case | null) => void;
}

const ReportSubmission: React.FC<ReportSubmissionProps> = ({ cases, selectedCase, onCaseSelect }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<{ id: string; title: string } | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCaseChange = (caseId: string) => {
    const selected = cases.find(c => c.id === caseId) || null;
    onCaseSelect(selected);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedCase) {
      setError('Please select a case');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      let filePath;
      
      // Upload file if provided
      if (file) {
        filePath = await uploadFile(file, `reports/${selectedCase.id}`);
      }
      
      // Generate a simple AI summary (simulated)
      const summary = content ? 
        `This report details findings related to case ${selectedCase.id}. Key points include digital evidence analysis and forensic examination results.` : 
        undefined;
      
      // Submit the report
      const report = submitReport({
        caseId: selectedCase.id,
        title,
        content,
        filePath,
        summary,
        submittedBy: '' // This will be set by submitReport function
      });
      
      // Show success message
      setSuccess(true);
      setSubmittedReport({
        id: report.id,
        title: report.title
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setSuccess(false);
    setSubmittedReport(null);
  };
  
  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Submit Investigation Report</CardTitle>
          <CardDescription>Create and submit reports for your assigned cases</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Report Submitted Successfully</AlertTitle>
                <AlertDescription>
                  Your report "{submittedReport?.title}" has been submitted for review.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button onClick={handleReset}>Submit Another Report</Button>
                <Button variant="outline" onClick={handleShowQRCode}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="case">Select Case</Label>
                <Select 
                  value={selectedCase?.id || ''} 
                  onValueChange={handleCaseChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((caseItem) => (
                      <SelectItem key={caseItem.id} value={caseItem.id}>
                        {caseItem.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Enter report title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Report Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your investigation findings"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="file">Attach File (Optional)</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOCX, and other document formats
                </p>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle>AI Summary Generation</AlertTitle>
                <AlertDescription>
                  An AI-powered summary will be generated for your report to help administrators quickly review key findings.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full" disabled={submitting}>
                <FileText className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      
      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Report QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {submittedReport && (
              <>
                <QRCodeSVG 
                  value={`digiforensics://reports/${submittedReport.id}`} 
                  size={200} 
                  level="H"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan this QR code to access the report
                </p>
                <p className="text-center text-xs text-blue-600 mt-2">
                  Report: {submittedReport.title}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportSubmission;
