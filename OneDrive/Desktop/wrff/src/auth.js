export async function login(username, password) {
  const credentials = btoa(`${username}:${password}`);
  try {
    const response = await fetch("https://01.kood.tech/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const tokenData = await response.text();
    const token = tokenData.replace(/^"|"$/g, ''); // Remove quotes
    localStorage.setItem('jwt', token);
    alert("Login successful");
  } catch (error) {
    throw new Error(error.message || "Failed to login");
  }
}

export function logout() {
  localStorage.removeItem('jwt');
  alert("Logged out successfully");
  location.reload(); // Reload the page to clear user-specific data
}

// Login form submission handler
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    await login(username, password);
    window.location.href = '../index.html'; // Redirect to the main page after successful login
  } catch (error) {
    document.getElementById("error-message").textContent = error.message;
  }
});
