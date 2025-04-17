
import React, { useState, useEffect } from 'react';
import { getAllCases, getAllInvestigators } from '../../utils/caseManagement';
import { Case, User } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BarChart, Briefcase, FileSpreadsheet, Users, AlertTriangle, Activity, Folder } from 'lucide-react';
import { logoutUser } from '../../utils/authentication';
import { useNavigate } from 'react-router-dom';
import CaseList from './CaseList';
import InvestigatorList from './InvestigatorList';
import CreateCaseForm from './CreateCaseForm';
import ReportList from './ReportList';
import AuditLogViewer from '../common/AuditLogViewer';

const AdminDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [investigators, setInvestigators] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateCase, setShowCreateCase] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cases and investigators
    const loadData = () => {
      const allCases = getAllCases();
      const allInvestigators = getAllInvestigators();
      
      setCases(allCases);
      setInvestigators(allInvestigators);
    };
    
    loadData();
    
    // Set up interval to refresh data (every 30 seconds)
    const intervalId = setInterval(loadData, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleCaseCreated = (newCase: Case) => {
    setCases([...cases, newCase]);
    setShowCreateCase(false);
  };

  // Calculate statistics
  const openCases = cases.filter(c => c.status === 'open').length;
  const inProgressCases = cases.filter(c => c.status === 'in-progress').length;
  const closedCases = cases.filter(c => c.status === 'closed').length;
  const highPriorityCases = cases.filter(c => c.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <h1 className="text-2xl font-bold">DigiForensics Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-white border-white hover:bg-blue-700">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="bg-blue-50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="cases" className="data-[state=active]:bg-white">
                <Folder className="h-4 w-4 mr-2" />
                Cases
              </TabsTrigger>
              <TabsTrigger value="investigators" className="data-[state=active]:bg-white">
                <Users className="h-4 w-4 mr-2" />
                Investigators
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-white">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-white">
                <BarChart className="h-4 w-4 mr-2" />
                Audit Logs
              </TabsTrigger>
            </TabsList>

            {activeTab === 'cases' && (
              <Button onClick={() => setShowCreateCase(true)}>
                Create New Case
              </Button>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                  <Folder className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cases.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {openCases} open, {inProgressCases} in progress, {closedCases} closed
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investigators</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investigators.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active personnel accounts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highPriorityCases}</div>
                  <p className="text-xs text-muted-foreground">
                    Cases requiring immediate attention
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Case Completion</CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cases.length ? Math.round((closedCases / cases.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {closedCases} of {cases.length} cases completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>Latest cases added to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  {cases.length > 0 ? (
                    <div className="space-y-2">
                      {cases.slice(0, 5).map(caseItem => (
                        <div key={caseItem.id} className="flex justify-between items-center p-2 border-b">
                          <div>
                            <p className="font-medium">{caseItem.title}</p>
                            <p className="text-sm text-muted-foreground">Priority: {caseItem.priority}</p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              caseItem.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              caseItem.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {caseItem.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No cases available</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Notifications</CardTitle>
                  <CardDescription>Important updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertTitle className="text-blue-800">System Update</AlertTitle>
                    <AlertDescription>
                      Evidence encryption protocol updated to AES-256.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="mb-4">
                    <AlertTitle className="text-blue-800">New Feature</AlertTitle>
                    <AlertDescription>
                      QR code generation is now available for all evidence items.
                    </AlertDescription>
                  </Alert>
                  
                  {highPriorityCases > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertTitle>Attention Required</AlertTitle>
                      <AlertDescription>
                        There are {highPriorityCases} high priority cases requiring attention.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases">
            {showCreateCase ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Case</CardTitle>
                  <CardDescription>Enter the details for the new forensic case</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateCaseForm 
                    onCaseCreated={handleCaseCreated}
                    onCancel={() => setShowCreateCase(false)}
                    investigators={investigators}
                  />
                </CardContent>
              </Card>
            ) : (
              <CaseList cases={cases} investigators={investigators} onCaseUpdated={(updatedCase) => {
                setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
              }} />
            )}
          </TabsContent>

          {/* Investigators Tab */}
          <TabsContent value="investigators">
            <InvestigatorList investigators={investigators} onRefresh={() => {
              setInvestigators(getAllInvestigators());
            }} />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportList />
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit">
            <AuditLogViewer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
