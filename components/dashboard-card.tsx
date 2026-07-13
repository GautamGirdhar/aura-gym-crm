interface Props {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-gray-500 text-sm mb-2">{title}</h2>

      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
