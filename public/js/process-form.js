document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect form data
    const formData = {
      name: `${form.firstName.value} ${form.lastName.value}`,
      email: form.email.value,
      subject: form.topic.value, // or rename the select to subject in HTML
      message: form.message.value,
      phone: form.phone.value // if you want to include phone number
    };
    
    // Show loading state
    responseDiv.innerHTML = `<p>Sending your message...</p>`;

    // Send the data to the Netlify Function instead of /contact
    fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if(data.success) {
        responseDiv.innerHTML = `<p class="success">${data.success}</p>`;
        form.reset();
      } else if(data.error) {
        responseDiv.innerHTML = `<p class="error">${data.error}</p>`;
      }
    })
    .catch(error => {
      responseDiv.innerHTML = `<p class="error">An error occurred. Please try again later.</p>`;
      console.error('Error:', error);
    });
  });
});