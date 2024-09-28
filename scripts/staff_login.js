//when user clicks the home button
const handleHomeClickBtn = () => { 
	const btn = document.getElementById('home-btn');
	btn.addEventListener('click', () => {
		window.location.href = '/public/index.html'
	}); 
}
handleHomeClickBtn();

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('staff-login-form');
	const alertDiv = document.getElementById('alertDiv');
	const errorDivMessage = document.getElementById('errorDivMessage');
	
	if(form) {
		form.addEventListener('submit', async (event) => {
			event.preventDefault();
			
			const formData = new FormData(form);
			const dataObject = Object.fromEntries(formData.entries());
			
			try{
				const response = await fetch('/api/staff/login',{
					method: 'POST',
					headers: { 'Content-Type' : 'application/json' },
					body: JSON.stringify(dataObject)
				})
				
				const result = await response.json();
				
				//success
				if(result.success) {
					//redirect to the staff dashboard
					window.location.href = result.redirectUrl;
					alertDiv.style.display = 'none';
				} else {
					 //failed login
                        errorDivMessage.textContent = result.message || 'Login failed';
                        
                        alertDiv.style.display = 'block';
				}
			}catch(error){
				console.error('Error: ', error );
                alert('An error occurred. Please try again later');
			}
		});
	}
});
