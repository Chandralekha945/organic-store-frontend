import { useState } from "react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  const saveProduct = async () => {
    await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    alert("Product Added");
  };

  return (
    <div>
      <h2>Add Product</h2>

      <input
        placeholder="Product Name"
        onChange={(e) =>
          setProduct({
            ...product,
            name: e.target.value
          })
        }
      />

      <input
        placeholder="Price"
        onChange={(e) =>
          setProduct({
            ...product,
            price: e.target.value
          })
        }
      />

      <input
        placeholder="Image URL"
        onChange={(e) =>
          setProduct({
            ...product,
            image: e.target.value
          })
        }
      />

      <button onClick={saveProduct}>
        Add Product
      </button>
    </div>
  );
}