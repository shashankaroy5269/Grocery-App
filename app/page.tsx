"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { toast } from "react-toastify";

import { useItems } from "../Hooks/useitem";
import { useCart, useCartData } from "../Hooks/useCart";
import { calculateFinalPrice, applyCoupon } from "../Discount/discount";

export default function Page() {
  const { data: items = [] } = useItems();
  const { data: cart = [] } = useCartData();
  const { addItem, decreaseItem, undo } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");


  let filtered = items.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category
      ? item.category === category
      : true;

    return matchSearch && matchCategory;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const { discount, couponDiscount, final } =
    calculateFinalPrice(total, appliedCoupon);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();


    const isValid = applyCoupon(code, total - discount);

    if (isValid > 0) {
      setAppliedCoupon(code);
      toast.success("Coupon Applied");
    } else {
      setAppliedCoupon("");
      toast.error("Invalid Coupon");
    }
  };

  const categories = ["", ...new Set(items.map((i) => i.category))];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🛒 Grocery App</h1>

      <div className={styles.controls}>
        <input
          className={styles.input}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.input}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat || "All Categories"}
            </option>
          ))}
        </select>
        <select
          className={styles.input}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="low">Price Low to High</option>
          <option value="high">Price High to Low</option>
        </select>

        <input
          className={styles.input}
          placeholder="Coupon"
          onChange={(e) => setCoupon(e.target.value)}
        />

        <button onClick={handleApplyCoupon} className={styles.addBtn}>
          Apply
        </button>
      </div>

      <div className={styles.main}>

        <div className={styles.box}>
          <h2>Items</h2>

          {filtered.map((item) => (
            <div key={item.id} className={styles.item}>
              <span>
                {item.name} ({item.category}) - ₹{item.price}
              </span>
              <button onClick={() => addItem(item)}>Add</button>
            </div>
          ))}
        </div>

        <div className={styles.box}>
          <h2>Cart</h2>

          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <span>
                {item.name} - ₹{item.price} × {item.qty}
              </span>

              <div>
                <button onClick={() => addItem(item)}>+</button>
                <button onClick={() => decreaseItem(item.id)}>-</button>
              </div>
            </div>
          ))}

          <button onClick={undo}>Undo</button>

          <hr />
          <p>Total: ₹{total}</p>
          <p>Discount: ₹{discount}</p>
          <p>Coupon: ₹{couponDiscount}</p>
          <h3>Final: ₹{final}</h3>
          <div style={{ marginTop: "10px" }}>
            <h4>Available Coupons</h4>
            <p><b>SAVE10</b> - 10% off</p>
            <p><b>SAVE20</b> - 20% off</p>
            <p><b>SUPER30</b> - 30% off</p>
          </div>
        </div>
      </div>
    </div>
  );
}