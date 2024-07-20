// src/components/BorrowedToday.js
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realtimeDB } from './firebase';
import { format } from 'date-fns';
import './BorrowedToday.css'; // Import the CSS file

const BorrowedToday = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooksToday = async () => {
      try {
        const studentsRef = ref(realtimeDB, 'Students');
        const snapshot = await get(studentsRef);

        if (snapshot.exists()) {
          const studentsData = snapshot.val();
          const today = format(new Date(), 'yyyy-MM-dd');
          const borrowedToday = [];

          Object.entries(studentsData).forEach(([studentId, student]) => {
            if (student.allocatedBook1Date === today) {
              borrowedToday.push({ studentId, bookIsbn: student.allocatedBook1, allocatedDate: student.allocatedBook1Date, returnDate: student.returnBook1Date });
            }
            if (student.allocatedBook2Date === today) {
              borrowedToday.push({ studentId, bookIsbn: student.allocatedBook2, allocatedDate: student.allocatedBook2Date, returnDate: student.returnBook2Date });
            }
          });

          setBorrowedBooks(borrowedToday);
        } else {
          setBorrowedBooks([]); // If no data exists, set borrowed books to an empty array
        }
      } catch (error) {
        console.error('Error fetching borrowed books today:', error);
        setBorrowedBooks([]); // Set to an empty array in case of error
      }
    };

    fetchBorrowedBooksToday();
  }, []);

  return (
    <div className="borrowed-today">
      <h2>Borrowed Books Today</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Book ISBN</th>
            <th>Allocated Date</th>
            <th>Return Date</th>
          </tr>
        </thead>
        <tbody>
          {borrowedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.studentId}</td>
              <td>{book.bookIsbn}</td>
              <td>{book.allocatedDate}</td>
              <td>{book.returnDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowedToday;
