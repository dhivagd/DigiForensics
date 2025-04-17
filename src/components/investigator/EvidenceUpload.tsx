
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
import { addEvidence } from '../../utils/caseManagement';
import { uploadFile } from '../../utils/fileStorage';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, Lock, Upload, QrCode } from 'lucide-react';

interface EvidenceUploadProps {
  cases: Case[];
  selectedCase: Case | null;
  onCaseSelect: (caseItem: Case | null) => void;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ cases, selectedCase, onCaseSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedEvidence, setUploadedEvidence] = useState<{ id: string; fileName: string } | null>(null);
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
  
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedCase) {
      setError('Please select a case');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      // Upload the file (simulated)
      const filePath = await uploadFile(file, `evidence/${selectedCase.id}`);
      
      // Add evidence record
      const evidence = addEvidence({
        caseId: selectedCase.id,
        fileName: file.name,
        filePath,
        fileType: file.type,
        description,
        hash: 'AES-256 encrypted', // In real app, would be a proper hash
        uploadedBy: '' // This will be set by addEvidence function
      });
      
      // Show success message
      setSuccess(true);
      setUploadedEvidence({
        id: evidence.id,
        fileName: evidence.fileName
      });
      
      // Reset form
      setFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  
  const handleReset = () => {
    setSuccess(false);
    setUploadedEvidence(null);
  };
  
  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upload Evidence</CardTitle>
          <CardDescription>Submit encrypted evidence files for your assigned cases</CardDescription>
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
                <AlertTitle>Upload Successful</AlertTitle>
                <AlertDescription>
                  Your evidence file "{uploadedEvidence?.fileName}" has been uploaded and encrypted successfully.
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button onClick={handleReset}>Upload Another File</Button>
                <Button variant="outline" onClick={handleShowQRCode}>
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
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
                <Label htmlFor="file">Evidence File</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Supports images, documents, audio, and video files (max 100MB)
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a description of the evidence"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <Lock className="h-4 w-4" />
                <AlertTitle>Secure Upload</AlertTitle>
                <AlertDescription>
                  Your evidence will be encrypted with AES-256 and a secure hash will be generated to maintain chain of custody.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full" disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Evidence'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      
      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Evidence QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {uploadedEvidence && (
              <>
                <QRCodeSVG 
                  value={`digiforensics://evidence/${uploadedEvidence.id}`} 
                  size={200} 
                  level="H"
                />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Scan this QR code to access the evidence file
                </p>
                <p className="text-center text-xs text-blue-600 mt-2">
                  File: {uploadedEvidence.fileName}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EvidenceUpload;
