// eslint-disable-next-line react/prop-types
const CardComponent = ({ label, icon: Icon, amt, desc }) => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow">
      <section className="flex justify-between gap-2">
        <p className="text-sm">{label}</p>
        {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
      </section>
      <section className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">{amt}</h2>
        <p className="text-xs text-gray-500">{desc}</p>
      </section>
    </div>
  );
};

export default CardComponent;
