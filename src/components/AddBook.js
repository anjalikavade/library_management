import React, { useState } from 'react';
import './AddBook.css';
import { realtimeDB } from './firebase';
import { ref, push } from 'firebase/database';

const AddBook = () => {
  const [Books, setBooksData] = useState({
    name: '',
    quantity: '',
    author: '',
    available:'',
    isbn:'',
  });

  const changeHandler = (e) => {
    setBooksData({ ...Books, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    push(ref(realtimeDB, 'AddBooks'), Books)
      .then(() => {
        alert('Data Posted');
      // Clear the form fields
       setBooksData({
        name: '',
        quantity: '',
        author: '',
        available:'',
        isbn:'',
      });

      })
      .catch((err) => {
        console.error('Error adding book: ', err);
      });
  };

  return (
    <div>
      <h2>Add a new book</h2>
      
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="name"
          placeholder="Enter name of the Book"
          onChange={changeHandler}
          value={Books.name}
        /> <br />
        <input
          type="number"
          name="quantity"
          placeholder="Enter the quantity"
          onChange={changeHandler}
          value={Books.quantity}
        /> <br />
        <input
          type="text"
          name="author"
          placeholder="Enter Author Name"
          onChange={changeHandler}
          value={Books.author}
        /> <br />
        <input
          type="text"
          name="available"
          placeholder="Available Quantity:"
          onChange={changeHandler}
          value={Books.available}
        /> <br />
        <input
          type="text"
          name="isbn"
          placeholder="Enter isbn"
          onChange={changeHandler}
          value={Books.isbn}
        /> <br />
        <button type="submit">Add the Book</button>
      </form>
    </div>
  );
};

export default AddBook;
