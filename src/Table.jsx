import { useEffect, useState } from 'react'
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper } from "@mui/material";

const Table = () => {

  const [products, setProducts] = useState([]);

  const handleDelete = async (id) => {
    console.log("Delete product with id:", id);
    // setRows((prev) => prev.filter((row) => row.id !== id));
    // Optionally call backend delete API here:
     await axios.delete(`http://localhost:8082/products/${id}`);
  };

  const columns = [
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'description', headerName: 'Description', width: 130 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'subcategory', headerName: 'Subcategory', width: 130 },
  { field: 'sellerName', headerName: 'Seller Name', width: 130 },
  { field: 'price', headerName: 'Price', type: 'number', width: 130 },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 130 },

    {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        Delete
      </Button>
    ),
  },
];

    const rows = products.map((product) => ({
    id: product.productId,
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    sellerName: product.sellerName,
    price: product.price,
    quantity: product.quantity,
  }));

  const paginationModel = { page: 0, pageSize: 5 };
  
  const getProducts = async (callback) => {
    await axios
      .get("http://localhost:8082/products")
      .then((response) => {
        // Simulate the callback pattern — send data back
        setProducts(response.data);
        console.log("Products fetched:", response.data);
        //callback(null, response.data);
      })
      .catch((error) => {
        // Send error through callback
        console.log("Error fetching products:", error);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div style = {{ border: '3px solid #0059dfff', padding: '5px', margin: '5px' }}>
      <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
      </div>
  )
}
export default Table;