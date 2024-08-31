## React Shopping Website Side Project

## Description

<center><img src="https://github.com/user-attachments/assets/245ba455-630f-44a8-8f63-a2bb1cb2a2f1" width="60%"/></center>

[p-shopping-site-frontend.vercel.app](https://p-shopping-site-frontend.vercel.app/)

### Features

- The homepage displays product carousels and category links, and users can click on the products or categories they are interested in.
- The product page displays all products. In addition to searching for the desired product through the search bar, users can also click on the product category they are interested in from the category bar on the left.
- Each product has its own page, displaying the product name, price and description. Users can click on the heart to collect the products they are interested in and view them on their personal page. After the user clicks on the product quantity and adds it to the shopping cart, the shopping cart list will pop up to inform the user of the currently added products, quantity and total price. In addition, related product recommendations are also provided.
- Modals for user login and registration.
- Users can go to the checkout page to confirm their shopping list, use coupons, and leave recipient information to receive the goods.
- The About page briefly describes the introduction of this shopping website and the types of products sold.

### Tools

- frontend
  - TypeScript
  - React
  - Next.js (Next 14)
  - Tailwind CSS
  - Material Tailwind
  - Axios
- backend
  - Node.js  
  - Express.js
  - MongoDB
  - MongoDB Atlas
  - JWT
  - bcrypt 

## Getting Started

Clone Backend: https://github.com/mollychen7561/p-shoppingSite-backend/

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
(The backend will run on port 5001.)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

📌 Notice
If you want to deploy to vercel and connect to MongoDB Atlas:
1. Go to the setting -> Integrations -> MongoDB Atlas Connect Account of the vercel project.
2. MongoDB Atlas -> Database Access -> Use vercel-admin-user and its password in vercel as the MONGODB_URI of the project environment variable. Remember to add your JWT_SECRET and CORS_ORIGIN (front-end URL).


