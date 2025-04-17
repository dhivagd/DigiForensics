import React, { useState } from 'react';
import { Case, User } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { assignInvestigatorsToCase, updateCaseStatus } from '../../utils/caseManagement';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle, Clock3, Eye, UserPlus } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import CaseDetail from '../common/CaseDetail';

interface CaseListProps {
  cases: Case[];
  investigators: User[];
  onCaseUpdated: (updatedCase: Case) => void;
}

const CaseList: React.FC<CaseListProps> = ({ cases, investigators, onCaseUpdated }) => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedInvestigators, setSelectedInvestigators] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Case['status']>('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCase, setViewCase] = useState<Case | null>(null);
  
  const handleAssignInvestigators = () => {
    if (selectedCase && selectedInvestigators.length > 0) {
      const updatedCase = assignInvestigatorsToCase(selectedCase.id, selectedInvestigators);
      if (updatedCase) {
        onCaseUpdated(updatedCase);
      }
    }
    setAssignDialogOpen(false);
    setSelectedInvestigators([]);
  };
  
  const handleUpdateStatus = () => {
    if (selectedCase) {
      const updatedCase = updateCaseStatus(selectedCase.id, selectedStatus);
      if (updatedCase) {
        onCaseUpdated(updatedCase);
      }
    }
    setStatusDialogOpen(false);
  };
  
  const handleInvestigatorChange = (investigatorId: string) => {
    setSelectedInvestigators(current => {
      if (current.includes(investigatorId)) {
        return current.filter(id => id !== investigatorId);
      } else {
        return [...current, investigatorId];
      }
    });
  };
  
  const filteredCases = cases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInvestigatorNames = (caseItem: Case) => {
    if (!Array.isArray(caseItem.assignedTo)) {
      console.warn(`Case ${caseItem.id} has assignedTo that is not an array:`, caseItem.assignedTo);
      return '';
    }
    
    return caseItem.assignedTo
      .map(id => investigators.find(i => i.id === id)?.name || id)
      .join(', ');
  };
  
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

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid Date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
          <CardDescription>Review and manage all forensic cases</CardDescription>
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-mono text-xs">{caseItem.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{caseItem.title}</TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                    <TableCell>{formatDate(caseItem.createdAt)}</TableCell>
                    <TableCell>
                      {Array.isArray(caseItem.assignedTo) && caseItem.assignedTo.length > 0 ? (
                        <span>{getInvestigatorNames(caseItem)}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setAssignDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setSelectedStatus(caseItem.status);
                            setStatusDialogOpen(true);
                          }}
                        >
                          {caseItem.status === 'open' && <Clock3 className="h-4 w-4" />}
                          {caseItem.status === 'in-progress' && <AlertTriangle className="h-4 w-4" />}
                          {caseItem.status === 'closed' && <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewCase(caseItem)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {searchTerm ? 
                      "No cases match your search criteria" : 
                      "No cases available. Create your first case to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Assign Investigators</DialogTitle>
            <DialogDescription>
              {selectedCase && `Select investigators to assign to the case: ${selectedCase.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {investigators.length > 0 ? (
              investigators.map((investigator) => (
                <div key={investigator.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={investigator.id} 
                    checked={selectedInvestigators.includes(investigator.id)}
                    onCheckedChange={() => handleInvestigatorChange(investigator.id)}
                  />
                  <label 
                    htmlFor={investigator.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {investigator.name || investigator.username}
                    {investigator.email && ` (${investigator.email})`}
                  </label>
                </div>
              ))
            ) : (
              <p>No investigators available. Register new investigators to assign cases.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignInvestigators}>Assign Selected</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Case Status</DialogTitle>
            <DialogDescription>
              {selectedCase && `Change the status for case: ${selectedCase.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Case['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {viewCase && (
        <CaseDetail 
          caseId={viewCase.id} 
          open={!!viewCase} 
          onClose={() => setViewCase(null)} 
        />
      )}
    </>
  );
};

export default CaseList;
