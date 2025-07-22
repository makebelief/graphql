export const leftSidebar = (user) => `
        <div class="user-header">
            <div class="user-info-section">
                <div class="avatar">${user.attrs.firstName.toUpperCase()[0]}${user.attrs.lastName.toUpperCase()[0]}</div>
                <div class="user-title">
                  <h1 class="user-name">${user.attrs.firstName.toUpperCase()} ${user.attrs.middleName.toUpperCase()} ${user.attrs.lastName.toUpperCase()}</h1>
                  <p class="username">${user.login}</p> 
                </div>
            </div>
            <div id="logout-btn" class="log-out">
                <span class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </span>
                Log Out
            </div>
        </div>

        <div class="profile-details">
            <div class="info-item">
                <div class="info-content">
                  <p class="info-label">Phone Number</p>
                  <p class="info-value">${user.attrs.phone}</p>
                </div>
            </div>

            <div class="info-item">
                <div class="info-content">
                  <p class="info-label">Email Address</p>
                  <p class="info-value">${user.attrs.email}</p>
                </div>
            </div>

            <div class="info-item">
                <div class="info-content">
                  <p class="info-label">Date of Birth</p>
                  <p class="info-value">${formatDate(user.attrs.dateOfBirth)}</p>
                </div>
            </div>
                
            <div class="info-item">
                <div class="info-content">
                    <p class="info-label">Gender</p>
                    <p class="info-value">${user.attrs.gender}</p>
                </div>
            </div>

            <div class="info-item">
                <div class="info-content">
                    <p class="info-label">Country</p>
                    <p class="info-value">${user.attrs.country}</p>
                </div>
            </div>
        </div>
`;


function formatDate(isoDateString) {
    // Create a new Date object from the ISO string
    const date = new Date(isoDateString);
    
    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get the month name, day, and year
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Return the formatted date string
    return `${monthName} ${day}, ${year}`;
  }
