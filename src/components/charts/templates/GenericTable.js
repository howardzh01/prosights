import React from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

// function GenericTable({
//   chartData,
//   title = undefined,
//   showDataLabels = true,
//   showTimescaleButtons = true,
//   timescale,
//   setTimescale,
// }) {
//   // Expect chartData of same format as GenericBar
//   const tables = chartData["labels"].map((label, index) => {
//     const employeeCount = chartData.datasets[0].data[index];
//     return (
//       <table key={label} className="inline-block mr-4">
//         <thead>
//           <tr>
//             <th>{label}</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>{employeeCount}</td>
//           </tr>
//         </tbody>
//       </table>
//     );
//   });

//   return (
//     <div className="flex flex-col">
//       <div className="flex">
//         <table className="inline-block mr-4">
//           <thead>
//             {/* <tr>
//               <th> fill in space</th>
//             </tr> */}
//           </thead>
//           <tbody>
//             <tr>
//               <td>Employees</td>
//             </tr>
//           </tbody>
//         </table>
//         {tables}
//       </div>
//     </div>
//   );
// }

// export default GenericTable;
function GenericTable({
  chartData,
  title = undefined,
  showDataLabels = true,
  showTimescaleButtons = true,
  timescale,
  setTimescale,
}) {
  // Expect chartData of same format as GenericBar
  // TableCell.js
  const TableCell = ({ children, isHeader = false, colSpan = 1 }) => {
    const classes = "border px-4 py-2 text-center whitespace-nowrap";
    return isHeader ? (
      <th className={classes} colSpan={colSpan}>
        {children}
      </th>
    ) : (
      <td className={classes}>{children}</td>
    );
  };

  // TableRow.js
  const TableRow = ({ rowData, isHeader = false }) => (
    <tr>
      {rowData.map((cellData, index) => (
        <TableCell key={index} isHeader={isHeader} {...cellData}>
          {cellData.content}
        </TableCell>
      ))}
    </tr>
  );

  // TableHeader.js
  const TableHeader = ({ labels }) => (
    <thead>
      <TableRow
        isHeader
        rowData={[
          { content: "Metric", colSpan: 1 },
          ...labels.map((label) => ({ content: label, colSpan: 1 })),
        ]}
      />
    </thead>
  );

  const { labels, datasets } = chartData;
  console.log("datasets", datasets);
  return (
    <div className="overflow-x-auto w-full min-w-0">
      {/* <table className="">
        <TableHeader labels={labels} />
        <tbody>
          {datasets.map((dataset, index) => (
            <TableRow
              key={dataset.label}
              rowData={[
                { content: dataset.label },
                ...dataset.data.map((value) => ({ content: value })),
              ]}
            />
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default GenericTable;
