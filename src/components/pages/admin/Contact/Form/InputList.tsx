import { forwardRef, JSX, useEffect, useId, useState } from "react";

import { Clear as ClearIcon } from "@mui/icons-material";
import {
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
} from "@mui/material";

import { InputItem } from "../types";

interface InputListProps {
  label?: string;
  type: "phone" | "email" | "text";
  placeholder: string;
  icon: JSX.Element;
  onChange: (value: InputItem[]) => void;
  value: InputItem[];
  error: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helperText: any;
}

const IconButtonStyled = styled(IconButton)(() => ({
  border: "none",
  width: "30px",
  height: "30px",
  marginRight: "-10px",
}));

const InputList = forwardRef<HTMLInputElement, InputListProps>((props, ref) => {
  const [items, setItems] = useState<InputItem[]>(
    props?.value || [{ value: "", isEditing: true }],
  );

  const id = useId();

  // Synchronize the items state with the value prop when it changes
  useEffect(() => {
    setItems(props?.value || [{ value: "", isEditing: true }]);
  }, [props?.value]);

  // Add new input field
  const handleAddItem = () => {
    const updatedItems = [...items, { value: "", isEditing: true }];
    setItems(updatedItems);
    props?.onChange(updatedItems);
  };

  // Handle input field value change
  const handleItemChange = (index: number, newValue: string) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, value: newValue } : item,
    );
    setItems(updatedItems);
    props?.onChange(updatedItems);
  };

  // Remove an input field, ensuring at least one remains
  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      const updatedItems = [{ value: "", isEditing: true }];
      setItems(updatedItems);
      props?.onChange(updatedItems);
    } else {
      const updatedItems = items.filter((_, i) => i !== index);
      props?.onChange(updatedItems);
      setItems(updatedItems);
    }
  };

  return (
    <Stack spacing={2} direction="column" justifyContent="space-between">
      {props?.label && (
        <FormLabel htmlFor={props?.type} required>
          {props?.label}
        </FormLabel>
      )}
      {items.map((item, index) => {
        return (
          <TextField
            key={`${id}-item-${index}`}
            value={item.value}
            onChange={(e) => handleItemChange(index, e.target.value)}
            disabled={!item.isEditing}
            size="medium"
            placeholder={props?.placeholder}
            inputRef={index === 0 ? ref : undefined}
            helperText={props?.helperText?.[index]?.value?.message}
            error={props?.error}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {props?.icon}
                  </InputAdornment>
                ),
                endAdornment: items.length !== 1 && (
                  <InputAdornment position="end">
                    <IconButtonStyled
                      aria-label={`remove ${props?.type}`}
                      onClick={() => handleRemoveItem(index)}
                      edge="end"
                    >
                      <ClearIcon sx={{ width: "20px", height: "20px" }} />
                    </IconButtonStyled>
                  </InputAdornment>
                ),
              },
            }}
          />
        );
      })}

      <Button
        variant="contained"
        onClick={handleAddItem}
        startIcon={props?.icon}
      >
        Add New
      </Button>
    </Stack>
  );
});
InputList.displayName = "InputList";
export default InputList;
