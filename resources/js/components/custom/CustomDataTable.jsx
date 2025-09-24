import {
  ArrowUpDown,
  FileQuestion as FileQuestionMark,
  Edit,
  Trash2,
} from "lucide-react";

import { formatDate, cn } from "../lib/utils";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

function renderCell(column, value, item, onEdit, onDelete) {
  if (column.type === "badge") {
    const badgeClasses = {
      selesai:
        "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium",
      "on process":
        "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium",
      completed:
        "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium",
      pending:
        "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium",
      active:
        "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium",
      inactive:
        "bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium",
    };

    const className =
      badgeClasses[value?.toLowerCase()] || badgeClasses.pending;

    return <span className={className}>{value}</span>;
  }

  if (column.type === "actions") {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(item);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(item);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (column.type === "time") {
    return formatDate(value);
  }

  return value ?? "-";
}

function CustomDataTable({
  columns = [],
  data = [],
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  filters,
  noItem,
}) {
  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              {columns.map((column, index) => {
                const isFirst = index === 0;
                const isLast = index === columns.length - 1;

                return (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "text-gray-700 font-medium text-sm py-4",
                      isFirst && "pl-6",
                      isLast && "pr-6 text-right"
                    )}
                  >
                    {column.sort ? (
                      <Button
                        size="sm"
                        variant={
                          filters?.sort_by === column.key ? "default" : "ghost"
                        }
                        className={cn(
                          "cursor-pointer h-auto p-0 font-medium",
                          filters?.sort_by === column.key && "text-primary"
                        )}
                        onClick={() => onSort(column.key)}
                      >
                        {column.label}
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <span>{column.label}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <TableRow
                  key={item.id || rowIndex}
                  className="group relative hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, index) => {
                    const isFirst = index === 0;
                    const isLast = index === columns.length - 1;

                    return (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "py-4 text-sm text-gray-900 max-w-[200px] truncate", 
                          isFirst && "pl-6 font-medium",
                          isLast && "pr-6 text-right"
                        )}
                      >
                        <span
                          title={item[column.key]}
                          className="block truncate"
                        >
                          {renderCell(
                            column,
                            item[column.key],
                            item,
                            onEdit,
                            onDelete
                          )}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-12 px-6"
                >
                  <div className="flex flex-col gap-4">
                    <FileQuestionMark
                      className="max-w-60 m-auto text-gray-400"
                      size={120}
                    />
                    <div>
                      <h1 className="font-bold text-sm text-gray-900">
                        No {noItem} Found.
                      </h1>
                      <p className="font-light text-sm text-gray-500">
                        Add {noItem} or try searching with different keyword
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default CustomDataTable;
