import React from "react";
import { styled } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import MDTypography from "components/MDTypography";

const DropdownContainer = styled(FormControl)({
  marginBottom: (theme) => theme.spacing(1),
});

const DropdownLabel = styled(InputLabel)({
  fontSize: "16px",
  marginBottom: (theme) => theme.spacing(1),
  color: "#333",
});

const DropdownSelect = styled(Select)({
  width: "30%",
});

const Dropdown = ({ selectedValue, onChange }) => {
  return (
    <DropdownContainer>
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
              Select Store
            </MDTypography>
      <DropdownSelect
        native
        value={selectedValue}
        onChange={onChange}
        inputProps={{
          name: "store",
          id: "store-select",
        }}
      >
        <option value="store 1">Store 1</option>
        <option value="store 2">Store 2</option>
      </DropdownSelect>
    </DropdownContainer>
  );
};

export default Dropdown;
