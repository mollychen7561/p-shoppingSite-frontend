## Next.js Shopping Website Side Project



## Description

This frontend project provides users with e-commerce experience, including product browsing, shopping cart management,  and order placement. Built with Next.js and React, it ensures excellent performance and user experience. Additionally, by utilizing Tailwind CSS and Material-Tailwind, the project achieves an aesthetically pleasing and consistent user interface design.
<center><img src="https://github.com/user-attachments/assets/245ba455-630f-44a8-8f63-a2bb1cb2a2f1" width="60%"/></center>

## Features
- The homepage displays product carousels and category links, and users can click on the products or categories they are interested in.
- The product page displays all products. Users can search for the desired product using the search bar or click on a product category from the category bar on the left to filter the products.
- Each product has its own page that shows the product name, price, and description. Users can click the “Heart” icon to save products they are interested in and view them on their personal page. After selecting the quantity and adding the product to the shopping cart, users can open the shopping cart page to view the products they have added, along with the quantity and total price. Additionally, relevant product recommendations are provided.
- Modals for user login and registration are available.
- Users can proceed to the checkout page to confirm their shopping list, apply coupons, and provide recipient information for delivery.
- The About page briefly describes this shopping website and the types of products it offers.
- The website is built with responsive design, ensuring a seamless experience across devices of all sizes, whether on mobile, tablet, or desktop.

https://github.com/user-attachments/assets/22b943a6-992c-41f5-a699-f1376085a576

## Demo Link
> Vercel Link: [p-shopping-site-frontend.vercel.app](https://p-shopping-site-frontend.vercel.app/)

## Product Data Source
https://fakestoreapi.com/

## Tools
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

Clone this repository and Backend: https://github.com/mollychen7561/p-shoppingSite-backend/

Both run the development CLI:

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

### 📌 Notice
If you want to deploy to vercel and connect to MongoDB Atlas:
1. The frontend and backend may need to be deployed separately, as deploying them together often results in failure for me.
2. Go to backend project setting -> Integrations -> MongoDB Atlas Connect Account of the vercel project.
3. Go to MongoDB Atlas -> Database Access -> Use vercel-admin-user and its password in vercel as the MONGODB_URI of the project environment variable. Remember to add your JWT_SECRET and CORS_ORIGIN (front-end URL).


