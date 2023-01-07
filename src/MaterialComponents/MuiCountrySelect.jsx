import { Autocomplete, TextField, Box, Select } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const MuiCountrySelect = ({ inputValue, setInputValue,countries, ...props }) => {
  const [country, setCountry] = useState("");

  function finder(value) {
    const filteredCountries = [];
    for (let i = 5; i > 1; i--) {
      const targetCountry = countries.find((c) => {
        return c.phone == value.substring(0, i);
      });
      if (targetCountry) filteredCountries.push(targetCountry);
    }
    return filteredCountries[0];
  }

  useEffect(() => {
    setCountry(finder(inputValue));
  }, [inputValue]);

  

  const handleChange = (e, newValue) => {
    setCountry(newValue);
    setInputValue(newValue.phone);
  };

  return (
    <Autocomplete
      {...props}
      value={country || null}
      popupIcon={<ExpandMoreIcon />}
      disableClearable
      onChange={handleChange}
      options={countries}
      renderInput={(params) => <TextField {...params} label="Country" />}
      renderOption={(props, option) => (
        <Box
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            "& > p": { flexGrow: 1 },
          }}
          component="li"
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          <p className="grow">{option.label}</p>
          {option.phone}
        </Box>
      )}
    />
  );
};

export default MuiCountrySelect;

