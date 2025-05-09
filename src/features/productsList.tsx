import { Chip } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useGetAllProductsList } from "../services/get/useGetAllProductsList";
import CustomLoader from "../shared/components/Loader/loader";

const ProductsList = () => {
  const { data, isLoading } = useGetAllProductsList();

  if (isLoading) {
    <>
      <CustomLoader />
    </>;
  }
  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 20 },
    { field: "title", headerName: "Title", width: 250, sortable: false },
    {
      field: "images",
      headerName: "Image",
      renderCell: (params: GridRenderCellParams) => {
        return <img src={params.value} alt="Product" style={{ width: 50, height: 50 }} />;
      },
    },
    { field: "price", headerName: "Price" },
    { field: "brand", headerName: "Brand" },
    {
      field: "availabilityStatus",
      headerName: "Availability status",
      width: 150,
      renderCell: (params) => {
        return <Chip label={params.row.availabilityStatus} color={params.row.availabilityStatus.toLowerCase() === "low stock" ? "error" : "success"} />;
      },
    },
    { field: "stock", headerName: "Stock Availability" },
    { field: "category", headerName: "Category" },
    { field: "description", headerName: "Description", flex: 1 },
  ];
  return (
    <>
      <h1>Products List</h1>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[15]}
        paginationModel={{
          page: 0,
          pageSize: 10,
        }}
      />
    </>
  );
};

export default ProductsList;
