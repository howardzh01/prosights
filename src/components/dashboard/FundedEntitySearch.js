import * as React from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { filterOptions, createCompanyDic } from "../../utils/Utils";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import CompanyLogoSkeleton from "./CompanyLogoSkeleton";

// NOTE: Near duplicate of src/components/dashboard/SearchBar.js with UI changes
export default function FundedEntitySearch({
  companyDirectory,
  setCompany,
  setCompanyCompetitors,
}) {
  const [value, setValue] = React.useState(null);

  if (!companyDirectory.companyList) {
    return;
  }

  return (
    <div className="">
      <Autocomplete
        freeSolo={false}
        autoHighlight={true} // only use if freesolo=false
        id="autcomplete-search"
        filterOptions={filterOptions}
        autoComplete={true}
        disableListWrap
        options={companyDirectory.companyList} // Limit the options to the first 10 items
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : `${option.displayedName} - ${option.url}`
        }
        clearIcon={null} // Removes the clear icon
        onChange={(event, value) => {
          setCompany(createCompanyDic(value, companyDirectory));
          setCompanyCompetitors([]);
          setValue(null);
        }}
        clearOnBlur={false}
        value={value}
        renderOption={(props, option, { selected }) => (
          <Box component="li" {...props}>
            <div className="w-5 h-5 mr-2 text-xs">
              <CompanyLogoSkeleton name={option.displayedName} />
            </div>
            <span className="text-sm text-customGray-800">
              <strong>{option.displayedName}</strong> - {option.url}
            </span>
          </Box>
          // <Box component="li" {...props}>

          //   {option.logo ? (
          //     <img
          //       src={option.logo}
          //       alt={option.name}
          //       style={{
          //         marginRight: 8,
          //         height: "12px",
          //         width: "auto",
          //         display: "inline-block",
          //         borderRadius: "20%",
          //       }}
          //     />
          //   ) : (
          //     <div
          //       style={{
          //         marginRight: 8,
          //         height: "12px",
          //         width: "12px",
          //         display: "inline-block",
          //         borderRadius: "20%",
          //         backgroundColor: "#ccc", // Placeholder color, adjust as needed
          //       }}
          //     ></div>
          //   )}
          //   <span className="text-sm text-customGray-800">{option.url}</span>
          // </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="ByteDance"
            components={{
              ClearIndicator: () => null,
            }}
            InputProps={{
              ...params.InputProps,
              type: "search",
              style: {
                fontSize: "0.875rem",
                paddingTop: "2px", // Reduced top padding
                paddingBottom: "2px", // Reduced bottom padding
                fontFamily: "Inter",
                color: "#000000",
              },
              //   startAdornment: (
              //     <InputAdornment position="start">
              //       <Image
              //         src="/assets/search.svg"
              //         alt="User Avatar"
              //         width={64}
              //         height={64}
              //         className="w-4 ml-1"
              //       />
              //     </InputAdornment>
              //   ),
              endAdornment: <></>,
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#EFF1F5", // Hide the default border
                // borderRadius: "0.5rem",
                // boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#EFF1F5",
                borderRadius: "0.5rem",
                opacity: 1,
                fontSize: "0.75rem",
                color: "#000000",

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFFFFF", // border-customGray-50 on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFFFFF", // border-customGray-50 when focused
                },
              },
              "& .MuiInputBase-input::-webkit-search-cancel-button": {
                // WebkitAppearance: "none",
                display: "none",
              },
              "& .MuiInputBase-input::placeholder": {
                // Targeting the placeholder
                color: "#828BA4", // Placeholder color for dark and light mode
                opacity: 1, // Ensure the color is not transparent
              },
            }}
          />
        )}
      />
    </div>
  );
}
