import { FC } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { LoadingButtonProps } from "@mui/lab";

interface IProps extends LoadingButtonProps {
  text?: string;
}

const CustomButton: FC<IProps> = (props) => {
  const { text = "Default Text", sx, ...rest } = props;
  return (
    <LoadingButton variant="contained" size="large" sx={{ fontSize: "16px", borderRadius: "24px", textTransform: "none", ...sx }} {...rest}>
      {text}
    </LoadingButton>
  );
};

export default CustomButton;
