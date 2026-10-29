import assert from "node:assert/strict";
import { test } from "node:test";
import { makeStore } from "../src/store/store.js";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../src/store/cartSlice.js";

const bag = { id: 1, title: "Bag", price: 109.95 };
const shirt = { id: 2, title: "Shirt", price: 9.95 };

test("a new store starts with an empty cart and zero totals", () => {
  const state = makeStore().getState();
  assert.deepEqual(selectCartItems(state), []);
  assert.equal(selectCartCount(state), 0);
  assert.equal(selectCartTotal(state), 0);
});

test("adding the same product merges quantities instead of duplicating rows", () => {
  const store = makeStore();
  store.dispatch(addToCart(bag));
  store.dispatch(addToCart(bag));
  store.dispatch(addToCart(shirt));
  assert.deepEqual(selectCartItems(store.getState()), [
    { ...bag, quantity: 2 }, { ...shirt, quantity: 1 },
  ]);
  assert.equal(selectCartCount(store.getState()), 3);
  assert.equal(selectCartTotal(store.getState()), 229.85);
});

test("repeated additions stop at 10 and a new product starts at 1", () => {
  const store = makeStore();
  store.dispatch(addToCart({ ...bag, quantity: 100 }));
  assert.equal(selectCartCount(store.getState()), 1);
  for (let index = 0; index < 15; index++) store.dispatch(addToCart(bag));
  assert.equal(selectCartItems(store.getState()).length, 1);
  assert.equal(selectCartCount(store.getState()), 10);
  assert.equal(selectCartTotal(store.getState()), 1099.5);
});

test("editing quantities updates both totals and allows adding again below 10", () => {
  const store = makeStore();
  store.dispatch(addToCart(bag));
  store.dispatch(addToCart(shirt));
  store.dispatch(updateQuantity({ productId: bag.id, quantity: 10 }));
  assert.equal(selectCartCount(store.getState()), 11);
  assert.equal(selectCartTotal(store.getState()), 1109.45);
  store.dispatch(updateQuantity({ productId: bag.id, quantity: 1 }));
  assert.equal(selectCartCount(store.getState()), 2);
  store.dispatch(addToCart(bag));
  assert.equal(selectCartItems(store.getState())[0].quantity, 2);
  assert.equal(selectCartTotal(store.getState()), 229.85);
});

test("quantities outside 1–10 and non-integer values cannot change the cart", () => {
  const store = makeStore();
  store.dispatch(addToCart(bag));
  const previousState = store.getState();
  for (const quantity of [0, -1, 11, 1.5, NaN, Infinity, "3", null, undefined]) {
    store.dispatch(updateQuantity({ productId: bag.id, quantity }));
    assert.equal(store.getState(), previousState);
  }
});

test("removing an item removes all its units and updates the totals", () => {
  const store = makeStore();
  store.dispatch(addToCart(bag));
  store.dispatch(addToCart(shirt));
  store.dispatch(updateQuantity({ productId: bag.id, quantity: 5 }));
  store.dispatch(removeFromCart(bag.id));
  assert.deepEqual(selectCartItems(store.getState()), [{ ...shirt, quantity: 1 }]);
  assert.equal(selectCartCount(store.getState()), 1);
  assert.equal(selectCartTotal(store.getState()), 9.95);
  store.dispatch(removeFromCart(shirt.id));
  assert.deepEqual(selectCartItems(store.getState()), []);
  assert.equal(selectCartCount(store.getState()), 0);
  assert.equal(selectCartTotal(store.getState()), 0);
});

test("unknown product IDs cannot change quantities or totals", () => {
  const store = makeStore();
  store.dispatch(addToCart(bag));
  store.dispatch(updateQuantity({ productId: 999, quantity: 5 }));
  store.dispatch(removeFromCart(999));
  assert.deepEqual(selectCartItems(store.getState()), [{ ...bag, quantity: 1 }]);
  assert.equal(selectCartTotal(store.getState()), 109.95);
});

test("price totals avoid floating-point artifacts for cent values", () => {
  const store = makeStore();
  store.dispatch(addToCart({ id: 1, price: 0.1 }));
  store.dispatch(addToCart({ id: 2, price: 0.2 }));
  assert.equal(selectCartTotal(store.getState()), 0.3);
});

test("separate store instances do not share cart state", () => {
  const firstStore = makeStore();
  const secondStore = makeStore();
  firstStore.dispatch(addToCart(bag));
  assert.equal(selectCartCount(firstStore.getState()), 1);
  assert.equal(selectCartCount(secondStore.getState()), 0);
});
