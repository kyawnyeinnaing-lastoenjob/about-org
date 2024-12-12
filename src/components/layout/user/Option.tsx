import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";

import { checkCountryChangeAtom } from "@/components/pages/user/atoms";
import PublicIcon from "@mui/icons-material/Public";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export interface OptionProps {
  src: string;
  name: string;
  hideTypo?: boolean;
}

const Option: React.FC<OptionProps> = ({ src, name, hideTypo }) => {
  const [checkCountryChange, setCheckCountryChange] = useAtom(
    checkCountryChangeAtom,
  );
  return (
    <Box
      onClick={() => setCheckCountryChange(!checkCountryChange)}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "8px",
        ["& p"]: {
          display: {
            xs: hideTypo ? "none" : "inline",
            lg: "inline",
          },
        },
      }}
    >
      {src ? (
        <Image
          width={24}
          height={24}
          alt="c"
          src={src}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      ) : (
        <PublicIcon />
      )}
      <Typography> {name} </Typography>
    </Box>
  );
};

export default Option;
