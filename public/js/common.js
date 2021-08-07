$('#postTextarea').keyup((e) => {
    console.log(userLoggedIn)
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

$(document).on('click', '.likeButton', (event) => {
    var button = $(event.target)
    var postId = getPostIdFromElemnet(event.target)


    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: 'PUT',
        success: (data, status, xhr) => {
            button.find('span').text(data.likes.length || '')
            if (data.likes.includes(userLoggedIn._id)) {
                button.addClass('active')
                console.log('liked')

            } else {
                button.removeClass('active')
                console.log('unliked')

            }
        }
    })
});

$(document).on('click', '.retweetButton', (event) => {
    var button = $(event.target)
    var postId = getPostIdFromElemnet(event.target)


    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: 'PUT',
        success: (data, status, xhr) => {
            console.log(data)
        }
    })
})

function getPostIdFromElemnet(element) {
    var isRoot = element.classList.contains('post')

    var rootElement = isRoot ? element : element.closest('.post')
    var postId = rootElement.dataset.id

    return postId

}
function createPostHtml(post) {
    // return post.content

    const postedBy = post.postedBy
    const timestep = moment(post.createdAt).fromNow()
    var likeClass = post.likes.includes(userLoggedIn._id) ? 'active' : ''
    return `
    <div class='post' data-id='${post._id}'>
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
                                <button class='retweetButton'>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton  ${likeClass} '>
                                    <i class='far fa-heart'></i>
                                    <span>${post.likes.length || ''}</span>
                                </button>
                            </div>


            </div>
        </div>
</div>
    
    
    </div>`
}
