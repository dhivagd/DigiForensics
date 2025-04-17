
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { loadData } from '../../utils/fileStorage';
import { AuditLog } from '../../types';
import { getCurrentUser } from '../../utils/authentication';
import { format } from 'date-fns';
import { Activity, FileUp, FileText } from 'lucide-react';

const MyActivity: React.FC = () => {
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (!currentUser) return;
    
    const loadActivities = () => {
      const allLogs = loadData('auditLogs') || [];
      const userLogs = allLogs.filter((log: AuditLog) => log.performedBy === currentUser.username);
      setActivities(userLogs.sort((a: AuditLog, b: AuditLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };
    
    loadActivities();
  }, [currentUser]);
  
  const getActivityIcon = (action: string) => {
    if (action.includes('evidence')) return <FileUp className="h-5 w-5 text-blue-500" />;
    if (action.includes('report')) return <FileText className="h-5 w-5 text-green-500" />;
    return <Activity className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Activity Log</CardTitle>
        <CardDescription>Track your recent actions and contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length > 0 ? (
            activities.slice(0, 20).map((activity) => (
              <div key={activity.id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="h-full w-0.5 bg-blue-200" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action.split('_').join(' ').charAt(0).toUpperCase() + activity.action.split('_').join(' ').slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-muted-foreground">No activities recorded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyActivity;
