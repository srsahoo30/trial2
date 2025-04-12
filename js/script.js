document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all coffee items
    const coffeeItems = document.querySelectorAll('.coffee-item');
    coffeeItems.forEach(item => {
        observer.observe(item);
    });
    
    // Mobile menu close on click
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                bsCollapse.hide();
            }
        });
    });
    
    // Load coffee data and setup modals
    fetch('data/coffee-data.json')
        .then(response => response.json())
        .then(data => {
            setupCoffeeModals(data.coffees);
        })
        .catch(error => {
            console.error('Error loading coffee data:', error);
        });
});

function setupCoffeeModals(coffees) {
    const modal = new bootstrap.Modal(document.getElementById('coffeeModal'));
    
    // Add click handlers to all detail buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function() {
            const coffeeId = this.getAttribute('data-coffee-id');
            const coffee = coffees.find(c => c.id === coffeeId);
            
            if (coffee) {
                showCoffeeModal(coffee, modal);
            }
        });
    });
}

function showCoffeeModal(coffee, modal) {
    // Set modal content
    document.getElementById('coffeeModalTitle').textContent = coffee.title;
    document.getElementById('coffeeModalDescription').textContent = coffee.description;
    document.getElementById('coffeeModalPrice').textContent = `$${coffee.price}`;
    
    // Set image
    const modalImage = document.getElementById('coffeeModalImage');
    modalImage.src = `images/${coffee.image}`;
    modalImage.alt = coffee.title;
    
    // Set ingredients
    const ingredientsList = document.getElementById('coffeeModalIngredients');
    ingredientsList.innerHTML = '';
    coffee.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    
    // Show modal
    modal.show();
}