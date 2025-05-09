import { Logout } from "@mui/icons-material";
import { Box, MenuItem, Typography } from "@mui/material";
import { FC, useState } from "react";
import CustomDialog from "../shared/components/CustomDialog/CustomDialog";
import { INITIAL_MODAL_STATE } from "../shared/constants/constants";
import { Modal } from "../shared/constants/enum";
import useBoilerPlateStore from "../store/store";
import * as Sx from "./LayoutHeader.style";

export interface IModalState {
  open: boolean;
  type: string;
}
interface IProps {
  isDrawerOpen: boolean;
}

const LayoutHeader: FC<IProps> = ({ isDrawerOpen }) => {
  const { onLogout } = useBoilerPlateStore((state) => state);

  const [modalState, setModalState] = useState<IModalState>(INITIAL_MODAL_STATE);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const handleLogout = () => {
    setActionLoading(false);
    onLogout();
    setModalState(INITIAL_MODAL_STATE);
  };

  return (
    <Box sx={Sx.layoutNavbarRoot}>
      <Box>
        {!isDrawerOpen && (
          <Typography sx={{ height: "30px" }} fontWeight={"bold"}>
            BIG LOGO
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Box sx={Sx.infoRoot} data-testid="userInfo">
          <MenuItem data-testid="actionItem" sx={Sx.menuItem} onClick={() => setModalState({ open: true, type: Modal.Logout })}>
            <Logout sx={{ ...Sx.icon, marginRight: "5px" }} />
            Logout
          </MenuItem>
        </Box>
      </Box>
      {modalState.open && (
        <>
          {modalState.type === Modal.Logout && (
            <CustomDialog loading={actionLoading} open={modalState.open} onConfirm={handleLogout} onCancel={() => setModalState(INITIAL_MODAL_STATE)}>
              <Typography textAlign="center">Are you sure you want to Logout ?</Typography>
            </CustomDialog>
          )}
        </>
      )}
    </Box>
  );
};

export default LayoutHeader;
