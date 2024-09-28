
//Log out
const handleLogOut =  async () => {
    const logOut = document.getElementById('log-out');
    logOut.addEventListener('click', async ()=> {
        try{
            const response = await fetch('/api/user/logout',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            const result = await response.json();
            
            if(result.success){
                window.location.href = result.redirectUrl
            } else {
                console.error('Logout error:', error);
            }
        } catch(error) {
            console.error('Logout error');

        }
    });
}
handleLogOut();

//Display the admin's name
document.addEventListener('DOMContentLoaded', async () => {
    const adminName = document.getElementById('admin-name');

    try{
        const response = await fetch('/api/getAdmin-name', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' }
        })

        const result = await response.json();
        
        if(result.success) {
            adminName.textContent = result.name
        } else {
            adminName.textContent = 'Admin'
        }
    }catch(error){
        console.error('Error: ', error)
        adminName.textContent = 'Admin'
    }
});

//hides all tables
const hideAllTables = () => {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => `${table.style.display = 'none'}`);
}

//Display books 
const displayBooks = async () => {
    hideAllTables();
    const booksTable = document.getElementById('books-table');
    const booksTableBody = booksTable.querySelector('tbody');

    booksTable.style.display = 'table';

    //fetch books from the server
    try{
        const response = await fetch('/api/get-books', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' }
        })

        const result = await response.json();
        booksTableBody.innerHTML = '';

        if(result.success){
            const books = result.data;
            books.forEach(book => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.book_no}</td>
                    <td>${book.published_year}</td>
                    <td>${book.genre}</td>
                    <td>${book.available_copies}</td>
                `;
                
                booksTableBody.appendChild(row)
            });
        } else {
            booksTableBody.innerHTML = `<tr><td>${result.message}</td></tr>`;
        }
    }catch(err){
        console.error('Error fetching books', err)
        booksTableBody.innerHTML =  `<tr><td colspan="5">No books found</td></tr>`;
    }
}
//event listener for displaying the books table
document.getElementById('display-books').addEventListener('click', displayBooks);


//Display members
const displayMembers = async () => {
    hideAllTables();
    const membersTable = document.getElementById('members-table');
    const membersTableBody = membersTable.querySelector('tbody');

    membersTable.style.display = 'table';

    //fetch members from the server
    try{
        const response = await fetch('/api/get-members', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' }
        })

        const result = await response.json();
        membersTableBody.innerHTML = '';

        if(result.success){
            const members = result.data;
            members.forEach(member => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.mobile}</td>
                `;

                membersTableBody.appendChild(row)
            });
        } else {
            membersTableBody.innerHTML = `<tr><td colspan='3'>${result.message}</td></tr>`;
        }
    }catch(err){
        console.error('Error fetching members: ', err)
        membersTableBody.innerHTML = `<tr><td colspan='3'>No members found</td></tr>`;
    }
}
//event listener for displaying member
document.getElementById('display-members').addEventListener('click', displayMembers);

//get the total number of members
document.addEventListener('DOMContentLoaded', async () => {
    const activeMembers = document.getElementById('active-members');

    try{
        const response = await fetch('/api/total-members', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json'}
        })

        const result = await response.json();
        
        if(result.success){
            activeMembers.textContent = `${result.totalMembers}`
        } else {
            activeMembers.textContent = `${result.message}`
        }
    }catch(err){
        console.error('Error: ', err);
        activeMembers.textContent = 'Error'
    }
});

//get the total number of books
document.addEventListener('DOMContentLoaded', async () => {
    const totalBooks = document.getElementById('total-books');

    try{
        const response = await fetch('/api/total-books', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' }
        })

        const result = await response.json();
        
        if(result.success){
            totalBooks.textContent = `${result.totalBooks}`
        } else {
            totalBooks.textContent = `${result.message}`
        }
    }catch(err){
        console.error('Error: ', err);
        totalBooks.textContent = 'Error'
    }
});