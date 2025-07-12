const app = document.getElementById('app');

const renderWelcome = () => {
    app.innerHTML = `
        <div class="welcome-container">
            <h2>Welcome to the Future of APIs</h2>
            <p>This is your modern, interactive frontend for your GraphQL project. Explore the possibilities.</p>
            <button class="cta-button">Get Started</button>
        </div>
    `;

    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', () => {
        console.log('Get Started button clicked!');
        alert('Get Started button clicked!');
    });
};

const setupNavListeners = () => {
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(`${link.textContent} link clicked!`);
            alert(`${link.textContent} link clicked!`);
        });
    });
};

renderWelcome();
setupNavListeners();
