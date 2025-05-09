import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../shared/constants/constants";
import useBoilerPlateStore from "../../store/store";

const useGetUserDetails = () => {
  const { userData } = useBoilerPlateStore((state) => state);

  const token = userData.accessToken;
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await fetch(`${BASE_URL}/auth/me`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(JSON.stringify({ error: "Failed to fetch user details", status: response.status }));
        }
        return response.json();
      });
    },
    select: (data) => {
      const { firstName, lastName, role, image, gender, email, address } = data;
      return {
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        role,
        image,
        gender,
        email,
        address,
      };
    },
  });
};

export default useGetUserDetails;
