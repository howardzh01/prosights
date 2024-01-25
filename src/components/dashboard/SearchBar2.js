import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import { companyList } from "./CompanyList";

export default function SearchBar({ company, setCompany }) {
  const [value, setValue] = React.useState(null);

  if (!companyList) {
    return;
  }
  console.log(companyList);
  return (
    <div className="h-12">
      <Autocomplete
        freeSolo={false}
        id="autcomplete-search"
        autoComplete={true}
        options={companyList}
        getOptionLabel={(option) => option.displayedName}
        onChange={(event, value) => {
          setCompany(value.name);
          setValue(null);
        }}
        clearIcon={<span></span>}
        clearOnBlur={true}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for Company"
            components={{
              ClearIndicator: () => null,
            }}
            InputProps={{
              ...params.InputProps,
              // startAdornment: [
              //   <Image
              //     src="/assets/search.svg"
              //     alt="Play"
              //     width={16} // Adjusted to match the w-4 class in TailwindCSS (1rem = 16px)
              //     height={16} // Adjusted to match the h-4 class in TailwindCSS (1rem = 16px)
              //     className="mx-1"
              //   />,
              //   params.InputProps.startAdornment,
              // ],
              type: "search",
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                // target the root of the outlined input
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#EFF1F5", // Hide the default border
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              },
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#EFF1F5", // border-customGray-50 on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#EFF1F5", // border-customGray-50 when focused
                },
              },
            }}
          />
        )}
      />
    </div>
  );
}