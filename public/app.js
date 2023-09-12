document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('results');
  
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const term = document.getElementById('term').value;
      const location = document.getElementById('location').value;
  
      try {
        const response = await fetch(`/api/business/search?term=${term}&location=${location}`);
        const data = await response.json();
  
        if (data.businesses && data.businesses.length > 0) {
          resultsContainer.innerHTML = '';
  
          data.businesses.forEach((business) => {
            const businessCard = document.createElement('div');
            businessCard.classList.add('business-card');
  
            businessCard.innerHTML = `
              <h2>${business.name}</h2>
              <p>${business.location.address1}, ${business.location.city}, ${business.location.state}</p>
              <p>Rating: ${business.rating}</p>
              <p>Phone: ${business.phone}</p>
            `;
  
            resultsContainer.appendChild(businessCard);
          });
        } else {
          resultsContainer.innerHTML = '<p>No results found.</p>';
        }
      } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = '<p>An error occurred.</p>';
      }
    });
  });
  