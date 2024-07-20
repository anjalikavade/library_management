import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { realtimeDB } from './firebase';
import { ref, onValue, remove } from 'firebase/database';
import './GetBooks.css';

const GetStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const studentsRef = ref(realtimeDB, 'Students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentsArray = [];
      for (let id in data) {
        studentsArray.push({ id, ...data[id] });
      }
      setStudents(studentsArray);
    });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete student"s data')) {
      const studentRef = ref(realtimeDB, `Students/${id}`);
      remove(studentRef)
        .then(() => {
          console.log('Student details removed');
        })
        .catch((err) => {
          console.error('Error deleting student', err);
        });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/edit-student/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/student-details/${id}`);
  };

  return (
    <div>
      <h2>Student's Information</h2>
      <button onClick={() => navigate('/register-student')} className="add-button">Add Student</button>
      <table className="books-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Year</th>
            <th>Allocated Book ISBNs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.id}</td>
              <td>{student.year}</td>
              <td>{student.allocatedBook1} {student.allocatedBook2}</td>
              <td>
                <button onClick={() => handleUpdate(student.id)}>Update</button>
                <button className="delete" onClick={() => handleDelete(student.id)}>Delete</button>
                <button onClick={() => handleDetails(student.id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetStudents;
