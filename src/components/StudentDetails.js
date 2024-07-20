import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { realtimeDB } from './firebase';
import { ref, get, update } from 'firebase/database';
import { format } from 'date-fns';

const StudentDetails = () => {
  const { id } = useParams(); // Get the student ID from URL params
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [isbn, setIsbn] = useState('');
  useEffect(() => {
    if (id) {
      const studentRef = ref(realtimeDB, `Students/${id}`);
      get(studentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setStudent(snapshot.val());
          } else {
            console.log('No student found with ID:', id);
            alert('No student found');
          }
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
        });
    } else {
      console.error('Student ID is missing from URL parameters');
    }
  }, [id]);
  
  const handleAllocate = () => {
    if (isbn) {
      if (!student.allocatedBook1 || !student.allocatedBook2) {
        const booksRef = ref(realtimeDB, 'AddBooks');
        get(booksRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let bookKey = null;
              snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().isbn === isbn) {
                  bookKey = childSnapshot.key; // Store the key of the book being allocated
                }
              });

              if (bookKey) {
                const bookRef = ref(realtimeDB, `AddBooks/${bookKey}`);
                return get(bookRef).then((bookSnapshot) => {
                  if (bookSnapshot.exists() && parseInt(bookSnapshot.val().available) > 0) {
                    const currentDate = new Date();
                    const allocationDate = format(currentDate, 'yyyy-MM-dd');
                    const returnDate = format(new Date(currentDate.setDate(currentDate.getDate() + 10)), 'yyyy-MM-dd');

                    const updatedStudent = {
                      ...student,
                      allocatedBook1: student.allocatedBook1 || isbn,
                      allocatedBook1Date: student.allocatedBook1 ? student.allocatedBook1Date : allocationDate,
                      returnBook1Date: student.allocatedBook1 ? student.returnBook1Date : returnDate,
                      allocatedBook2: student.allocatedBook1 ? (student.allocatedBook2 || isbn) : student.allocatedBook2,
                      allocatedBook2Date: student.allocatedBook1 ? (student.allocatedBook2 ? student.allocatedBook2Date : allocationDate) : student.allocatedBook2Date,
                      returnBook2Date: student.allocatedBook1 ? (student.allocatedBook2 ? student.returnBook2Date : returnDate) : student.returnBook2Date,
                    };

                    const updatedBookData = {
                      ...bookSnapshot.val(),
                      available: (parseInt(bookSnapshot.val().available) - 1).toString(),
                    };

                    Promise.all([
                      update(ref(realtimeDB, `Students/${id}`), updatedStudent),
                      update(bookRef, updatedBookData),
                    ])
                      .then(() => {
                        alert('Book allocated successfully');
                        setStudent(updatedStudent);
                        setIsbn('');
                      })
                      .catch((error) => {
                        console.error('Error allocating book:', error);
                      });
                  } else {
                    alert('No available quantity for this book or book not found');
                  }
                }).catch((error) => {
                  console.error('Error fetching book data:', error);
                });
              } else {
                alert('Book not found in the database');
              }
            } else {
              alert('No books available in the database');
            }
          })
          .catch((error) => {
            console.error('Error fetching book data:', error);
          });
      } else {
        alert('Student already has 2 books allocated');
      }
    } else {
      alert('ISBN is required');
    }
  };

  const handleDeallocate = (isbn) => {
    console.log("Attempting to deallocate book with ISBN:", isbn); // Log ISBN
  
    if (isbn) {
      // Locate the book in the database
      const bookRef = ref(realtimeDB, 'AddBooks');
      get(bookRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let bookKey = null;
            snapshot.forEach((childSnapshot) => {
              const bookData = childSnapshot.val();
              console.log("Book in database:", bookData); // Log book data
              if (bookData.isbn === isbn) {
                bookKey = childSnapshot.key; // Store the key of the book being deallocated
              }
            });
  
            if (bookKey) {
              const bookRef = ref(realtimeDB, `AddBooks/${bookKey}`);
              get(bookRef)
                .then((bookSnapshot) => {
                  if (bookSnapshot.exists()) {
                    const book = bookSnapshot.val();
                    const updatedStudent = {
                      ...student,
                      allocatedBook1: student.allocatedBook1 === isbn ? '' : student.allocatedBook1,
                      allocatedBook1Date: student.allocatedBook1 === isbn ? '' : student.allocatedBook1Date,
                      returnBook1Date: student.allocatedBook1 === isbn ? '' : student.returnBook1Date,
                      allocatedBook2: student.allocatedBook2 === isbn ? '' : student.allocatedBook2,
                      allocatedBook2Date: student.allocatedBook2 === isbn ? '' : student.allocatedBook2Date,
                      returnBook2Date: student.allocatedBook2 === isbn ? '' : student.returnBook2Date,
                    };
  
                    const updatedBookData = {
                      ...book,
                      available: (parseInt(book.available) + 1).toString(),
                    };
  
                    Promise.all([
                      update(ref(realtimeDB, `Students/${id}`), updatedStudent),
                      update(bookRef, updatedBookData),
                    ])
                      .then(() => {
                        alert('Book deallocated successfully');
                        setStudent(updatedStudent);
                      })
                      .catch((error) => {
                        console.error('Error deallocating book:', error);
                      });
                  } else {
                    alert('Book not found in the database');
                  }
                })
                .catch((error) => {
                  console.error('Error fetching book data:', error);
                });
            } else {
              alert('Book not found in the database');
            }
          } else {
            alert('No books available in the database');
          }
        })
        .catch((error) => {
          console.error('Error fetching book data:', error);
        });
    } else {
      alert('Invalid ISBN');
    }
  };
  
  return (
    <div>
      <h2>Student Details - {student.name}</h2>
      <div>
        <h3>Allocated Books</h3>
        <div>
          <div>
            <p>Book 1: {student.allocatedBook1}</p>
            <p>Allocated Date: {student.allocatedBook1Date}</p>
            <p>Return Date: {student.returnBook1Date}</p>
            {student.allocatedBook1 && (
              <button onClick={() => handleDeallocate(student.allocatedBook1)}>Deallocate Book 1</button>
            )}
          </div>
          <div>
            <p>Book 2: {student.allocatedBook2}</p>
            <p>Allocated Date: {student.allocatedBook2Date}</p>
            <p>Return Date: {student.returnBook2Date}</p>
            {student.allocatedBook2 && (
              <button onClick={() => handleDeallocate(student.allocatedBook2)}>Deallocate Book 2</button> // Ensure you have stored the bookKey as allocatedBook2Key
            )}
          </div>
        </div>
      </div>
      <div>
        <h3>Allocate Book</h3>
        <input
          type="text"
          placeholder="Enter Book ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <button onClick={handleAllocate}>Allocate Book</button>
      </div>
      <button onClick={() => navigate('/get-students')}>Back to Students</button>
    </div>
  );
};
export default StudentDetails;
