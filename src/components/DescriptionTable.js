import Image from "next/image";

function DescriptionTable({ descriptionData }) {
  if (!descriptionData) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-1/4 overflow-x-auto">
      <table className="bg-white text-sm w-full">
        <thead>
          <tr>
            <th className="border px-2 py-2 text-center">About</th>
            <th className="border px-2 py-2 text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-2 text-center">
              {" "}
              <Image
                src={descriptionData.logo}
                alt="Company Image"
                width={50}
                height={50}
              ></Image>
            </td>
            <td className="border px-2 py-2 text-center">
              {descriptionData.description}
            </td>
          </tr>

          <tr>
            <td className="border px-2 py-2 font-semibold text-center">
              Founded
            </td>
            <td className="border px-2 py-2 text-center">
              {descriptionData.founded}
            </td>
          </tr>

          <tr>
            <td className="border px-2 py-2 font-semibold text-center">
              Funding
            </td>
            <td className="border px-2 py-2 text-center">
              ${descriptionData.funding / 1000000}M
            </td>
          </tr>

          <tr>
            <td className="border px-2 py-2 font-semibold text-center">
              Location
            </td>
            <td className="border px-2 py-2 text-center">
              {descriptionData.location}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DescriptionTable;
