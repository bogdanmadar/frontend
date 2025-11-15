import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import Table from "./Table.jsx";
import "./App.css";

const App = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    sellerName: "",
    price: "",
    quantity: "",
  });

  return (
    <div className="card-container">
      <h2>Bine ai venit in magazinul nostru online!</h2>

      <Table />

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Subcategory"
            fullWidth
            value={newProduct.subcategory}
            onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Seller Name"
            fullWidth
            value={newProduct.sellerName}
            onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              try {
                await fetch("http://localhost:8082/products", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newProduct),
                });
                setOpenAdd(false);
                setNewProduct({
                  name: "",
                  description: "",
                  category: "",
                  subcategory: "",
                  sellerName: "",
                  price: "",
                  quantity: "",
                });
                // Optionally refresh table data by calling a method in Table
                window.location.reload(); // quick and simple way
              } catch (err) {
                console.error("Add product failed:", err);
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenAdd(true)}
        style={{ marginBottom: "20px" }}
      >
        Add New Product
      </Button>

    </div>
  );
};

export default App;
