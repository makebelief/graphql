const app = document.getElementById('app');

const renderWelcome = () => {
    app.innerHTML = `
        <div class="welcome-container">
            <h2>Welcome to the Future of APIs</h2>
            <p>This is your modern, interactive frontend for your GraphQL project. Explore the possibilities.</p>
            <button class="cta-button">Get Started</button>
        </div>
    `;
};

renderWelcome();
