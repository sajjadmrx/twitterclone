$('#postTextarea').keyup((e) => {
    var textbox = $(event.target)
    const value = textbox.val().trim()
    console.log(value)

    const submitButton = $('#submitPostButton')
    if (submitButton.length == 0) return alert('No sumbit button found!')


    if (value == '')
        return submitButton.prop('disabled', true);

    submitButton.prop('disabled', false)
})

$('#submitPostButton').click((e) => {
    const button = $(e.target);
    const textbox = $('#postTextarea')
    const value = textbox.val().trim()


    if (value == '')
        return alert('No text to post!')
    var data = { content: value }
    $.post('/api/posts', data, (postData, status, xhr) => {
        var html = createPostHtml(postData)
        $('.postsContainer').prepend(html)
        textbox.val('')
        button.prop('disabled', true)
    })
})

function createPostHtml(post) {
    // return post.content

    const postedBy = post.postedBy
    const timestep = moment(post.createdAt).fromNow()
    return `
    <div class='post' >
<div class='mainContentContainer'>

        <div class='userImageContainer'>
            <img class='userImage' src='${postedBy.profilePic}' />
        </div>

        <div class='postContentContainer'>
            <div class='header'>
                <a href='/profile/${postedBy.username}'>${postedBy.firstName}</a>
                <span class='username'>@${postedBy.username}</span>
                <span class='date'>${timestep}</span>
            </div>
            <div class='postBody'>
                <span>${post.content}</span>
            </div>
            <div class='postFooter'>

                      <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-heart'></i>
                                </button>
                            </div>


            </div>
        </div>
</div>
    
    
    </div>`
}
