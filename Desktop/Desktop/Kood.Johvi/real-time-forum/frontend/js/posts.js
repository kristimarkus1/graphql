document.addEventListener('DOMContentLoaded', async () => {
    const postsList = document.getElementById('posts-list');
    const postForm = document.getElementById('post-form');
    const categoryButtons = document.querySelectorAll('.navbar a'); // Category buttons in the navbar

    // Fetch and Display Posts
    async function fetchPosts(category = 'All') {
        try {
            const response = await fetch(`/posts?category=${category}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const posts = await response.json();
                postsList.innerHTML = ''; // Clear existing posts
                posts.forEach(post => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="post">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                            <p><em>Category: ${post.category}</em></p>
                            <button data-id="${post.id}" class="delete-button">Delete</button>
                        </div>
                    `;
                    postsList.appendChild(li);
                });
            } else {
                console.error('Failed to fetch posts:', await response.text());
                alert('Could not fetch posts.');
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            alert('An error occurred while fetching posts.');
        }
    }

    // Handle Post Creation
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(postForm);
        const postData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
        };

        try {
            const response = await fetch('/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                alert('Post created successfully!');
                await fetchPosts(); // Refresh posts
                postForm.reset();
            } else {
                console.error('Failed to create post:', await response.text());
                alert('Could not create post.');
            }
        } catch (err) {
            console.error('Error creating post:', err);
            alert('An error occurred while creating the post.');
        }
    });

    // Handle Post Deletion
    postsList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-button')) {
            const postId = e.target.getAttribute('data-id');
            if (!confirm('Are you sure you want to delete this post?')) return;

            try {
                const response = await fetch(`/posts?id=${postId}`, { method: 'DELETE' });

                if (response.ok) {
                    alert('Post deleted successfully!');
                    await fetchPosts(); // Refresh posts
                } else {
                    console.error('Failed to delete post:', await response.text());
                    alert('Could not delete post.');
                }
            } catch (err) {
                console.error('Error deleting post:', err);
                alert('An error occurred while deleting the post.');
            }
        }
    });

    // Handle Category Button Clicks
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.innerText; // Get the category name
            fetchPosts(category);
        });
    });

    // Fetch posts on page load
    await fetchPosts('All');
});
