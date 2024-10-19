import Bill from "../assets/Bill.jpg";

const jsonData = {
  menu: [
    { nm: "Seawood KisanKonnect Store", cnt: "6", price: "CHS Limit" },
    {
      nm: "Seawoods, Navi Mamabi, Maharashtra",
      unitprice: "6890",
      cnt: "6",
      price: "Karave Nagar",
    },
    {
      nm: "GSTIN : 27AAICK0704C12",
      unitprice: "27AIC0706",
      cnt: "6",
      price: "27",
    },
    {
      nm: "TAX INVOICE CUM BILL OF SUPPLY",
      unitprice: "889958",
      cnt: "811",
      price: "889758",
    },
    { nm: { cnt: "10: 54: 26" }, cnt: "1", price: "Total" },
    { nm: "Flg - 6 DCS(1 Nos", unitprice: "40.0", cnt: "1", price: "40" },
    { nm: ")", unitprice: "0.27", cnt: "2.", price: "80.0" },
    {
      nm: "3.cucumber Green(Kakadi-H",
      unitprice: "0.63",
      cnt: "1",
      price: "52.0",
    },
  ],
  sub_total: { subtotal_price: "52.0", tax_price: "32.76" },
  total: {
    total_price: "595.0",
    cnt: "3",
    price: {
      unitprice: "0",
      cnt: "1",
      nm: "Please return them to the store with invoice",
    },
  },
};

const Settings = () => {
  return (
    <div className="flex items-start gap-x-10 p-5">
      <div className="">
        <img src={Bill} alt="Bill" className="w-full h-auto" />
      </div>
      <div className="flex flex-col  bg-gray-100 p-5 rounded-lg shadow-md">
        <h1 className="text-xl text-center font-semibold mb-4">JSON Data</h1>
        <pre className="bg-gray-900 text-white p-4 rounded-lg h-[600px] overflow-y-scroll">
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Settings;
