document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const searchInput = document.getElementById("search-input");
    const searchSuggestions = document.getElementById("search-suggestions");
    const filterOptions = document.getElementById("filter-options");

    let allPosts = [];

    // Load posts dynamically from JSON
    fetch("posts.json")
        .then(response => response.json())
        .then(data => {
            allPosts = data.sort((a, b) => b.views - a.views); // Sort by views (most read first)
            displayPosts(allPosts);
            createFilters(allPosts);
        });

    // Function to display posts dynamically
    function displayPosts(posts) {
        postsContainer.innerHTML = ""; // Clear existing posts
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post-item");
            postElement.innerHTML = `
                <a href="${post.link}" class="post-link">
                    <div class="post-image"><img src="${post.image}" alt="${post.title}"></div>
                    <div class="post-content">
                        <h2 class="post-title">${post.title}</h2>
                        <p class="post-subtitle">${post.subtitle}</p>
                        <p class="post-meta">Views: ${post.views}</p>
                        <p class="post-tags">Categories: ${post.categories.join(", ")}</p>
                    </div>
                </a>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Function to create filter buttons
    function createFilters(posts) {
        let categories = new Set();
        posts.forEach(post => post.categories.forEach(cat => categories.add(cat)));

        filterOptions.innerHTML = `<button class="filter-btn" data-category="all">All</button>`;
        categories.forEach(category => {
            filterOptions.innerHTML += `<button class="filter-btn" data-category="${category}">${category}</button>`;
        });

        document.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", function () {
                let category = this.dataset.category;
                let filteredPosts = category === "all" ? allPosts : allPosts.filter(post => post.categories.includes(category));
                displayPosts(filteredPosts);
            });
        });
    }

    // Search Functionality with Suggestions
    searchInput.addEventListener("input", function () {
        let query = this.value.toLowerCase();
        let filteredPosts = allPosts.filter(post => post.title.toLowerCase().includes(query) || post.subtitle.toLowerCase().includes(query));

        // Display suggestions
        searchSuggestions.innerHTML = "";
        if (query.length > 0) {
            filteredPosts.forEach(post => {
                let suggestion = document.createElement("div");
                suggestion.classList.add("search-suggestion");
                suggestion.innerText = post.title;
                suggestion.addEventListener("click", function () {
                    searchInput.value = post.title;
                    displayPosts([post]); // Show only the selected post
                    searchSuggestions.innerHTML = "";
                });
                searchSuggestions.appendChild(suggestion);
            });
        } else {
            searchSuggestions.innerHTML = "";
            displayPosts(allPosts); // Show all posts if search is empty
        }
    });
});
