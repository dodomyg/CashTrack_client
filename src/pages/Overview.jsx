import BarChart from "@/components/BarChart";
import CardComponent from "@/components/CardComponent";
import Transactions from "@/components/Transactions";
import { Activity, CreditCard, IndianRupee, Users } from "lucide-react";
const Overview = () => {
  const cardData = [
    {
      label: "Total Expenditure",
      amt: "₹45,231.89",
      desc: "+20.1% from last month",
      icon: IndianRupee,
    },
    {
      label: "Groceries",
      amt: "₹2350",
      desc: "+180.1% from last month",
      icon: Users,
    },
    {
      label: "Rent",
      amt: "₹12,234",
      desc: "+19% from last month",
      icon: CreditCard,
    },
    {
      label: "Miscellaneous",
      amt: "₹300",
      icon: Activity,
    },
  ];

  const transactionData = [
    {
      name: "Olivia Martin",
      category: "Groceries",
      transactionAmt: "₹1999.00",
    },
    {
      name: "Jackson Lee",
      category: "Medicine",
      transactionAmt: "₹1,999.00",
    },
    {
      name: "Isabella Nguyen",
      category: "Food",
      transactionAmt: "₹39.00",
    },
    {
      name: "William Kim",
      category: "Groceries",
      transactionAmt: "₹299.00",
    },
    {
      name: "Sofia Davis",
      category: "Food",
      transactionAmt: "₹39.00",
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Cards Section */}
      <section className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-x-8">
        {cardData.map((d, i) => (
          <CardComponent
            key={i}
            amt={d.amt}
            desc={d.desc}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>

      {/* Overview and Transactions Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overview with BarChart */}
        <div className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow">
          <p className="p-4 font-semibold">Overview</p>
          <div className="w-full h-96">
            <BarChart />
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow">
          <div className="mb-4">
            <p className="font-semibold">Recent Transactions</p>
            <p className="text-sm text-gray-400">
              You made 16 transactions this month.
            </p>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto max-h-96">
            {transactionData.map((d, i) => (
              <Transactions
                key={i}
                category={d.category}
                name={d.name}
                transactionAmt={d.transactionAmt}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
