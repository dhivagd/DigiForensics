
import React, { useState } from 'react';
import { Case } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import CaseDetail from '../common/CaseDetail';

interface CaseListProps {
  cases: Case[];
  onCaseSelected: (caseItem: Case) => void;
}

const CaseList: React.FC<CaseListProps> = ({ cases, onCaseSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewCase, setViewCase] = useState<Case | null>(null);
  
  const filteredCases = cases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Cases</CardTitle>
          <CardDescription>View and work on your assigned forensic cases</CardDescription>
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
                    <TableCell>{format(new Date(caseItem.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => onCaseSelected(caseItem)} 
                          size="sm"
                          variant="outline"
                        >
                          Select
                        </Button>
                        <Button 
                          onClick={() => setViewCase(caseItem)} 
                          size="sm" 
                          variant="outline"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm ? 
                      "No cases match your search criteria" : 
                      "No cases assigned to you yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Case Dialog */}
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
