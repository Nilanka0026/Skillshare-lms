export function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {columns.map((column) => <th key={column} className="px-5 py-4 font-black">{column}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.join('-')} className="hover:bg-gray-50">
              {row.map((cell) => <td key={cell} className="px-5 py-4 text-gray-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
