$(document).ready(function () {
    $.get('/api/posts', results => {
        outputPosts(results, $('.postsContainer'));



        console.log(results)
    })
})

function outputPosts(results, container) {
    container.html(' ')
    results.forEach(post => {
        var html = createPostHtml(post)
        container.append(html)
    })
    if (results.length == 0) {
        container.append(`<span class='noResults'>No posts found</span>`)
    }
}