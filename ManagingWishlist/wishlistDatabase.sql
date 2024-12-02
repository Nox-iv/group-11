
CREATE DATABASE wishlist;
  

-- Wishlist Table (stores user's wishlist details)
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    member_id INT,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Wishlist Items Table (stores media added to a user's wishlist)
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    wishlist_id INT,
    wishlist_name VARCHAR(100),
    member_id INT,
    member_name VARCHAR(100),
    media_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


