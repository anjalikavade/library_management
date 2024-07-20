import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { realtimeDB } from './firebase';
import { ref, onValue, remove } from 'firebase/database';
import './GetBooks.css'; // Import the CSS file for styling

const GetBooks = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const booksRef = ref(realtimeDB, 'AddBooks');
    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      const booksArray = [];
      for (let id in data) {
        booksArray.push({ id, ...data[id] });
      }
      setBooks(booksArray);
    });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const bookRef = ref(realtimeDB, `AddBooks/${id}`);
      remove(bookRef)
        .then(() => {
          console.log('Book deleted successfully');
        })
        .catch((err) => {
          console.error('Error deleting book: ', err);
        });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/edit-book/${id}`);
  };
  const handleAdd = () => {
    navigate('/add-books');
  };

  return (
    <div>
      <h2>Books List</h2>
      <button onClick={handleAdd} className="add-button">Add Book</button>
      <table className="books-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ISBN</th>
            <th>Author</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.name}</td>
              <td>{book.isbn}</td>
              <td>{book.author}</td>
              <td>{book.quantity}</td>
              <td>{book.available}</td>
              <td>
                <button onClick={() => handleUpdate(book.id)}>Update</button>
                <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetBooks;
