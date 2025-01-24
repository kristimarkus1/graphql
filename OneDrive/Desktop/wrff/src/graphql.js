export async function queryAPI(query, variables = {}) {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error("No valid token provided");

  return fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }), // Include full query
  })
    .then(res => res.json())
    .then(data => {
      console.log("GraphQL Response:", data); // Debug log
      if (data.errors) {
        throw new Error(data.errors[0].message || "GraphQL query error");
      }
      return data.data;
    })
    .catch(error => {
      console.error("Network error:", error);
      throw new Error("Failed to fetch data from the server.");
    });
  
}

