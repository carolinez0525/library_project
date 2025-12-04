# FrontEnd

## Project Overview
This project aims to develop an efficient Library Management System to manage books, user borrowing records, and library operations. The system will provide an online database management function, supporting user registration, book management, and borrowing management.

## How to Start
1. **Start the Backend**  
   Ensure the backend service is running. If the backend project is on your local machine, follow the instructions in the backend project's `README.md` file to start it.

2. **Install Dependencies**  
   Navigate to the frontend project's root directory in the terminal and run the following command to install dependencies:  
   ```bash
   npm install
   ```
3. **Start the Frontend**
  After installing dependencies, run the following command to start the development server:
   ```bash
   npm run dev
   ```
## Update record
### Version 1.0.0 - Initial Frontend Features Completed
Apr. 3, 2025:

### Account System

1. **User Registration**  
   - Users can register as either a **Reader** or **Librarian**.  
   - Registration requires:  
     - **Username**  
     - **Email**  
     - **Password** (minimum 6 characters)  
     - **Account type selection**

2. **User Login**  
   - Users can log in using their **email** and **password**.  
   - After successful login, users are redirected to their **account dashboard**.  
   - **Logout** functionality is also supported.

---

### 👤 Reader Account Features

3. **Browse Library Collection**  
   - Readers can view information about all books in the collection.

4. **Borrow Available Books**  
   - Readers can borrow books that are not currently borrowed by others.

5. **View Borrowed Books**  
   - Readers can see a list of all the books they have borrowed.  
   - The list includes:  
     - **Status**  
     - **Borrow date**  
     - **Return date**

6. **Update Profile Information**  
   - Readers can update their **email** and **username**.

---

### 👤 Librarian Account Features

7. **Browse Library Collection**  
   - Librarians can view information about all books in the collection.

8. **Add / Remove Books**  
   - Librarians can add new books to the collection.  
   - They can also delete existing books from the collection.

9. **Manage Borrowed Books**  
   - Librarians can view a list of all currently borrowed books.  
   - They can **mark books as returned** directly in the system.

10. **Update Profile Information**  
    - Librarians can update their **email** and **username**.