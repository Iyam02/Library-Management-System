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

//Display user's name
document.addEventListener('DOMContentLoaded', async () => {
    const userFullName = document.getElementById('user-name');

    try{
        const response = await fetch('/api/getUser-name', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result = await response.json();
        if(result.success){
            userFullName.textContent = result.name
        } else {
            userFullName.textContent = 'User'
        }

    } catch(error){
        console.error('Error: ', error)
        userFullName.textContent = 'User'
    }
});

//Display borrowed books
document.addEventListener('DOMContentLoaded', async () => {
    const borrowedBooksTableBody = document.getElementById('borrowed-books-table');

    try{
        const response = await fetch('/api/get-borrowed-books', {
            method: 'GET',
            headers: { 'Content-Type' : 'application/json' }
        })

        const result = await response.json();

        if(result.success){
            const borrowedBooks = result.data;
            borrowedBooks.forEach(book => {
                const badgeClass = book.status === 'Due Soon' ? 'bg-warning' : 'bg-success';

                const row = document.createElement('tr');

                row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.borrow_date}</td>
                        <td>${book.return_date}</td>
                        <td><span class="badge ${badgeClass}">${book.status}</span></td>
                `;
                borrowedBooksTableBody.appendChild(row);
            })
        } else {
            borrowedBooksTableBody.innerHTML = `<tr><td>${result.message}</td></tr>`;
        }
    }catch(err){
        
        borrowedBooksTableBody.innerHTML = `<tr><td>Error Loading borrowed books </td></tr>`
    }
});

//Display the modal 
document.getElementById('update-user-contact-details').addEventListener('click', async (event) => {
    event.preventDefault();

    //show the modal
    const modal = new bootstrap.Modal(document.getElementById('update-details-modal'));
    modal.show();
}); 

//Update the user's info
document.getElementById('save-contact-details').document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();

    const updateContactForm = document.getElementById('update-contact-form');

    const form = new FormData(updateContactForm);
    const dataObject = Object.fromEntries(form.entries());

    try{
        const response = await fetch('/api/update-contact-details', {
            method: 'PUT',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(dataObject)
        })

        const result = await response.json();
        if(result.success){
            alert(`${result.message}`);
        } else {
            alert( `${result.message}`)
        }
    }catch(err){
        console.error('Error:', err);
        alert('An error occurred while updating details. Please try again later.');
    }
});