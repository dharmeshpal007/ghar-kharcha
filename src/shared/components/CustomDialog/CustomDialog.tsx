import { FC } from "react";
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, SxProps } from "@mui/material";
// Components

// Styles

import { colors } from "../../../assets/styles/Owntheme";
import CustomButton from "../Button/customButton";

const Sx = {
  lightPrimaryBtn: {
    backgroundColor: colors.white.main,
    color: colors.primary.main,
    ":hover": {
      backgroundColor: colors.white.main,
      color: colors.primary.main,
    },
  } as SxProps,
};

interface IProps extends DialogProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  footer?: boolean;
  fullWidth?: boolean;
}

const CustomDialog: FC<IProps> = (props) => {
  const { open, children, title, onConfirm, onCancel, disabled, confirmText, cancelText, loading, PaperProps, footer = true, fullWidth = false, ...rest } = props;
  return (
    <Dialog open={open} fullWidth={fullWidth} {...rest} onClose={onCancel} data-testid="dialogBox" PaperProps={{ sx: { ...PaperProps?.sx, borderRadius: "10px" } }}>
      {title && <DialogTitle sx={{ fontSize: "25px", textAlign: "center" }}>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {footer && (
        <DialogActions sx={{ alignSelf: "center", padding: "0 20px 20px" }}>
          <CustomButton text={cancelText || "Cancel"} sx={Sx.lightPrimaryBtn} onClick={onCancel} data-testid="dialogCancelBtn" />
          <CustomButton text={confirmText || "Confirm"} onClick={onConfirm} loading={loading || false} data-testid="dialogConfirmBtn" disabled={disabled || false} />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;
