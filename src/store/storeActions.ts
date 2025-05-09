interface BoilerPlateState {
  loggedIn: boolean;
  userData: {
    accessToken: string;
    refreshToken: string;
    username: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
  };
}
const INITIAL_STATE = {
  loggedIn: false,
  userData: {
    accessToken: "",
    refreshToken: "",
    username: "",
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    gender: "",
    image: "",
  },
};

const boilerPlateStore = (set: (fn: (state: BoilerPlateState) => BoilerPlateState) => void) => ({
  ...INITIAL_STATE,
  setUserData: (data: Partial<BoilerPlateState["userData"]>) =>
    set((state: BoilerPlateState) => {
      return {
        ...state,
        userData: {
          ...state.userData,
          ...data,
        },
      };
    }),
  setLoggedIn: (isLoginValue: boolean) =>
    set((state: BoilerPlateState) => ({
      ...state,
      loggedIn: isLoginValue,
    })),
  onLogout: () => {
    set(() => ({ ...INITIAL_STATE }));
  },
});
export default boilerPlateStore;
