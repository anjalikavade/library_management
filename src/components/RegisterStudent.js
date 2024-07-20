import React, { useState } from 'react';
import './AddBook.css'; // Assuming you have a CSS file for styling
import { realtimeDB } from './firebase';
import { ref, set } from 'firebase/database';

const RegisterStudent = () => {
  const [student, setStudentData] = useState({
    name: '',
    id: '', // Student ID
    year: '',
    allocatedBook1: '',
    allocatedBook2: '',
    allocatedBook1Date: '',
    allocatedBook2Date: '',
    returnBook1Date: '',
    returnBook2Date: '',
  });

  const changeHandler = (e) => {
    setStudentData({ ...student, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Use the student.id as the key under which the student data is stored
    const studentRef = ref(realtimeDB, `Students/${student.id}`);
    set(studentRef, student)
      .then(() => {
        alert('Student Registered');
        setStudentData({
          name: '',
          id: '',
          year: '',
          allocatedBook1: '',
          allocatedBook2: '',
          allocatedBook1Date: '',
          allocatedBook2Date: '',
          returnBook1Date: '',
          returnBook2Date: '',
        });
      })
      .catch((err) => {
        console.error('Error in adding student: ', err);
      });
  };

  return (
    <div>
      <h2>Register a Student</h2>
      <form onSubmit={submitHandler}>
        <input
          type='text'
          name='name'
          placeholder='Enter the student name'
          onChange={changeHandler}
          value={student.name}
        />
        <br />
        <input
          type='text'
          name='id'
          placeholder='Enter ID'
          onChange={changeHandler}
          value={student.id}
        />
        <br />
        <input
          type='text'
          name='year'
          placeholder='Enter Year'
          onChange={changeHandler}
          value={student.year}
        />
        <br />
        <button type='submit'>Register Student</button>
      </form>
    </div>
  );
};

export default RegisterStudent;
