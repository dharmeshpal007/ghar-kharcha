import { useMutation } from "@tanstack/react-query";
import useBoilerPlateStore from "../../store/store";
import { useSnackbar } from "notistack";
import { BASE_URL } from "../../shared/constants/constants";

const useGetLogin = () => {
  const { setLoggedIn, setUserData } = useBoilerPlateStore((state) => state);
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (config: { username: string; password: string }) => {
      return await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...config,
          expiresInMins: 28500,
        }),
      }).then((res) => res.json());
    },
    onSuccess: (res) => {
      if (res.message) {
        enqueueSnackbar(`${res.message || "Something went wrong!"} `, {
          variant: "error",
          autoHideDuration: 3000,
        });
      } else {
        setUserData({ ...res, fullName: res.firstName + " " + res.lastName });
        setLoggedIn(true);
        enqueueSnackbar("Login successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`${err.message || "Something went wrong!"}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    },
    mutationKey: ["login"],
  });
};

export default useGetLogin;
