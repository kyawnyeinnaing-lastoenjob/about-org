"use client";
import * as React from "react";
import { useDropzone } from "react-dropzone";

import { useSnackbar } from "@/hooks/useSnackbar";
import { useUploadImage } from "@/lib/services/upload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { fontSize } from "../fontStyles";
import { gray } from "../themePrimitives";

interface ImageUploadProps {
  label?: string;
  imgUrl: string;
  setImgUrl: (val: string) => void;
  sx?: SxProps;
  imgAspectRatio?: {
    width: number;
    height: number;
  };
}

type FileWithPreview = File & { preview: string };

type DropzoneStyleProps = {
  isFocused: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
};

const DropzoneContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isFocused" && prop !== "isDragAccept" && prop !== "isDragReject",
})<DropzoneStyleProps>(({ theme, isFocused, isDragAccept, isDragReject }) => ({
  // width: "350px",
  height: "200px",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  background:
    theme.palette.mode === "dark" ? gray[800] : theme.palette.colors.white,
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
}));

const ImageUploadStyled = styled(Box)<{ bgImg: string }>(({ bgImg }) => ({
  width: "350px",
  height: "250px",
  background: `url(${bgImg}) no-repeat center / contain`,
  position: "relative",
}));

const DropzoneBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  "& > *:first-of-type": {
    marginBottom: "10px",
  },
}));

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imgUrl, setImgUrl }) => {
  const [files, setFiles] = React.useState<FileWithPreview[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const { openSnackbar } = useSnackbar();

  // const targetWidth = imgAspectRatio?.width || 200;
  // const targetHeight = imgAspectRatio?.height || 200;

  // api
  const { trigger } = useUploadImage();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      openSnackbar("File size exceeds the 2 MB limit", "error");
      setImgUrl("");
      return;
    }

    const preview = URL.createObjectURL(file);
    const fileWithPreview = { ...file, preview } as FileWithPreview;

    if (files[0]?.preview === preview) return;

    const img = new Image();
    img.src = preview;

    img.onload = async () => {
      //! Don't remove [Calculation of aspect image ration]
      // const width = img.naturalWidth;
      // const height = img.naturalHeight;
      // const ratio = width / height;

      // const targetRatio = targetWidth / targetHeight;

      // if (Math.abs(ratio - targetRatio) > 0.01) {
      //   openSnackbar(
      //     `Invalid aspect ratio. Expected approximately ${targetWidth} x ${targetHeight}px.`,
      //     'error'
      //   );
      //   setImgUrl('');
      //   return;
      // }

      setImgUrl(preview);
      setFiles([fileWithPreview]);

      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentType", file.type);
      await trigger(
        { formData },
        {
          onSuccess: (res) => {
            setProgress(100);
            setImgUrl(res.url);
            openSnackbar(res.message, "success");
            setTimeout(() => {
              setIsUploading(false);
            }, 500);
          },
        },
      );
    };

    img.onerror = () => {
      openSnackbar("Failed to load image. Please try again.", "error");
      setImgUrl("");
    };
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/png": [], "image/jpeg": [] },
      maxFiles: 1,
      onDrop,
    });

  const styleProps = React.useMemo(
    () => ({ isFocused, isDragAccept, isDragReject }),
    [isFocused, isDragAccept, isDragReject],
  );

  React.useEffect(() => {
    if (imgUrl && files?.[0]?.preview !== imgUrl) {
      setFiles([
        {
          preview: imgUrl,
        } as FileWithPreview,
      ]);
    }
  }, [imgUrl, files]);

  return (
    <Box>
      {files[0]?.preview ? (
        <ImageUploadStyled
          bgImg={files[0]?.preview || imgUrl}
          sx={{ width: "200px", height: "250px" }}
        >
          <Box sx={{ position: "absolute", right: 0 }}>
            {isUploading ? (
              <CircularProgressWithLabel
                variant="determinate"
                value={progress}
              />
            ) : (
              <IconButton
                onClick={() => {
                  setFiles([]);
                  setImgUrl("");
                }}
              >
                <RemoveCircleIcon />
              </IconButton>
            )}
          </Box>
        </ImageUploadStyled>
      ) : (
        <DropzoneContainer {...getRootProps()} {...styleProps}>
          <input {...getInputProps()} />
          <DropzoneBox>
            <CloudUploadIcon sx={{ width: 30, height: 30 }} />
            <Typography sx={{ fontSize: fontSize.md }}>
              Drag and drop here to upload
            </Typography>
          </DropzoneBox>
        </DropzoneContainer>
      )}
    </Box>
  );
};

export default ImageUpload;
