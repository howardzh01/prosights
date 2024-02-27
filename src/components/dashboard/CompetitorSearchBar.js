import React, { useState, useEffect, useCallback, useRef } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, CircularProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";
import CompanyLogoSkeleton from "./CompanyLogoSkeleton";
import filterAndSortOptions from "../../utils/Utils";

// NOTE: Most changes w/ comments are in SearchBar
export default function CompetitorSearchBar({
  targetCompany, //TODO: remove target company from searchbar
  emptyStateCompanyList,
  companyCompetitors,
  setCompanyCompetitors,
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
    <Autocomplete
      multiple
      limitTags={4}
      autoHighlight={true} // only use if freesolo=false
      id="multiple-limit-tags"
      options={
        [...userDefinedOptions, ...options].filter(
          (x) => x.displayedName !== targetCompany.displayedName
        ) || []
      } // Remove options where displayedName matches the target company
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : option.userDefined
          ? `${option.name} (User Defined) - ${option.url}`
          : `${option.displayedName} - ${option.url}`
      }
      onChange={(event, value) => {
        if (!value) return;
        setCompanyCompetitors(value);
        setInputValue("");
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      loading={loading}
      loadingText={<CircularProgress color="inherit" size={20} />} // Custom loading text/indicator
      value={companyCompetitors}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            icon={
              <div className="w-5 h-5 mr-2 text-xs">
                <CompanyLogoSkeleton
                  name={option.userDefined ? option.name : option.displayedName}
                />
              </div>
              // <Image
              //   src={option.logo} // Assuming 'option' has a 'logo' property with the image URL
              //   alt={option.name} // Assuming 'option' has a 'name' property
              //   width={16} // Set the image size as needed
              //   height={16}
              //   className="object-contain rounded"
              // />
            }
            label={
              option.userDefined
                ? `${option.name} (User Defined)`
                : option.displayedName
            } // Assuming 'option' has a 'displayedName' property
            {...getTagProps({ index })}
            disabled={false}
            className="MuiAutocomplete-tag pl-1"
          />
        ));
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            // label="Add Competitors"
            placeholder={
              companyCompetitors.length >= 3 ? "" : "Add Competitors"
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none", // Removes the border
                },
              },
              bgcolor: "white",
              borderRadius: "0.375rem", // Equivalent to Tailwind's rounded-lg
              "& .MuiInputBase-input::placeholder": {
                // Targeting the placeholder
                color: "#9DA4B9",
                opacity: 1, // Ensure the color is not transparent
              },
            }}
            className="flex-1 min-w-0"
            InputLabelProps={{
              style: {
                fontSize: "0.875rem",
                color: "#A9B1C7",
                fontFamily: "Inter",
              },
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                fontFamily: "Inter",
              },
              startAdornment: [
                <Image
                  src="/assets/compare.svg"
                  alt="Compare"
                  width={16} // Adjusted to match the w-4 class in TailwindCSS (1rem = 16px)
                  height={16} // Adjusted to match the h-4 class in TailwindCSS (1rem = 16px)
                  className="mr-1"
                />,
                params.InputProps.startAdornment,
              ],
              endAdornment: null,
            }}
          />
        );
      }}
      renderOption={(props, option, { selected }) => (
        <Box component="li" {...props}>
          <div
            className="w-5 h-5 mr-2 flex-shrink-0 flex-grow-0 text-xs"
            style={{ minWidth: "1.25rem", minHeight: "1.25rem" }}
          >
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
        // <Box component="li" {...props}>
        //   <img
        //     src={option.logo}
        //     alt={option.name}
        //     style={{
        //       marginRight: 8,
        //       height: "20px",
        //       width: "auto",
        //       display: "inline-block",
        //       borderRadius: "20%",
        //     }}
        //   />
        //   <span className="text-sm">{option.url}</span>
        // </Box>
      )}
      sx={{
        height: "50px",
        "& .MuiAutocomplete-inputRoot": {
          width: `calc(100% + 50px)`, // Allow the input to automatically adjust its width
          minWidth: "200px", // Minimum width to avoid too small input when there are no tags
        },
      }}
      fullWidth={true}
      disabled={companyCompetitors.length >= 3}
    />
  );
}
