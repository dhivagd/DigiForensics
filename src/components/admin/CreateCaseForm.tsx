
import React, { useState } from 'react';
import { createCase } from '../../utils/caseManagement';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Case } from '../../types';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface CreateCaseFormProps {
  onCaseCreated: (newCase: Case) => void;
  onCancel: () => void;
  investigators: User[];
}

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ onCaseCreated, onCancel, investigators }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Case['priority'],
    status: 'open' as Case['status']
  });
  const [selectedInvestigators, setSelectedInvestigators] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
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
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const newCase = createCase({
        ...formData,
        assignedTo: selectedInvestigators
      });
      
      onCaseCreated(newCase);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the case');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="title">Case Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter case title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter case description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value) => handleSelectChange('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="status">Initial Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
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
      
      <div className="grid gap-2">
        <Label>Assign Investigators (Optional)</Label>
        <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
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
            <p className="text-sm text-muted-foreground">No investigators available</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Case'}
        </Button>
      </div>
    </form>
  );
};

export default CreateCaseForm;
