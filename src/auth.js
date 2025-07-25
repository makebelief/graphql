import { renderDashboard } from "./index.js";
export async function handleLogin(event, sidebar, mainContent, rightSidebar, app) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  const submitButton = event.target.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Logging in...";
  submitButton.disabled = true;

  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(
      "https://learn.zone01kisumu.ke/api/auth/signin",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error("Invalid Credentials");
    }
    
    const token = await response.json();
    localStorage.setItem("authToken", token);
    
    // Clear login form and render dashboard
    app.innerHTML = "";
    renderDashboard(token);
    
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = "block";
  } finally {
    // Reset button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
}
