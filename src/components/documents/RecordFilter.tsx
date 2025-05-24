
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Calendar as CalendarIcon, Search, X, FileText, Image, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';

interface MedicalRecord {
  id: string;
  title: string;
  type: 'lab_result' | 'imaging' | 'diagnosis' | 'prescription' | 'visit_note';
  doctor: string;
  facility: string;
  date: Date;
  source: 'hospital' | 'clinic' | 'lab' | 'pharmacy' | 'upload';
  tags: string[];
  fileType: 'pdf' | 'image' | 'document';
}

const sampleRecords: MedicalRecord[] = [
  {
    id: '1',
    title: 'Complete Blood Count',
    type: 'lab_result',
    doctor: 'Dr. Smith',
    facility: 'Central Lab',
    date: new Date('2024-01-15'),
    source: 'lab',
    tags: ['blood work', 'routine'],
    fileType: 'pdf'
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    type: 'imaging',
    doctor: 'Dr. Johnson',
    facility: 'Radiology Dept',
    date: new Date('2024-01-10'),
    source: 'hospital',
    tags: ['chest', 'routine'],
    fileType: 'image'
  },
  {
    id: '3',
    title: 'Hypertension Diagnosis',
    type: 'diagnosis',
    doctor: 'Dr. Wilson',
    facility: 'Family Clinic',
    date: new Date('2024-01-05'),
    source: 'clinic',
    tags: ['hypertension', 'chronic'],
    fileType: 'document'
  },
  {
    id: '4',
    title: 'Prescription - Lisinopril',
    type: 'prescription',
    doctor: 'Dr. Wilson',
    facility: 'Family Clinic',
    date: new Date('2024-01-05'),
    source: 'pharmacy',
    tags: ['blood pressure', 'medication'],
    fileType: 'pdf'
  }
];

export const RecordFilter = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(sampleRecords);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>(sampleRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique values for filters
  const doctors = Array.from(new Set(records.map(r => r.doctor)));
  const sources = Array.from(new Set(records.map(r => r.source)));
  const allTags = Array.from(new Set(records.flatMap(r => r.tags)));

  const applyFilters = () => {
    let filtered = records;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(record => record.type === selectedType);
    }

    // Doctor filter
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(record => record.doctor === selectedDoctor);
    }

    // Source filter
    if (selectedSource !== 'all') {
      filtered = filtered.filter(record => record.source === selectedSource);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(record => record.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(record => record.date <= dateTo);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(record =>
        selectedTags.some(tag => record.tags.includes(tag))
      );
    }

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDoctor('all');
    setSelectedSource('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedTags([]);
    setFilteredRecords(records);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab_result': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'imaging': return <Image className="h-4 w-4 text-green-500" />;
      case 'diagnosis': return <Stethoscope className="h-4 w-4 text-red-500" />;
      case 'prescription': return <FileText className="h-4 w-4 text-purple-500" />;
      case 'visit_note': return <FileText className="h-4 w-4 text-orange-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'hospital': return 'bg-red-100 text-red-800';
      case 'clinic': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'pharmacy': return 'bg-purple-100 text-purple-800';
      case 'upload': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedType, selectedDoctor, selectedSource, dateFrom, dateTo, selectedTags]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Medical Records Filter
          </CardTitle>
          <CardDescription>
            Search and filter medical records by source, doctor, date, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search records, doctors, facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="lab_result">Lab Results</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="visit_note">Visit Notes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              Showing {filteredRecords.length} of {records.length} records
            </span>
            {(searchTerm || selectedType !== 'all' || selectedDoctor !== 'all' || 
              selectedSource !== 'all' || dateFrom || dateTo || selectedTags.length > 0) && (
              <Badge variant="secondary">Filters Active</Badge>
            )}
          </div>

          {/* Results Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(record.type)}
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {record.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell>{record.facility}</TableCell>
                    <TableCell>{record.date.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getSourceColor(record.source)}>
                        {record.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {record.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
