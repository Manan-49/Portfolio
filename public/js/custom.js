// Portfolio filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Get all portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add click event listener to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    // Show all items
                    item.style.display = 'block';
                    // Add animation
                    setTimeout(() => {
                        item.classList.remove('hidden');
                    }, 10);
                } else {
                    // Show only items with matching category
                    if (item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        // Add animation
                        setTimeout(() => {
                            item.classList.remove('hidden');
                        }, 10);
                    } else {
                        // Hide items that don't match
                        item.classList.add('hidden');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400);
                    }
                }
            });
        });
    });
});