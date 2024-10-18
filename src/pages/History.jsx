import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const History = () => {
  const columns = [
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div
            className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
              "bg-red-200": row.getValue("status") === "Pending",
              "bg-orange-200": row.getValue("status") === "Processing",
              "bg-green-200": row.getValue("status") === "Completed",
            })}
          >
            {row.getValue("status")}
          </div>
        );
      },
    },
    {
      accessorKey: "lastOrder",
      header: "Last Order",
    },
    {
      accessorKey: "method",
      header: "Method",
    },
  ];

  const data = [
    {
      order: "ORD001",
      status: "Pending",
      lastOrder: "2023-01-15",
      method: "Credit Card",
    },
    {
      order: "ORD002",
      status: "Processing",
      lastOrder: "2023-02-20",
      method: "PayPal",
    },
    {
      order: "ORD003",
      status: "Completed",
      lastOrder: "2023-03-10",
      method: "Stripe",
    },
    {
      order: "ORD004",
      status: "Pending",
      lastOrder: "2023-04-05",
      method: "Venmo",
    },
    {
      order: "ORD005",
      status: "Completed",
      lastOrder: "2023-05-12",
      method: "Bank Transfer",
    },
    {
      order: "ORD006",
      status: "Processing",
      lastOrder: "2023-06-18",
      method: "Apple Pay",
    },
    {
      order: "ORD007",
      status: "Completed",
      lastOrder: "2023-07-22",
      method: "Google Pay",
    },
    {
      order: "ORD008",
      status: "Pending",
      lastOrder: "2023-08-30",
      method: "Cryptocurrency",
    },
    {
      order: "ORD009",
      status: "Processing",
      lastOrder: "2023-09-05",
      method: "Alipay",
    },
    {
      order: "ORD010",
      status: "Completed",
      lastOrder: "2023-10-18",
      method: "WeChat Pay",
    },
    {
      order: "ORD011",
      status: "Pending",
      lastOrder: "2023-11-25",
      method: "Square Cash",
    },
    {
      order: "ORD012",
      status: "Completed",
      lastOrder: "2023-12-08",
      method: "Zelle",
    },
    {
      order: "ORD013",
      status: "Processing",
      lastOrder: "2024-01-15",
      method: "Stripe",
    },
    {
      order: "ORD014",
      status: "Completed",
      lastOrder: "2024-02-20",
      method: "PayPal",
    },
    {
      order: "ORD015",
      status: "Pending",
      lastOrder: "2024-03-30",
      method: "Credit Card",
    },
    
  ];

  const [filters, setFilters] = useState({
    status: "all",
    date: "",
    search: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const filteredData = data.filter((row) => {
    const dataSearch = row.order
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const statusMatch =
      filters.status === "all" || row.status.toLowerCase() === filters.status;

    const dateMatch = !filters.date || row.lastOrder === filters.date;

    return statusMatch && dateMatch && dataSearch;
  });

  return (
    <div>
      <div className="w-full flex items-center my-5 gap-5">
        <Input name="search" value={filters.search} onChange={handleFilterChange} type="text" placeholder="Search..." className="w-fit" />
        <Input type="date" name="date" onChange={handleFilterChange} value={filters.date} placeholder="Filter by date" className="w-fit" />
        <select
          name="status"
          className="w-fit"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
        </select>
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default History;
