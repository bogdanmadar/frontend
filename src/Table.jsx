import {useEffect, useState} from "react";
import axios from "axios";
import "./Table.css";
import {DataGrid} from "@mui/x-data-grid";
import {Button, Paper, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";

const Table = () => {
    const backendAPI = "http://localhost:8082/products";
    const [products, setProducts] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

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

    //Edit dialog state
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        name: "",
        description: "",
        category: "",
        subcategory: "",
        sellerName: "",
        price: "",
        quantity: "",
    });

    //Fetch all products
    const getProducts = async () => {
        try {
            const response = await axios.get(backendAPI);
            setProducts(response.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    //Delete product
    const deleteProduct = async (id) => {
        try {
            await axios.delete(backendAPI + `/${id}`);
            await getProducts();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    //Open Edit dialog
    const getProductDetails = (row) => {
        setEditData({
            id: row.id,
            name: row.name,
            description: row.description,
            category: row.category,
            subcategory: row.subcategory,
            sellerName: row.sellerName,
            price: row.price,
            quantity: row.quantity,
        });
        setOpenEdit(true);
    };

    //Save edited product
    const updateProduct = async () => {
        try {
            await axios.put(backendAPI + `/${editData.id}`, editData);
            setOpenEdit(false);
            getProducts();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update product");
        }
    };

    //Search products
    const searchProduct = async () => {
        try {
            let response;
            if (searchName && !minPrice && !maxPrice) {
                response = await axios.get(backendAPI + `/name/${searchName}`);
            } else if (!searchName && (minPrice || maxPrice)) {
                const min = minPrice || 0;
                const max = maxPrice || 9999999;
                response = await axios.get(backendAPI + `/price`, {
                    params: {min, max},
                });
            } else if (searchName && (minPrice || maxPrice)) {
                const nameResponse = await axios.get(backendAPI + `/name/${searchName}`);
                const min = minPrice || 0;
                const max = maxPrice || 9999999;
                response = {
                    data: nameResponse.data.filter((p) => p.price >= min && p.price <= max),
                };
            } else {
                response = await axios.get(backendAPI);
            }
            setProducts(response.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    const columns = [
        {field: "name", headerName: "Name", width: 130},
        {field: "description", headerName: "Description", width: 130},
        {field: "category", headerName: "Category", width: 130},
        {field: "subcategory", headerName: "Subcategory", width: 130},
        {field: "sellerName", headerName: "Seller Name", width: 130},
        {field: "price", headerName: "Price", width: 130},
        {field: "quantity", headerName: "Quantity", width: 130},
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{marginRight: 8}}
                        onClick={() => getProductDetails(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteProduct(params.row.id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    //Map rows
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

    return (
        <div>
            <div style={{padding: 5, margin: 5}}>
                <Box sx={{width: "100%"}}>

                    <Box sx={{display: "flex", gap: 2, mb: 2}}>
                        <TextField
                            label="Search product name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <TextField
                            label="Min price"
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <TextField
                            label="Max price"
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <Button variant="contained" onClick={searchProduct}>
                            Search
                        </Button>
                    </Box>

                    <Paper sx={{height: 500, width: "100%"}}>
                        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10]}/>
                    </Paper>
                </Box>

                <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Name"
                            fullWidth
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            value={editData.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            fullWidth
                            value={editData.category}
                            onChange={(e) => setEditData({...editData, category: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Subcategory"
                            fullWidth
                            value={editData.subcategory}
                            onChange={(e) => setEditData({...editData, subcategory: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Seller Name"
                            fullWidth
                            value={editData.sellerName}
                            onChange={(e) => setEditData({...editData, sellerName: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            type="number"
                            fullWidth
                            value={editData.price}
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={editData.quantity}
                            onChange={(e) => setEditData({...editData, quantity: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                        <Button variant="contained" onClick={updateProduct}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div>
                <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Name"
                            fullWidth
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            fullWidth
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Subcategory"
                            fullWidth
                            value={newProduct.subcategory}
                            onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Seller Name"
                            fullWidth
                            value={newProduct.sellerName}
                            onChange={(e) => setNewProduct({...newProduct, sellerName: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Price"
                            type="number"
                            fullWidth
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                        <TextField
                            margin="dense"
                            label="Quantity"
                            type="number"
                            fullWidth
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={async () => {
                                try {
                                    await fetch(backendAPI, {
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"},
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
                                    await getProducts();
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
                    style={{marginBottom: "20px"}}
                >
                    Add New Product
                </Button>
            </div>
        </div>
    );
};

export default Table;
