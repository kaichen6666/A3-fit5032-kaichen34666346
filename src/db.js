// src/db.js

// 
export const adminUsers = [{ username: 'admin', password: 'Admin123!' }]

// 
export const normalUsers = [
  { username: 'user1', password: 'User123!' },
  { username: 'user2', password: 'User234!' } 
]

// 
export const reviews = []

// 
const savedReviews = localStorage.getItem('reviews')
if (savedReviews) {
  reviews.push(...JSON.parse(savedReviews))
}