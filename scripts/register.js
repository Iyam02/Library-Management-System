//when user clicks the home button
const handleHomeClickBtn = () => { 
	const btn = document.getElementById('home-btn');
	btn.addEventListener('click', () => {
		window.location.href = '/public/index.html'
	}); 
}
handleHomeClickBtn();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const alertDiv = document.getElementById('alertDiv');
    const errorDivMessage = document.getElementById('errorDivMessage');

    if(form){
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            
            const dataObject =  Object.fromEntries(formData.entries());

            try{
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:  JSON.stringify(dataObject)
                });

                const result = await response.json();

                //success
                if(result.success){
                    window.location.href = result.redirectUrl;
                
                    alertDiv.style.display = 'none'
                } else {
                    //failed login
                    errorDivMessage.textContent = result.message || 'There were errrors in your form. Please try again later!';
                    
                    alertDiv.style.display = 'block';

                    //show validation errors
                    if(result.errors){
                        errorDivMessage.innerHTML = '';
                        result.errors.forEach(error => {
                            const li = document.createElement('li');
                            li.textContent = error.msg;
                            errorDivMessage.appendChild(li);
                        });
                    }
                }

            }catch(error){
                console.log('Error: ', error );
                alert('An error occurred. Please try again later');
            }

         });
    }
});
