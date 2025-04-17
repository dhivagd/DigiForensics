
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { loadData } from '../../utils/fileStorage';
import { AuditLog } from '../../types';
import { format } from 'date-fns';
import { AlertTriangle, Clock, FileUp, FileCheck, Activity, LogIn, User, UserPlus } from 'lucide-react';

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  
  useEffect(() => {
    const loadLogs = () => {
      const allLogs = loadData('auditLogs') || [];
      // Sort logs by timestamp (newest first)
      allLogs.sort((a: AuditLog, b: AuditLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(allLogs);
      setFilteredLogs(allLogs);
    };
    
    loadLogs();
    
    // Set up interval to refresh data every minute
    const intervalId = setInterval(loadLogs, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Filter logs based on search term and action filter
    let filtered = logs;
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action.includes(actionFilter));
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter]);
  
  // Function to get an icon based on the action type
  const getActionIcon = (action: string) => {
    if (action.includes('evidence')) return <FileUp className="h-5 w-5 text-blue-500" />;
    if (action.includes('report')) return <FileCheck className="h-5 w-5 text-green-500" />;
    if (action.includes('case')) return <Clock className="h-5 w-5 text-yellow-500" />;
    if (action.includes('login')) return <LogIn className="h-5 w-5 text-purple-500" />;
    if (action.includes('registration')) return <UserPlus className="h-5 w-5 text-indigo-500" />;
    if (action.includes('error')) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Activity className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Audit Logs</CardTitle>
        <CardDescription>
          Complete activity log for chain of custody and compliance
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login/Logout</SelectItem>
              <SelectItem value="registration">Registration</SelectItem>
              <SelectItem value="case">Case Management</SelectItem>
              <SelectItem value="evidence">Evidence</SelectItem>
              <SelectItem value="report">Reports</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="h-full w-0.5 bg-blue-200" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {log.action.split('_').join(' ').charAt(0).toUpperCase() + log.action.split('_').join(' ').slice(1)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {log.performedBy}
                    </div>
                  </div>
                  <p className="text-sm">
                    {log.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-muted-foreground">
                {searchTerm || actionFilter !== 'all' ? 
                  "No logs match your search criteria" : 
                  "No audit logs available"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
