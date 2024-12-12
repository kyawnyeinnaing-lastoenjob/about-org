export interface InputItem {
  id: string;
  contactId: string;
  name: string;
  url: string;
  slug: string;
  status: string;
  image: string;
}

import { forwardRef, JSX, useEffect, useId, useState } from "react";

import FileUpload from "@/components/shared/FileUpload";
// import FileUpload from '@/components/shared/FileUpload';
import { gray } from "@/components/shared/themes/themePrimitives";
import { IOSSwitch } from "@/components/shared/themes/ui/styles";
import { Clear as ClearIcon } from "@mui/icons-material";
import AddLinkIcon from "@mui/icons-material/AddLink";
import {
  Button,
  // Button,
  FormControlLabel,
  FormLabel,
  IconButton,
  // IconButton,
  InputAdornment,
  Stack,
  styled,
  // styled,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Status } from "@prisma/client";

interface SocialsInputListProps {
  label?: string;
  icon: JSX.Element;
  onChange: (value: InputItem[]) => void;
  value: InputItem[];
  error: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helperText: any;
}

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(3),
  top: theme.spacing(2),
  width: "30px",
  height: "30px",
}));

const SocialsInputList = forwardRef<HTMLInputElement, SocialsInputListProps>(
  (props, ref) => {
    const [items, setItems] = useState<InputItem[]>(
      props?.value || [
        { name: "", url: "", slug: "", status: Status.ACTIVE, image: "" },
      ],
    );

    const id = useId();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
      setItems(
        props?.value || [
          { name: "", url: "", slug: "", status: Status.ACTIVE, image: "" },
        ],
      );
    }, [props?.value]);

    const handleAddItem = () => {
      const updatedItems = [
        ...items,
        {
          name: "",
          url: "",
          slug: "",
          id: "",
          contactId: "",
          status: Status.ACTIVE,
          image: "",
        },
      ];
      setItems(updatedItems);
      props?.onChange(updatedItems);
    };

    const handleItemChange = (index: number, newValue: Partial<InputItem>) => {
      const updatedItems = items
        .map((item, i) => (i === index ? { ...item, ...newValue } : item))
        .map((item) => ({
          ...item,
          slug: item.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_") || "",
          id: item.id || "",
          contactId: item.contactId || "",
          status: item.status || Status.ACTIVE,
          image: item.image || "",
        }));
      setItems(updatedItems);
      props?.onChange(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
      if (items.length === 1) {
        const updatedItems = [
          {
            name: "",
            url: "",
            slug: "",
            id: "",
            contactId: "",
            status: Status.ACTIVE,
            image: "",
          },
        ];
        setItems(updatedItems);
        props?.onChange(updatedItems);
      } else {
        const updatedItems = items.filter((_, i) => i !== index);
        props?.onChange(updatedItems);
        setItems(updatedItems);
      }
    };

    console.log("items => ", items);

    return (
      <Stack spacing={2} direction="column" justifyContent="space-between">
        {props?.label && (
          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="social-inputs" required>
              {props?.label}
            </FormLabel>
          </Grid>
        )}
        <Stack direction="row" flexWrap="wrap" rowGap={3} columnGap={3}>
          {items.map((item, index) => {
            console.log(item.image);
            return (
              <Stack
                key={`${id}-item-${index}`}
                spacing={2}
                width={isMobile ? "100%" : "49%"}
                sx={() => ({
                  padding: "25px",
                  paddingTop: "45px",
                  border: `1px solid ${gray[100]}`,
                  position: "relative",
                })}
              >
                {items.length !== 1 && (
                  <IconButtonStyled
                    onClick={() => handleRemoveItem(index)}
                    edge="end"
                  >
                    <ClearIcon sx={{ width: "20px", height: "20px" }} />
                  </IconButtonStyled>
                )}
                {/* <TextField value={item.slug} placeholder="Slug Name" disabled /> */}
                {/* <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(index, e.target.files[0]);
              }}
            /> */}
                <FileUpload
                  imgUrl={item.image}
                  initialUrl={item.image}
                  setImgUrl={(newImgUrl) =>
                    handleItemChange(index, { image: newImgUrl })
                  }
                  sx={{
                    width: 80,
                    height: 80,
                    minHeight: 80,
                    borderRadius: "50%",
                  }}
                  iconSx={{ width: 15, h: 15 }}
                  iconButtonSx={{ width: 25, height: 25 }}
                />
                <TextField
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, { name: e.target.value })
                  }
                  placeholder="Social Name"
                  inputRef={index === 0 ? ref : undefined}
                  helperText={props?.helperText?.[index]?.name?.message}
                  error={props?.error}
                />
                <TextField
                  value={item.url}
                  onChange={(e) =>
                    handleItemChange(index, { url: e.target.value })
                  }
                  placeholder="Social Link"
                  helperText={props?.helperText?.[index]?.url?.message}
                  error={props?.error}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddLinkIcon sx={{ width: "20px", height: "20px" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {/* <FileUpload imgUrl={imgUrl} setImgUrl={setImgUrl} /> */}
                <FormControlLabel
                  control={
                    !item.status ? (
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={item.status === Status.ACTIVE}
                        onChange={(event) => {
                          handleItemChange(index, {
                            status: event.target.checked
                              ? Status.ACTIVE
                              : Status.INACTIVE,
                          });
                        }}
                      />
                    ) : (
                      <IOSSwitch
                        sx={{ m: 1 }}
                        // defaultChecked={item.status === Status.ACTIVE}
                        checked={item.status === Status.ACTIVE}
                        onChange={(event) => {
                          handleItemChange(index, {
                            status: event.target.checked
                              ? Status.ACTIVE
                              : Status.INACTIVE,
                          });
                        }}
                      />
                    )
                  }
                  label={item.status === Status.ACTIVE ? "Active" : "Inactive"}
                />
              </Stack>
            );
          })}
        </Stack>

        <Grid size={{ xs: 12, md: 12 }}>
          <Button
            variant="contained"
            onClick={handleAddItem}
            startIcon={props?.icon}
          >
            Add New
          </Button>
        </Grid>
      </Stack>
    );
  },
);
SocialsInputList.displayName = "SocialsInputList";
export default SocialsInputList;
