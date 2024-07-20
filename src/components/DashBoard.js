// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { realtimeDB } from './firebase';
import './DashBoard.css'; // Assuming you have a CSS file for styling
import { format } from 'date-fns';

const Dashboard = ({ onLogout }) => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalBookQuantity, setTotalBookQuantity] = useState(0);
  const [borrowedToday, setBorrowedToday] = useState(0);
  const [pendingReturnsToday, setPendingReturnsToday] = useState(0);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const studentsRef = ref(realtimeDB, 'Students');
        const snapshot = await get(studentsRef);

        if (snapshot.exists()) {
          const studentsData = snapshot.val();
          const total = Object.keys(studentsData).length; // Count the number of student nodes
          setTotalStudents(total);
        } else {
          setTotalStudents(0); // If no data exists, set total students to 0
        }
      } catch (error) {
        console.error('Error fetching total students:', error);
        setTotalStudents(0); // Set to 0 in case of error
      }
    };

    const fetchTotalBooks = async () => {
      try {
        const booksRef = ref(realtimeDB, 'AddBooks');
        const snapshot = await get(booksRef);

        if (snapshot.exists()) {
          const booksData = snapshot.val();
          const totalBooks = Object.keys(booksData).length; // Count the number of book nodes
          const totalQuantity = Object.values(booksData).reduce((sum, book) => sum + parseInt(book.quantity), 0); // Sum up all the quantities
          setTotalBooks(totalBooks);
          setTotalBookQuantity(totalQuantity);
        } else {
          setTotalBooks(0); // If no data exists, set total books to 0
          setTotalBookQuantity(0); // If no data exists, set total book quantity to 0
        }
      } catch (error) {
        console.error('Error fetching total books:', error);
        setTotalBooks(0); // Set to 0 in case of error
        setTotalBookQuantity(0); // Set to 0 in case of error
      }
    };

    const fetchBorrowedToday = async () => {
      try {
        const studentsRef = ref(realtimeDB, 'Students');
        const snapshot = await get(studentsRef);

        if (snapshot.exists()) {
          const studentsData = snapshot.val();
          const today = format(new Date(), 'yyyy-MM-dd');
          let borrowedCount = 0;

          Object.values(studentsData).forEach((student) => {
            if (student.allocatedBook1Date === today) borrowedCount += 1;
            if (student.allocatedBook2Date === today) borrowedCount += 1;
          });

          setBorrowedToday(borrowedCount);
        } else {
          setBorrowedToday(0); // If no data exists, set borrowed books to 0
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
        setBorrowedToday(0); // Set to 0 in case of error
      }
    };

    const fetchPendingReturnsToday = async () => {
      try {
        const studentsRef = ref(realtimeDB, 'Students');
        const snapshot = await get(studentsRef);

        if (snapshot.exists()) {
          const studentsData = snapshot.val();
          const today = format(new Date(), 'yyyy-MM-dd');
          let pendingCount = 0;

          Object.values(studentsData).forEach((student) => {
            if (student.returnBook1Date === today) pendingCount += 1;
            if (student.returnBook2Date === today) pendingCount += 1;
          });

          setPendingReturnsToday(pendingCount);
        } else {
          setPendingReturnsToday(0); // If no data exists, set pending returns to 0
        }
      } catch (error) {
        console.error('Error fetching pending returns:', error);
        setPendingReturnsToday(0); // Set to 0 in case of error
      }
    };

    fetchTotalStudents();
    fetchTotalBooks();
    fetchBorrowedToday();
    fetchPendingReturnsToday();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>Welcome to the Library Management System</h1>
      </div>
      <div className="dashboard-boxes">
        <div className="dashboard-box">
          <h2>Total Books In Library</h2>
          <p>{totalBookQuantity}</p>
          <Link to="/get-books">More Info</Link>
        </div>
        <div className="dashboard-box">
          <h2>Registered Students</h2>
          <p>{totalStudents}</p>
          <Link to="/get-students">More Info</Link>
        </div>
        <div className="dashboard-box">
          <h2>Borrowed  Today</h2>
          <p>{borrowedToday}</p>
          <Link to="/borrowed-today">More Info</Link>
        </div>
        <div className="dashboard-box">
          <h2>Pending Returns Today</h2>
          <p>{pendingReturnsToday}</p>
          <Link to="/pending-returns-today">More Info</Link>
        </div>
      </div>
      <button onClick={onLogout} className="logout-button"> Logout</button>
    </div>
    
  );
};

export default Dashboard;
