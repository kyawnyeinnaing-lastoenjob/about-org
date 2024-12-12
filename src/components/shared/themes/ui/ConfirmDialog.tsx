import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  setOpen: (arg: boolean) => void;
  onClick: (id?: string) => void;
}

const ConfirmDialog: React.FC<Props> = ({ open, setOpen, onClick }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    onClick();
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete
        </DialogTitle>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ConfirmDialog;
