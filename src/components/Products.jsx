import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ category, filters, sort }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products${
            category ? `?category=${category}` : ""
          }`
        );
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, [category]);
console.log(filterProducts)
  useEffect(() => {
    if (category) {
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(
            ([key, value]) => item[key]?.includes(value) // Use optional chaining to avoid errors
          )
        )
      );
    }
  }, [category, filters, products]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts(
        (prev) =>
          [...prev].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ) // Ensure correct date comparison
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else if (sort === "desc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]); // Add `sort` as a dependency to ensure it runs when sort changes

  return (
    <Container>
      {category
        ? filterProducts.map((item) => <Product {...item} key={item.id} />)
        : products
            .slice(0, 4)
            .map((item) => <Product {...item} key={item.id} />)}
    </Container>
  );
};

export default Products;
