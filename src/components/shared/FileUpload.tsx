"use client";
import * as React from "react";
import { useDropzone } from "react-dropzone";

import { useSnackbar } from "@/hooks/useSnackbar";
import { useUploadImage } from "@/lib/services/upload";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { Box, IconButton, SxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface FileUploadProps {
  label?: string;
  imgUrl: string;
  initialUrl?: string;
  setImgUrl: (val: string) => void;
  sx?: SxProps;
  iconSx?: SxProps;
  iconButtonSx?: SxProps;
}

type DropzoneStyleProps = {
  isFocused: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx?: any;
};

const DropzoneContainer = styled(Box)<DropzoneStyleProps>(
  ({ theme, isFocused, isDragAccept, isDragReject, sx }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    minHeight: "100px",
    borderWidth: 2,
    borderRadius: 2,
    background:
      theme.palette.mode === "dark" ? "#424242" : theme.palette.common.white,
    borderStyle: "dashed",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    borderColor: isFocused
      ? "#2196f3"
      : isDragAccept
        ? "#00e676"
        : isDragReject
          ? "#ff1744"
          : "#eeeeee",
    ...(sx && sx),
  }),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FileUploadStyled = styled(Box)<{ bgImg: string | undefined; sx: any }>(
  ({ bgImg, sx }) => ({
    width: "150px",
    height: "150px",
    background: `url(${bgImg}) no-repeat center / contain`,
    position: "relative",
    ...(sx && sx),
  }),
);

const FileUpload: React.FC<FileUploadProps> = ({
  initialUrl,
  imgUrl,
  setImgUrl,
  sx,
  iconSx,
  iconButtonSx,
}) => {
  const [url, setUrl] = React.useState<string | null>(null);

  const { openSnackbar } = useSnackbar();
  const { trigger } = useUploadImage();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentType", file.type);

    await trigger(
      { formData },
      {
        onSuccess: (res) => {
          setImgUrl(res.url);
          setUrl(res.url);
          openSnackbar(res.message, "success");
        },
      },
    );
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/png": [],
        "image/jpeg": [],
      },
      maxFiles: 1,
      onDrop,
    });

  const styleProps = React.useMemo(
    () => ({ isFocused, isDragAccept, isDragReject }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <Box>
      {url || initialUrl ? (
        <FileUploadStyled bgImg={url || imgUrl || initialUrl} sx={sx}>
          <Box sx={{ position: "absolute", right: 0 }}>
            <IconButton sx={{ ...iconButtonSx }}>
              <PublishedWithChangesIcon sx={{ ...iconSx }} />
              <Box
                {...getRootProps()}
                {...styleProps}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 9,
                }}
              >
                <input {...getInputProps()} />
              </Box>
            </IconButton>
          </Box>
        </FileUploadStyled>
      ) : (
        <DropzoneContainer {...getRootProps()} {...styleProps} sx={sx}>
          <input {...getInputProps()} />
          <Typography>Upload</Typography>
        </DropzoneContainer>
      )}
    </Box>
  );
};

export default FileUpload;
