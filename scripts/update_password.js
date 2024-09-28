//when user clicks the home button
const handleHomeClickBtn = () => { 
	const btn = document.getElementById('home-btn');
	btn.addEventListener('click', () => {
		window.location.href = '/public/index.html'
	}); 
}
handleHomeClickBtn();

//
document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('password-reset-form');

    if(form){
        form.addEventListener('click',async (event)=>{
            event.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const alertDiv = document.getElementById('alertDiv');
            const errorDivMessage = document.getElementById('errorDivMessage');

            if(newPassword !== confirmNewPassword){
                alertDiv.style.display = 'block';
                errorDivMessage.innerText = 'Passwords do not match';

                return;
            }

            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ newPassword })
            })

            const result = await response.json();
            
            if(result.success){
                alert('Password successfully changed!!')
            } else {
                
            }
        });
    }
});