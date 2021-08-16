
$(document).ready(function () {
    $.get('/api/posts/' + postId, results => {
        outputPostsWithReplies(results, $('.postsContainer'));
    })
})
