
import React from 'react';
import { User } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { exportUsersToExcel } from '../../utils/excelManager';
import { FileSpreadsheet, RefreshCcw } from 'lucide-react';

interface InvestigatorListProps {
  investigators: User[];
  onRefresh: () => void;
}

const InvestigatorList: React.FC<InvestigatorListProps> = ({ investigators, onRefresh }) => {
  const handleExport = () => {
    exportUsersToExcel();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Investigators</CardTitle>
          <CardDescription>Manage registered investigators</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investigators.length > 0 ? (
              investigators.map((investigator) => (
                <TableRow key={investigator.id}>
                  <TableCell className="font-mono text-xs">{investigator.id.slice(0, 8)}...</TableCell>
                  <TableCell>{investigator.name || '-'}</TableCell>
                  <TableCell>{investigator.username}</TableCell>
                  <TableCell>{investigator.email || '-'}</TableCell>
                  <TableCell>{investigator.phone || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No investigators registered yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvestigatorList;
