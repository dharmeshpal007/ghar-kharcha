import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../shared/constants/constants";

export const useGetAllProductsList = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return fetch(`${BASE_URL}/products`).then((res) => res.json());
    },
    select: (data) => data.products,
  });
};
