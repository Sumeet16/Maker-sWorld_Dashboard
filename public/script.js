// Function to format date in a readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
}

// Function to update the dashboard
async function updateDashboard() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();

        // Update stats cards
        document.getElementById('totalUsers').textContent = data.stats.totalUsers;
        document.getElementById('avgTime').textContent = data.stats.avgTimeToCreate;

        // Update table
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = ''; // Clear existing rows

        data.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email || 'N/A'}</td>
                <td>
                    <span class="status-badge ${user.is_LoggedIn ? 'status-active' : 'status-inactive'}">
                        ${user.is_LoggedIn ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${formatDate(user.created_at)}</td>
                <td>${formatDate(user.last_logged_in)}</td>
                <td>${user.timeSinceCreation}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update dashboard initially and every 30 seconds
updateDashboard();
setInterval(updateDashboard, 30000);