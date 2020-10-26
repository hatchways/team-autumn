import React from "react";
import TextField from "@material-ui/core/TextField";

const TextInputField = ({ dispatch, classes, label }) => {
  let input;

  return (
    <div>
      <form
        className={classes}
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.value.trim()) {
            return;
          }
          // might ultimately dispatch a function
          // dispatch()
          console.log(input.value);
          input.value = "";
        }}
      >
        <TextField
          id="standard-basic"
          label={label}
          inputRef={(node) => (input = node)}
          fullWidth
        />
      </form>
    </div>
  );
};

export default TextInputField;
