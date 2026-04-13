import React, { useState, useMemo, useDeferredValue } from 'react';
import { Card, CardContent, CardHeader } from './card';
import { Input } from './input';
import { Button } from './button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  emptyState?: React.ReactNode;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  showPagination?: boolean;
  rowProps?: (row: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function DataTable<T = any>({
  data,
  columns,
  onSort,
  sortKey,
  sortDirection,
  emptyState,
  className,
  searchable = false,
  searchPlaceholder = "Search...",
  pageSize = 10,
  showPagination = false,
  rowProps
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const getSortIcon = (field: string) => {
      if (sortKey !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
      return sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
  };

  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredData = useMemo(() => {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    if (!searchable || !deferredSearchTerm) return safeData;
    return safeData.filter((row: any) => 
      columns.some(column => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(deferredSearchTerm.toLowerCase());
      })
    );
  }, [data, deferredSearchTerm, columns, searchable]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-sm", className)}>
      {searchable && (
        <div className="p-4 border-b border-border/50 bg-card">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 vercel-input"
            />
          </div>
        </div>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-xs font-medium text-muted-foreground bg-transparent h-10",
                    column.sortable ? 'cursor-pointer select-none hover:text-foreground transition-colors' : '',
                    column.className || ''
                  )}
                  onClick={() => handleSort(column.key, column.sortable)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow 
                  key={(row as any).id || index}
                  className="border-b border-border/50 transition-colors hover:bg-muted/40"
                  {...(rowProps ? rowProps(row, index) : {})}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("text-sm py-3", column.className)}>
                      {column.render
                        ? column.render((row as any)[column.key], row, index)
                        : (row as any)[column.key] || '-'
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ? 'No results found' : 'No data available'}
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="text-[13px] text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span key={`ellipsis-${page}`} className="px-1 text-muted-foreground text-xs">…</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-7 h-7 p-0 text-xs"
                  >
                    {page}
                  </Button>
                </React.Fragment>
              ))
            }
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 px-2"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}