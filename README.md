# GITA Midterm Store

A shopping application built with Next.js and React. Browse products, view product details, manage a Redux cart, and try login and registration through public demo APIs.

## Features

- Product catalog with images, titles, and prices.
- Individual product pages with descriptions and categories.
- Add and remove products from the cart.
- Edit quantities from **1 to 10** per product. Adding the same product increases its quantity up to the limit.
- Redux selectors calculate the total item count and price. The navbar displays the item count, including quantities.
- Login and registration forms built with React Hook Form and Yup.
- Remember me, automatic session restoration, and logout.
- A profile page showing the authenticated user's personal details and address.
- Responsive layouts for desktop and mobile screens.

## Technology

| Purpose | Technology |
| --- | --- |
| Application framework | Next.js 16 App Router |
| UI | React 19, JavaScript |
| Cart state | Redux Toolkit, React Redux |
| Authentication state | React Context |
| Forms and validation | React Hook Form, Yup, `@hookform/resolvers` |
| Styling | Global CSS and CSS Modules |
| Tests | Node.js test runner with mocked requests and browser storage |
| Code checks | ESLint |

## Run locally

Use **Node.js 24** and npm. From the project directory, install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys, environment variables, or database setup are required. Internet access is needed to load products, images, and authentication data. The production build also downloads the Geist fonts from Google Fonts.

If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`, for example `npm.cmd run dev`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Product catalog |
| `/products/[id]` | Product details, for example `/products/1` |
| `/cart` | Cart items, quantities, and totals |
| `/login` | Login form |
| `/register` | Registration form |
| `/profile` | Authenticated user's profile; redirects to login when signed out |

## Demo login

Use this public DummyJSON account on the login page:

| Field | Value |
| --- | --- |
| Username | `emilys` |
| Password | `emilyspass` |

After login, the app opens the profile page. The profile page includes a **Log out** button.

### Remember me

| Selection | Token storage | Requested token lifetime |
| --- | --- | --- |
| Unchecked | `sessionStorage` | 30 minutes |
| Checked | `localStorage` | 7 days |

The app checks the saved token against `/auth/me` when it starts. Valid tokens restore the signed-in user. Expired or rejected tokens are removed, and logout clears both storage locations. Passwords are not stored in browser storage.

### Registration

The registration form requires first name, last name, username, email, password, and password confirmation. Usernames must contain at least 3 characters and no spaces. Passwords must contain at least 8 characters, and confirmation must match.

**DummyJSON simulates registration without saving the new user. Newly submitted accounts cannot log in.** The registration page explains this limitation and displays a confirmation after a successful request. Use an existing DummyJSON demo account to test login. See the [DummyJSON users documentation](https://dummyjson.com/docs/users).

## APIs

| Operation | Endpoint |
| --- | --- |
| List products | `GET https://fakestoreapi.com/products` |
| Product details | `GET https://fakestoreapi.com/products/:id` |
| Login | `POST https://dummyjson.com/auth/login` |
| Authenticated profile | `GET https://dummyjson.com/auth/me` |
| Simulated registration | `POST https://dummyjson.com/users/add` |

Product requests are in `src/components/Products.js`. Authentication and registration requests are in `src/services/users.js`.

The cart is held in memory by Redux. It survives navigation between pages and resets on a full page reload. Remember me applies to authentication only.

## Project structure

```text
src/
  app/                 Pages, root layout, global and page styles
    cart/
    login/
    products/[id]/
    profile/
    register/
  components/          Navbar, footer, product cards, details, and cart button
  context/             Authentication provider and session restoration
  services/            User API requests and token storage helpers
  store/               Redux store, provider, cart actions, and selectors
  validation/          Yup schemas for login and registration
tests/                 Cart, validation, authentication, and storage tests
public/                Static assets
```

Cart actions (`addToCart`, `removeFromCart`, `updateQuantity`) and selectors (`selectCartItems`, `selectCartCount`, `selectCartTotal`) are defined in `src/store/cartSlice.js`. Quantity limits are enforced in the reducers as well as the interface.

## Checks

```bash
npm test
npm run lint
```

Tests cover cart actions and totals, quantity limits, form validation, authentication requests, and token storage across sessions. Requests and storage are mocked, so the tests do not require live API access.

## Production

Build the application, then start the production server:

```bash
npm run build
npm start
```
