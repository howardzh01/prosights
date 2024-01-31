import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

function GenericTable({
  tableData,
  scrollStart = "left",
  formatTableDataFunction,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && scrollStart === "right") {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const {
    tableHeaders,
    tableLabels,
    tableDatasets,
    topBorderedRows, //array
    highlightedRows, //dict of label->bg-color
  } = tableData;
  // console.log("datasets, labels, headers", datasets, labels, headers);

  // Prepare header spans
  let headerSpans = {};
  if (tableHeaders) {
    headerSpans = tableHeaders.reduce((spans, header) => {
      spans[header] = (spans[header] || 0) + 1;
      return spans;
    }, {});
  }
  console.log(highlightedRows, "highlightedRows");
  // console.log("headerSpans", headerSpans);

  return (
    <div className="overflow-x-scroll mt-4 pb-2" ref={scrollRef}>
      <table className="divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-sm font-medium text-customGray-500 tracking-wider text-center sticky left-0 z-10 bg-white bg-opacity-100"></th>{" "}
            {/* Empty header for shifting the row */}
            {[...new Set(tableHeaders)].map((header, index) => (
              <th
                key={index}
                colSpan={headerSpans[header]}
                className={`text-xs font-medium tracking-wider text-center`}
              >
                <div className="inline-block bg-customGray-50 text-customGray-500 rounded-md w-11/12 py-1 ">
                  {header}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <td className="px-6 text-sm font-medium text-customGray-500 tracking-wider text-left sticky left-0 z-10 bg-white bg-opacity-100"></td>
            {/* Empty cell for alignment */}
            {tableLabels.map((label, index) => (
              <td
                key={index}
                className="px-4 pt-1 pb-2 text-sm font-semibold text-customGray-500 tracking-wider text-center"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        {/* // TODO: consider formatting table before loading it in */}
        <tbody className="bg-white ">
          {[tableDatasets].map((dsetCategory, categoryIndex) =>
            dsetCategory.map((dataset) => {
              const bgColor = highlightedRows?.[dataset.label] || "bg-white";
              {
                console.log(dataset.label, bgColor, "bgColor");
              }
              return (
                <tr
                  key={dataset.label}
                  className={
                    topBorderedRows?.includes(dataset.label)
                      ? `border-t ${bgColor}`
                      : bgColor
                  }
                >
                  <td
                    className={`pr-2 pt-1 pb-2 whitespace-nowrap text-sm font-normal text-customGray-500 text-left sticky left-0 z-10 ${bgColor} bg-opacity-100`}
                  >
                    {dataset.label}
                  </td>
                  {dataset.data.map((value, index) => (
                    <td
                      key={index}
                      className={`whitespace-nowrap text-sm text-customGray-500 text-center`}
                    >
                      {formatTableDataFunction(value)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenericTable;
