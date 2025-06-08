
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  Building2, 
  Filter, 
  RefreshCw,
  Download 
} from 'lucide-react';

interface AnalyticsFiltersProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
}

export const AnalyticsFilters = ({ 
  dateRange, 
  setDateRange, 
  selectedDepartment, 
  setSelectedDepartment 
}: AnalyticsFiltersProps) => {
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'icu', label: 'ICU' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'laboratory', label: 'Laboratory' }
  ];

  const handleRefresh = () => {
    console.log('Refreshing analytics data...');
    // Implementation would refresh the data
  };

  const getSelectedDateLabel = () => {
    const option = dateRangeOptions.find(opt => opt.value === dateRange);
    return option?.label || 'Last 30 Days';
  };

  const getSelectedDeptLabel = () => {
    const option = departmentOptions.find(opt => opt.value === selectedDepartment);
    return option?.label || 'All Departments';
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-500" />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {getSelectedDateLabel()}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {getSelectedDeptLabel()}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
