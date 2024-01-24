import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import Chip from "@mui/material/Chip";

export default function SearchBar({
  companyCompetitors,
  setCompanyCompetitors,
}) {
  // return (
  //   <Autocomplete
  //     multiple
  //     limitTags={2}
  //     id="multiple-limit-tags"
  //     options={companyList}
  //     getOptionLabel={(option) => option.url}
  //     defaultValue={[]}
  //     renderInput={(params) => (
  //       <TextField {...params} label="Add Comptetitors" placeholder="Company" />
  //     )}
  //     sx={{ width: "500px" }}
  //   />
  // );

  return (
    <Autocomplete
      multiple
      limitTags={4}
      id="multiple-limit-tags"
      options={companyList}
      getOptionLabel={(option) => option.displayedName}
      onChange={(event, value) => setCompanyCompetitors(value)}
      value={companyCompetitors}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            icon={
              <Image
                src={option.logo} // Assuming 'option' has a 'logo' property with the image URL
                alt={option.name} // Assuming 'option' has a 'name' property
                width={16} // Set the image size as needed
                height={16}
                className="object-contain rounded"
              />
            }
            label={option.displayedName} // Assuming 'option' has a 'displayedName' property
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
            label="Add Competitors"
            placeholder={companyCompetitors.length >= 3 ? "" : "Company"}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none", // Removes the border
                },
              },
              bgcolor: "white",
              borderRadius: "0.375rem", // Equivalent to Tailwind's rounded-lg
            }}
            className="flex-1 min-w-0"
            InputProps={{
              ...params.InputProps,
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
          <img
            src={option.logo}
            alt={option.name}
            style={{
              marginRight: 8,
              height: "20px",
              width: "auto",
              display: "inline-block",
              borderRadius: "20%",
            }}
          />
          <span className="text-sm">{option.url}</span>
        </Box>
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const companyList = [
  {
    name: "stockx",
    url: "www.stockx.com",
    cbSlug: "stockx",
    displayedName: "StockX",
    logo: "https://images.crunchbase.com/image/upload/t_cb-default-original/hvhqzscb7we0hifjqr2q",
  },
  {
    name: "goat",
    url: "www.goat.com",
    cbSlug: "goatapp",
    displayedName: "GOAT",
    logo: "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/vtpvp46fr98de2r1txof",
  },
  {
    name: "flight-club",
    url: "www.flightclub.com",
    cbSlug: "flight-club-new-york-ltd",
    displayedName: "Flight Club",
    logo: "https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1423006341/cmctwzqw4fhxhuhv7zwh.png",
  },
  {
    name: "zillow",
    url: "www.zillow.com",
    cbSlug: "zillow",
    displayedName: "Zillow",
    logo: "https://images.crunchbase.com/image/upload/t_cb-default-original/v1500275099/j2jcc1e5txlw573hwrd2.png",
  },
  {
    name: "hinge",
    url: "www.hinge.com",
    cbSlug: "hinge",
    displayedName: "Hinge",
    logo: "https://images.crunchbase.com/image/upload/t_cb-default-original/v1476208888/ioqpyzju0fzjm4hinlsk.jpg",
  },
  {
    name: "tinder",
    url: "www.tinder.com",
    cbSlug: "tinder",
    displayedName: "Tinder",
    logo: "https://images.crunchbase.com/image/upload/t_cb-default-original/v1493769757/m6qsmngji1qacb480jeg.png",
  },
  {
    name: "bumble",
    url: "www.bumble.com",
    cbSlug: "bumble",
    displayedName: "Bumble",
    logo: "https://images.crunchbase.com/image/upload/t_cb-default-original/g9hbkpvy3xxyo3dzryst",
  },
];
