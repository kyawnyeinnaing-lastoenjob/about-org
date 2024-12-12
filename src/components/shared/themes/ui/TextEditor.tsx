"use client";
import dynamic from "next/dynamic";

import styled from "@emotion/styled";
import { FormHelperText } from "@mui/material";

import "react-quill-new/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

const Quill = dynamic(
  async () => {
    const { default: ReactQuill } = await import("react-quill-new");

    return ReactQuill;
  },
  { ssr: false },
);

interface RTEEditorProps {
  value: string;
  height?: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const toolbarOptions = {
  container: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "formula"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ],
};

const ReactQuillStyled = styled(Quill)<{ height: string }>(({ height }) => ({
  borderRadius: "8px",
  "& .ql-editor": {
    height,
  },
  "& .ql-toolbar": {
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  "& .ql-container": {
    height: "auto",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  },
}));

const RTEEditor: React.FC<RTEEditorProps> = ({
  value,
  height = "125px",
  onChange,
  error,
  helperText,
}) => {
  return (
    <>
      <ReactQuillStyled
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: toolbarOptions,
        }}
        height={height}
      />
      <FormHelperText
        sx={{ marginLeft: "14px", marginTop: "3px" }}
        error={error}
      >
        {helperText}
      </FormHelperText>
    </>
  );
};

export default RTEEditor;
