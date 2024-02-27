import React, { useState, useEffect, useCallback, useRef } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { filterOptions, createCompanyDic } from "../../utils/Utils";
import TextField from "@mui/material/TextField";
import { Box, CircularProgress } from "@mui/material";
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
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  // Directly using useEffect to handle debouncing
  const debounceTimeoutRef = useRef(); // Ref to hold debounce timeout
  // Debounce function to delay execution
  const debounce = (func, delay) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(func, delay);
  };

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/private/getSearchResults", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputValue }),
        });
        const data = await response.json();
        setOptions(data || []);
      } catch (error) {
        console.log("Failed to fetch company list:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    // Apply debounce to fetchData
    debounce(fetchData, 200); // Adjust the delay as needed

    // Cleanup on unmount or inputValue change
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [inputValue]); // Effect runs on inputValue change

  return (
    <div className="">
      <Autocomplete
        freeSolo={false}
        autoHighlight={true} // only use if freesolo=false
        id="autcomplete-search"
        autoComplete={true}
        disableListWrap
        options={options}
        onChange={(event, value) => {
          if (!value) return;
          setCompany(value);
          setCompanyCompetitors([]);
          // setInputValue("");
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        loading={loading}
        loadingText={<CircularProgress color="inherit" size={20} />} // Custom loading text/indicator
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : `${option.displayedName} - ${option.url}`
        }
        clearIcon={null} // Removes the clear icon
        clearOnBlur={false}
        value={inputValue}
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
