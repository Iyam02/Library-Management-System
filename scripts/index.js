//when user clicks on the sign Up button
const SignUpButton = () => {
    const signUpElement = document.getElementById('sign-up-btn')
    signUpElement.addEventListener('click', () => {
        window.location.href = '/public/register.html'
    });
};
SignUpButton();

const errorDivMessage = document.getElementById('errorDivMessage');
const alertDiv = document.getElementById('alertDIv')

//Handling the form data
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('login-form');
    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const dataObject = Object.fromEntries(formData.entries());

            try{
                const response = await  fetch('/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/json' },
                    body: JSON.stringify(dataObject)
                });

                const result = await response.json();

                const errorDivMessage = document.getElementById('errorDivMessage');

                 // Handle success
                if (result.success) { 
                    window.location.href = '/public/user_dashboard.html';
                    alertDiv.style.display = 'none';
                } else {
                    // Handle failure
                    errorDivMessage.textContent = result.errors.join(', ');
                    alertDiv.style.display = 'block';
                }
    
            } catch(error){
                if(error) throw new Error(error);
                alert('An error occurred. Please try again later')
            }
        });
    }
});