import {
  ArrowUpDown,
  FileQuestion as FileQuestionMark,
  Edit,
  Trash2,
} from "lucide-react";

import { createContext, useContext, useMemo } from "react";
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

const DataTableContext = createContext();

function useDataTable() {
  const ctx = useContext(DataTableContext);
  if (!ctx)
    throw new Error("DataTable components must be used inside <DataTable>");
  return ctx;
}

function DataTable({
  data = [],
  filters,
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  noItem,
  children,
}) {
  const columns = useMemo(() => {
    return children.filter(
      (child) => child.type.displayName === "DataTableColumn"
    );
  }, [children]);

  return (
    <DataTableContext.Provider
      value={{
        data,
        filters,
        onSort,
        onRowClick,
        onEdit,
        onDelete,
        noItem,
        columns,
      }}
    >
      <div className="rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <Header />
          <Body />
        </Table>
      </div>
    </DataTableContext.Provider>
  );
}

function Header() {
  const { columns, filters, onSort } = useDataTable();

  return (
    <TableHeader>
      <TableRow className="bg-muted dark:bg-card border-b border-border">
        {columns.map((col, index) => {
          const isFirst = index === 0;
          const isLast = index === columns.length - 1;
          const sortable = col.props.sort;
          const accessor = col.props.accessor || col.props.key;

          return (
            <TableHead
              key={accessor}
              className={cn(
                "text-foreground font-medium text-sm py-4",
                isFirst && "pl-6",
                isLast && "pr-6 text-right"
              )}
            >
              {sortable ? (
                <Button
                  variant={filters?.sort_by === accessor ? "default" : "ghost"}
                  className={cn(
                    "cursor-pointer h-auto p-2 font-medium hover:text-card hover:bg-accent dark:hover:bg-accent",
                    filters?.sort_by === accessor && "text-primary-foreground"
                  )}
                  onClick={() => onSort?.(accessor)}
                >
                  {col.props.label}
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <span>{col.props.label}</span>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

function Body() {
  const { data, columns, onRowClick, onEdit, onDelete, noItem } =
    useDataTable();

  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="text-center py-12 px-6"
          >
            <div className="flex flex-col gap-4">
              <FileQuestionMark
                className="max-w-60 m-auto text-muted-foreground"
                size={60}
              />
              <div>
                <h1 className="font-bold text-sm text-muted-foreground">
                  No {noItem} Found.
                </h1>
                <p className="font-light text-sm text-muted-foreground">
                  Add {noItem} or try searching with different keyword
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((item, rowIndex) => (
        <TableRow
          key={item.id || rowIndex}
          className="group relative bg-card text-foreground hover:text-background hover:bg-accent cursor-pointer border-b border-muted last:border-b-0"
          onClick={() => onRowClick?.(item)}
        >
          {columns.map((col, index) => {
            const isFirst = index === 0;
            const isLast = index === columns.length - 1;
            const accessor = col.props.accessor || col.props.key;
            const value = item[accessor];

            return (
              <TableCell
                key={accessor}
                className={cn(
                  "py-4 text-sm  max-w-[200px] truncate",
                  isFirst && "pl-6 font-medium",
                  isLast && "pr-6 text-right"
                )}
              >
                <span title={value} className="block truncate">
                  {renderCell(col.props, value, item, onEdit, onDelete)}
                </span>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

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
    return value ? formatDate(value) : "-";
  }

  return value ?? "-";
}

function DataTableColumn() {
  return null;
}

DataTableColumn.displayName = "DataTableColumn";

DataTable.Column = DataTableColumn;

export default DataTable;
