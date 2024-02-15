import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import { companyList } from "./CompanyList";

export default function SearchBar({ setCompany, setCompanyCompetitors }) {
  const [value, setValue] = React.useState(null);

  if (!companyList) {
    return;
  }
  const createCompanyDic = (value) => {
    // Assuming value can be a string or an object with properties like name, url, and displayedName
    if (typeof value === "string") {
      return value.includes(".")
        ? {
            name: value.split(".")[0],
            url: value,
            displayedName: value.split(".")[0],
          }
        : { name: value, url: `${value}.com`, displayedName: value };
    } else {
      // Ensure displayedName is always set, defaulting to name if not provided
      return {
        name: value.name,
        url: value.url,
        displayedName: value.displayedName || value.name,
      };
    }
  };
  return (
    <div className="h-12">
      <Autocomplete
        freeSolo={true}
        id="autcomplete-search"
        autoComplete={true}
        options={companyList}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.displayedName
        }
        onChange={(event, value) => {
          setCompany(createCompanyDic(value));
          setCompanyCompetitors([]);
          setValue(null);
        }}
        clearIcon={<span></span>}
        clearOnBlur={true}
        value={value}
        renderOption={(props, option, { selected }) => (
          <Box component="li" {...props}>
            <img
              src={option.logo}
              alt={option.name}
              style={{
                marginRight: 8,
                height: "12px",
                width: "auto",
                display: "inline-block",
                borderRadius: "20%",
              }}
            />
            <span className="text-sm text-customGray-800">{option.url}</span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search with a company URL"
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
              // classes: {
              //   input: {}
              // }
              style: {
                fontSize: "0.875rem",
                fontFamily: "Inter",
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "0.875rem",
                color: "#A9B1C7",
                fontFamily: "Inter",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#EFF1F5", // Hide the default border
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                fontSize: "0.75rem",

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
