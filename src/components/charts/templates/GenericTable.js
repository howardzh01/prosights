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
  // const TableCell = ({
  //   children,
  //   isHeader = false,
  //   colSpan = 1,
  //   customClasses = "",
  // }) => {
  //   const baseClasses = "border px-4 py-2 text-center whitespace-nowrap";
  //   const classes = `${baseClasses} ${customClasses}`;
  //   return isHeader ? (
  //     <th colSpan={colSpan} className={classes}>
  //       {children}
  //     </th>
  //   ) : (
  //     <td className={classes}>{children}</td>
  //   );
  // };

  // TableRow.js
  // const TableRow = ({ rowData, isHeader = false }) => (
  //   <tr>
  //     {rowData.map((cellData, index) => (
  //       <TableCell key={index} isHeader={isHeader} {...cellData}>
  //         {cellData.content}
  //       </TableCell>
  //     ))}
  //   </tr>
  // );

  // TableHeader.js
  // const TableHeader = ({ labels }) => (
  //   <thead>
  //     <TableRow
  //       isHeader
  //       rowData={[
  //         { content: "Metric", colSpan: 1 },
  //         ...labels.map((label) => ({ content: label, colSpan: 1 })),
  //       ]}
  //     />
  //   </thead>
  // );

  const { headers, labels, datasets } = chartData;
  // console.log("datasets, labels, headers", datasets, labels, headers);

  // Prepare header spans
  let headerSpans = {};
  if (headers) {
    headerSpans = headers.reduce((spans, header) => {
      spans[header] = (spans[header] || 0) + 1;
      return spans;
    }, {});
  }

  // console.log("headerSpans", headerSpans);

  return (
    <div className="overflow-x-auto mt-4">
      <table className="divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-sm font-medium text-gray-500 tracking-wider text-center"></th>{" "}
            {/* Empty header for shifting the row */}
            {[...new Set(headers)].map((header, index) => (
              <th
                key={index}
                colSpan={headerSpans[header]}
                className={`text-xs font-normal text-gray-500 tracking-wider text-center`}
              >
                <div className="inline-block bg-customGray-50 rounded-md w-11/12 py-1">
                  {header}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <td className="px-6 text-sm font-medium text-gray-500 tracking-wider text-left"></td>
            {/* Empty cell for alignment */}
            {labels.map((label, index) => (
              <td
                key={index}
                className="px-4 py-1 text-sm font-semibold text-gray-500 tracking-wider text-center"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {datasets.map((dataset, datasetIndex) => (
            <tr key={dataset.label}>
              <td className="pr-4 py-2 whitespace-nowrap text-sm font-normal text-gray-500">
                {dataset.label}
              </td>
              {dataset.data.map((value, index) => (
                <td
                  key={index}
                  className={`whitespace-nowrap text-sm text-gray-500 text-center`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;
