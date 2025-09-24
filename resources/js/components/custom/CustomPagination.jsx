import React from "react"
import { router } from "@inertiajs/react"

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@components/ui/pagination"

import { Button } from "@components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip"

function generatePaginationItems(currentPage, totalPages) {
  const items = []
  const showEllipsis = totalPages > 7

  if (!showEllipsis) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      items.push(i)
    }
  } else {
    // Always show first page
    items.push(1)

    if (currentPage <= 4) {
      // Show pages 2, 3, 4, 5, ellipsis, last
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        items.push(i)
      }
      if (totalPages > 5) {
        items.push("ellipsis")
        items.push(totalPages)
      }
    } else if (currentPage >= totalPages - 3) {
      // Show 1, ellipsis, then last 4 pages
      items.push("ellipsis")
      for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // Show 1, ellipsis, current-1, current, current+1, ellipsis, last
      items.push("ellipsis")
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        items.push(i)
      }
      items.push("ellipsis")
      items.push(totalPages)
    }
  }

  return items
}

function CustomPagination({ data, onPaginationChange }) {
  const currentPage = data.current_page
  const totalPages = data.last_page
  const paginationItems = generatePaginationItems(currentPage, totalPages)

  const handlePageClick = (page, e) => {
    e.preventDefault()
    const url = data.links.find((link) => link.label === String(page))?.url
    if (url) {
      router.visit(url)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="border-border bg-white dark:bg-secondary">
              {data.from}-{data.to} of {data.total}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Showing records {data.from} to {data.to} of {data.total} total
            </p>
          </TooltipContent>
        </Tooltip>

        <Select defaultValue={String(data.per_page)} onValueChange={onPaginationChange}>
          <SelectTrigger className="w-[180px] cursor-pointer border-border transition-all hover:bg-secondary hover:text-white">
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent className="border-border">
            <SelectItem value="10" className="cursor-pointer">
              10
            </SelectItem>
            <SelectItem value="25" className="cursor-pointer">
              25
            </SelectItem>
            <SelectItem value="50" className="cursor-pointer">
              50
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Pagination className="justify-end items-center">
        <PaginationContent>
          {data.prev_page_url && (
            <PaginationItem className="bg-card shadow rounded-3xl">
              <PaginationPrevious
                href={data.prev_page_url}
                onClick={(e) => {
                  e.preventDefault()
                  router.visit(data.prev_page_url)
                }}
              />
            </PaginationItem>
          )}

          {paginationItems.map((item, index) => (
            <PaginationItem key={index} className="bg-card shadow rounded-3xl">
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item === currentPage}
                  onClick={(e) => handlePageClick(item, e)}
                  className="cursor-pointer"
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {data.next_page_url && (
            <PaginationItem className="bg-card shadow rounded-3xl">
              <PaginationNext
                href={data.next_page_url}
                onClick={(e) => {
                  e.preventDefault()
                  router.visit(data.next_page_url)
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default CustomPagination
