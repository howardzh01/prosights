import React, { useState, useEffect, useCallback, useRef } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { filterAndSortOptions, createCompanyDic } from "../../utils/Utils";
import TextField from "@mui/material/TextField";
import { Box, CircularProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import CompanyLogoSkeleton from "./CompanyLogoSkeleton";
// IMPORTANT: every change here should be made in CompetitorSearchBar +
export default function SearchBar({
  emptyStateCompanyList,
  setCompany,
  setCompanyCompetitors,
  darkMode,
}) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(emptyStateCompanyList || []);
  const [loading, setLoading] = useState(false); // Loading state
  const [userDefinedOptions, setUserDefinedOptions] = useState([]); // State to hold user-defined companies
  // Directly using useEffect to handle debouncing
  const debounceTimeoutRef = useRef(); // Ref to hold debounce timeout
  // Debounce function to delay execution
  const debounce = (func, delay) => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(func, delay);
  };

  useEffect(() => {
    // This code runs after the component has mounted, ensuring localStorage is available
    const existingDicsString = localStorage.getItem("userDefinedCompanyDics");
    const existingDics = existingDicsString
      ? JSON.parse(existingDicsString)
      : {};
    const convertDicsToArray = Object.keys(existingDics).map((key) => {
      // Add a "userDefined" property to the company object to differentiate it from the server results
      return { ...existingDics[key], userDefined: true };
    });
    setUserDefinedOptions(convertDicsToArray);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions(emptyStateCompanyList || []);
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
        filterOptions={filterAndSortOptions}
        autoComplete={true}
        disableListWrap
        // options={companyDirectory.companyList} // Limit the options to the first 10 items
        options={[...userDefinedOptions, ...options]}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : option.userDefined
            ? `${option.name} (User Defined) - ${option.url}`
            : `${option.displayedName} - ${option.url}`
        }
        clearIcon={null} // Removes the clear icon
        onChange={(event, value) => {
          if (!value) return;
          setCompany(value);
          setCompanyCompetitors([]);
          setInputValue("");
        }}
        clearOnBlur={true}
        value={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        loading={loading}
        loadingText={<CircularProgress color="inherit" size={20} />} // Custom loading text/indicator
        renderOption={(props, option, { selected }) => (
          <Box component="li" {...props}>
            <div className="w-5 h-5 mr-2 text-xs">
              <CompanyLogoSkeleton
                name={option.userDefined ? option.name : option.displayedName}
              />
            </div>
            <span className="text-sm text-customGray-800">
              {option.userDefined ? (
                <>
                  <strong>{option.name}</strong> (User Defined) - {option.url}
                </>
              ) : (
                <>
                  <strong>{option.displayedName}</strong> - {option.url}
                </>
              )}
            </span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search target company URL"
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
                color: darkMode ? "#ffffff" : "#000000",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    src="/assets/search.svg"
                    alt="User Avatar"
                    width={64}
                    height={64}
                    className="w-4 ml-1"
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: darkMode ? "#373B46" : "#FFFFFF", // Hide the default border
                borderRadius: "0.5rem",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: darkMode ? "#373B46" : "#FFFFFF",
                borderRadius: "0.5rem",
                opacity: 0.8,
                fontSize: "0.75rem",
                color: darkMode ? "#ffffff" : "#000000",

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: darkMode ? "#4F5153" : "#FFFFFF", // border-customGray-50 on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: darkMode ? "#4F5153" : "#FFFFFF", // border-customGray-50 when focused
                },
              },
              "& .MuiInputBase-input::-webkit-search-cancel-button": {
                // WebkitAppearance: "none",
                display: "none",
              },
              "& .MuiInputBase-input::placeholder": {
                // Targeting the placeholder
                color: darkMode ? "#B4BCD4" : "#828BA4", // Placeholder color for dark and light mode
                opacity: 1, // Ensure the color is not transparent
              },
            }}
          />
        )}
      />
    </div>
  );
}
