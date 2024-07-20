import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { realtimeDB } from './firebase';
import { ref, get, update } from 'firebase/database';

const EditBooks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    name: '',
    quantity: '',
    author: '',
    available: '',
    isbn: '',
  });

  useEffect(() => {
    const bookRef = ref(realtimeDB, `AddBooks/${id}`);
    get(bookRef).then((snapshot) => {
      if (snapshot.exists()) {
        setBook(snapshot.val());
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [id]);

  const changeHandler = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const bookRef = ref(realtimeDB, `AddBooks/${id}`);
    update(bookRef, book).then(() => {
      alert("Book details upadated successfully");
      navigate('/get-books');
    }).catch((err) => {
      console.error('Error updating book: ', err);
    });
  };

  return (
    <div>
      <h2>Edit Book</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="name"
          placeholder="Enter name of the Book"
          onChange={changeHandler}
          value={book.name}
        /> <br />
        <input
          type="number"
          name="quantity"
          placeholder="Enter the quantity"
          onChange={changeHandler}
          value={book.quantity}
        /> <br />
        <input
          type="text"
          name="author"
          placeholder="Enter Author Name"
          onChange={changeHandler}
          value={book.author}
        /> <br />
        <input
          type="text"
          name="available"
          placeholder="Available Quantity:"
          onChange={changeHandler}
          value={book.available}
        /> <br />
        <input
          type="text"
          name="isbn"
          placeholder="Enter ISBN"
          onChange={changeHandler}
          value={book.isbn}
        /> <br />
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBooks;
