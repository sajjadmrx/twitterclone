$(document).ready(function () {
    $.get('/api/posts', results => {
        outputPosts(results, $('.postsContainer'));
    })
})

