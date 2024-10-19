import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import ExportButton from "@/components/ExportButton";
import { Button } from "@/components/ui/button";

const History = () => {
  const columns = [
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return (
          <div
            className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
              "bg-red-200": row.getValue("category") === "Groceries",
              "bg-orange-200": row.getValue("category") === "Food",
              "bg-green-200": row.getValue("category") === "Medicine",
            })}
          >
            {row.getValue("category")}
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
      category: "Groceries",
      lastOrder: "2023-01-15",
      method: "Credit Card",
    },
    {
      order: "ORD002",
      category: "Food",
      lastOrder: "2023-02-20",
      method: "PayPal",
    },
    {
      order: "ORD003",
      category: "Medicine",
      lastOrder: "2023-03-10",
      method: "Stripe",
    },
    {
      order: "ORD004",
      category: "Groceries",
      lastOrder: "2023-04-05",
      method: "Venmo",
    },
    {
      order: "ORD005",
      category: "Medicine",
      lastOrder: "2023-05-12",
      method: "Bank Transfer",
    },
    {
      order: "ORD006",
      category: "Food",
      lastOrder: "2023-06-18",
      method: "Apple Pay",
    },
    {
      order: "ORD007",
      category: "Medicine",
      lastOrder: "2023-07-22",
      method: "Google Pay",
    },
    {
      order: "ORD008",
      category: "Groceries",
      lastOrder: "2023-08-30",
      method: "Cryptocurrency",
    },
    {
      order: "ORD009",
      category: "Food",
      lastOrder: "2023-09-05",
      method: "Alipay",
    },
    {
      order: "ORD010",
      category: "Medicine",
      lastOrder: "2023-10-18",
      method: "WeChat Pay",
    },
    {
      order: "ORD011",
      category: "Groceries",
      lastOrder: "2023-11-25",
      method: "Square Cash",
    },
  ];

  const [filters, setFilters] = useState({
    category: "all",
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
    const categoryMatch =
      filters.category === "all" ||
      row.category.toLowerCase() === filters.category.toLowerCase();
    const dateMatch = !filters.date || row.lastOrder === filters.date;

    return categoryMatch && dateMatch && dataSearch;
  });

  const getExportedData = useMemo(() => {
    return filteredData.map((row) => ({
      Order: row.order,
      category: row.category,
      LastOrder: row.lastOrder,
      Method: row.method,
    }));
  }, [filteredData]);

  return (
    <div>
      <div className="w-full flex items-center my-5 gap-5">
        <Input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          type="text"
          placeholder="Search..."
          className="w-fit"
        />
        <Input
          type="date"
          name="date"
          onChange={handleFilterChange}
          value={filters.date}
          placeholder="Filter by date"
          className="w-fit"
        />
        <select
          name="category"
          className="w-fit"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="groceries">Groceries</option>
          <option value="food">Food</option>
          <option value="medicine">Medicine</option>
        </select>

        <Button disabled={!filteredData.length} onClick={() => setFilters({ category: "all", date: "", search: "" })}>Clear Filter</Button>

        <ExportButton filename="orders" data={getExportedData} />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default History;
