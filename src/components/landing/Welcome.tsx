
import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, FileText, Database, Search, AlertTriangle } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">DigiForensics</h1>
          </div>
          <div className="space-x-2">
            <div className="dropdown inline-block relative">
              <Button variant="outline" className="text-white border-white hover:bg-blue-700">
                Login
              </Button>
              <div className="dropdown-content hidden absolute right-0 mt-1 bg-white rounded-md shadow-lg w-48 z-10 hover:block group-hover:block">
                <a href="/admin/login" className="block px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-t-md">Admin Login</a>
                <a href="/investigator/login" className="block px-4 py-2 text-gray-800 hover:bg-blue-100 rounded-b-md">Investigator Login</a>
              </div>
            </div>
            <Button className="bg-white text-blue-900 hover:bg-blue-100" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Secure Digital Evidence Management</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          A comprehensive platform for managing digital forensic evidence with encryption, chain of custody tracking, and collaborative investigation tools.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" className="bg-red-700 hover:bg-red-800 mb-2 sm:mb-0" onClick={() => navigate('/admin/login')}>
            Admin Login
          </Button>
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800 mb-2 sm:mb-0" onClick={() => navigate('/investigator/login')}>
            Investigator Login
          </Button>
          <Button size="lg" variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">AES-256 Encryption</h4>
              <p className="text-gray-600">
                Military-grade encryption to protect sensitive case data and evidence files.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">Chain of Custody</h4>
              <p className="text-gray-600">
                Comprehensive audit logs to maintain evidence integrity for legal compliance.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">QR Code Access</h4>
              <p className="text-gray-600">
                Quick access to evidence and reports using secure QR code generation.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">Role-Based Access</h4>
              <p className="text-gray-600">
                Separate admin and investigator portals with specific permissions.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">AI-Powered Summaries</h4>
              <p className="text-gray-600">
                Automated summarization of investigative reports for quick review.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-14 h-14 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-700" />
              </div>
              <h4 className="text-xl font-bold mb-2">Case Prioritization</h4>
              <p className="text-gray-600">
                Efficient case management with priority levels and status tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Secure Your Digital Evidence?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join DigiForensics today and experience a comprehensive solution for managing digital forensic evidence with the highest levels of security and compliance.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-white text-red-700 hover:bg-red-100 mb-2 sm:mb-0" onClick={() => navigate('/admin/login')}>
              Admin Access
            </Button>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-100 mb-2 sm:mb-0" onClick={() => navigate('/investigator/login')}>
              Investigator Access
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-bold">DigiForensics</h2>
          </div>
          <p className="text-blue-200 mb-4">Secure Digital Evidence Management Platform</p>
          <p className="text-blue-300 text-sm">&copy; {new Date().getFullYear()} DigiForensics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
