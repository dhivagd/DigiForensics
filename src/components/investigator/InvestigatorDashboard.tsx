
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { getCasesByInvestigator } from '../../utils/caseManagement';
import { Case, Evidence, Report } from '../../types';
import { getCurrentUser, logoutUser } from '../../utils/authentication';
import { useNavigate } from 'react-router-dom';
import { loadData } from '../../utils/fileStorage';
import { Briefcase, FileText, Upload, Activity } from 'lucide-react';
import CaseList from './CaseList';
import EvidenceUpload from './EvidenceUpload';
import ReportSubmission from './ReportSubmission';
import MyActivity from './MyActivity';

const InvestigatorDashboard: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const loadCases = () => {
      const assignedCases = getCasesByInvestigator(currentUser.id);
      setCases(assignedCases);
    };
    
    loadCases();
    
    // Set up interval to refresh data (every 30 seconds)
    const intervalId = setInterval(loadCases, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentUser, navigate]);
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };
  
  // Get statistics for the current user
  const getStatistics = () => {
    const allEvidences = loadData('evidences') || [];
    const allReports = loadData('reports') || [];
    
    const openCases = cases.filter(c => c.status === 'open').length;
    const inProgressCases = cases.filter(c => c.status === 'in-progress').length;
    const closedCases = cases.filter(c => c.status === 'closed').length;
    const highPriorityCases = cases.filter(c => c.priority === 'high').length;
    const uploadedEvidences = allEvidences.filter((e: Evidence) => e.uploadedBy === currentUser?.username).length;
    const submittedReports = allReports.filter((r: Report) => r.submittedBy === currentUser?.username).length;
    
    return {
      openCases,
      inProgressCases,
      closedCases,
      highPriorityCases,
      uploadedEvidences,
      submittedReports
    };
  };
  
  const stats = getStatistics();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <h1 className="text-2xl font-bold">DigiForensics Investigator Portal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-100">
              {currentUser?.name || currentUser?.username}
            </span>
            <Button variant="outline" onClick={handleLogout} className="text-white border-white hover:bg-blue-700">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
              <p className="text-xs text-muted-foreground">
                {stats.openCases} open, {stats.inProgressCases} in progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
              <Upload className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uploadedEvidences}</div>
              <p className="text-xs text-muted-foreground">
                Files uploaded to assigned cases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submittedReports}</div>
              <p className="text-xs text-muted-foreground">
                Investigation reports submitted
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Activity className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriorityCases}</div>
              <p className="text-xs text-muted-foreground">
                Cases requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-blue-50">
            <TabsTrigger value="cases" className="data-[state=active]:bg-white">
              <Briefcase className="h-4 w-4 mr-2" />
              My Cases
            </TabsTrigger>
            <TabsTrigger value="evidence" className="data-[state=active]:bg-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Evidence
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Submit Report
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white">
              <Activity className="h-4 w-4 mr-2" />
              My Activity
            </TabsTrigger>
          </TabsList>

          {/* Cases Tab */}
          <TabsContent value="cases">
            <CaseList 
              cases={cases} 
              onCaseSelected={(caseItem) => {
                setSelectedCase(caseItem);
                setActiveTab('evidence');
              }} 
            />
          </TabsContent>

          {/* Evidence Upload Tab */}
          <TabsContent value="evidence">
            <EvidenceUpload 
              cases={cases} 
              selectedCase={selectedCase} 
              onCaseSelect={setSelectedCase}
            />
          </TabsContent>

          {/* Report Submission Tab */}
          <TabsContent value="report">
            <ReportSubmission 
              cases={cases} 
              selectedCase={selectedCase}
              onCaseSelect={setSelectedCase}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <MyActivity />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InvestigatorDashboard;
