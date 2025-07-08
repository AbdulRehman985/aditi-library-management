'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Student } from '@/utils/mockData';

interface StudentTableProps {
  students: Student[];
  onUpdateFeeStatus?: (studentId: string, status: Student['feeStatus']) => void;
}

type SortField = 'name' | 'admissionDate' | 'feeAmount' | 'shift';
type SortDirection = 'asc' | 'desc';

export default function StudentTable({ students, onUpdateFeeStatus }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter and sort students
  const filteredAndSortedStudents = students
    .filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.phone.includes(searchTerm);
      const matchesShift = shiftFilter === 'all' || student.shift === shiftFilter;
      const matchesFeeStatus = feeStatusFilter === 'all' || student.feeStatus === feeStatusFilter;
      
      return matchesSearch && matchesShift && matchesFeeStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'admissionDate') {
        aValue = new Date(a.admissionDate).getTime();
        bValue = new Date(b.admissionDate).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFeeStatusBadge = (status: Student['feeStatus']) => {
    switch (status) {
      case 'Paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case 'Due':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Due</Badge>;
      case 'Overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Evening">Evening</SelectItem>
            <SelectItem value="Night">Night</SelectItem>
          </SelectContent>
        </Select>
        <Select value={feeStatusFilter} onValueChange={setFeeStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Due">Due</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Name</SortableHeader>
              <TableHead>Contact</TableHead>
              <SortableHeader field="shift">Shift</SortableHeader>
              <TableHead>Fee Status</TableHead>
              <SortableHeader field="feeAmount">Amount</SortableHeader>
              <TableHead>Locker</TableHead>
              <SortableHeader field="admissionDate">Admission Date</SortableHeader>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No students found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">ID: {student.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">{student.email}</p>
                      <p className="text-gray-500">{student.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.shift}</Badge>
                  </TableCell>
                  <TableCell>{getFeeStatusBadge(student.feeStatus)}</TableCell>
                  <TableCell className="font-medium">₹{student.feeAmount}</TableCell>
                  <TableCell>
                    {student.lockerNo ? (
                      <Badge variant="secondary">#{student.lockerNo}</Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(student.admissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Student
                        </DropdownMenuItem>
                        {onUpdateFeeStatus && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpdateFeeStatus(student.id, 'Paid')}
                              disabled={student.feeStatus === 'Paid'}
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateFeeStatus(student.id, 'Due')}
                              disabled={student.feeStatus === 'Due'}
                            >
                              Mark as Due
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateFeeStatus(student.id, 'Overdue')}
                              disabled={student.feeStatus === 'Overdue'}
                            >
                              Mark as Overdue
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {filteredAndSortedStudents.length} of {students.length} students
        </span>
      </div>
    </div>
  );
} 