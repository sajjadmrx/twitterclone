$('#postTextarea,  #replyTextarea').keyup((e) => {
    var textbox = $(event.target)
    const value = textbox.val().trim()

    var isModal = textbox.parents('.modal').length == 1

    const submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton')
    if (submitButton.length == 0) return alert('No sumbit button found!')



    if (value == '')
        return submitButton.prop('disabled', true);

    submitButton.prop('disabled', false)
})

$('#submitPostButton, #submitReplyButton').click((e) => {
    const button = $(e.target);
    var isModal = button.parents('.modal').length == 1


    const textbox = isModal ? $('#replyTextarea') : $('#postTextarea')

    const value = textbox.val()


    if (value == '')
        return alert('No text to post!')



    var data = { content: value }
    if (isModal) {
        data.replyTo = button.data()?.id
    }


    $.post('/api/posts', data, (postData, status, xhr) => {
        if (postData.replyTo)
            return window.location.reload();

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


$('#replyModal').on('show.bs.modal', () => {

    var postId = getPostIdFromElemnet(event.target)
    $('#submitReplyButton').data('id', postId)

    $.get(`/api/posts/${postId}`, results => {

        outputPosts(results.postData, $('#orginalPostContainer'))
    })
})

$('#replyModal').on('hidden.bs.modal', () => {

    $('#orginalPostContainer').html('')
})


$('#deletePostModal').on('show.bs.modal', (e) => {
    var button = $(e.relatedTarget)
    var postId = getPostIdFromElemnet(button[0])
    $('#deletePostButton').data('id', postId)
})
$('#deletePostButton').click(function () {
    var id = $(this).data('id')
    $.ajax({
        url: `/api/posts/${id}`,
        type: 'DELETE',
        success: (data, status, xhr) => {
            window.location.reload()
        }
    })
})
$(document).on('click', '.retweetButton', (event) => {
    var button = $(event.target)
    var postId = getPostIdFromElemnet(event.target)


    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: 'PUT',
        success: (data, status, xhr) => {

            button.find('span').text(data.retweetUsers.length || '')
            if (data.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass('active')


            } else {
                button.removeClass('active')
            }


        }

    })
})
$(document).on('click', '.post', (event) => {
    let element = $(event.target)
    const postId = getPostIdFromElemnet(element[0])

    if (postId && !element.is('button'))
        window.location.href = `/post/${postId}`
})
function getPostIdFromElemnet(element) {
    var isRoot = element.classList.contains('post')

    var rootElement = isRoot ? element : element.closest('.post')
    var postId = rootElement.dataset.id

    return postId

}
function createPostHtml(post) {
    // return post.content
    console.log(post.replyTo)

    const isRetweet = post.retweetData !== undefined;
    const retweetBy = isRetweet ? post.postedBy.username : null
    post = isRetweet ? post.retweetData : post


    const postedBy = post.postedBy
    const timestep = moment(post.createdAt).fromNow()
    var likeClass = post.likes.includes(userLoggedIn._id) ? 'active' : ''
    var retweetClass = post.retweetUsers.includes(userLoggedIn._id) ? 'active' : ''

    var retweetText = ''
    if (isRetweet) {
        retweetText = `<span>
          <i class='fas fa-retweet'></i>
        Retweeted by <a href='/profile/${retweetBy}'>${retweetBy}</a> 
        
        </span>`
    }

    let flag = ''
    if (post.replyTo && post.replyTo._id) {
        console.log(post)
        var replyToUsername = post.replyTo.postedBy?.username
        flag = `<div class='replyFlag'>
            replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
        
        </div>`
    }
    var buttons = "";
    if (post.postedBy._id == userLoggedIn._id) {
        buttons = `<button data-id="${post._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i></button>`;
    }

    return `
    <div class='post' data-id='${post._id}'>
     <div class='postActionContainer'>
            ${retweetText}
        </div>
        <div class='mainContentContainer'>

        <div class='userImageContainer'>
            <img class='userImage' src='${postedBy.profilePic}' />
        </div>

        <div class='postContentContainer'>
            <div class='header'>
                <a href='/profile/${postedBy.username}'>${postedBy.firstName}</a>
                <span class='username'>@${postedBy.username}</span>
                <span class='date'>${timestep}</span>
                       ${buttons}
            </div>
            ${flag}
            <div class='postBody'>
                <span>${post.content}</span>
            </div>
            <div class='postFooter'>

                      <div class='postButtonContainer'>
                                <button data-toggle='modal' data-target ='#replyModal'>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton ${retweetClass}'>
                                    <i class='fas fa-retweet'></i>
                                        <span>${post.retweetUsers.length || ''}</span>
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

function outputPosts(results, container) {
    container.html(' ')
    if (!Array.isArray(results))
        results = [results]

    results.forEach(post => {
        var html = createPostHtml(post)
        container.append(html)
    })
    if (results.length == 0) {
        container.append(`<span class='noResults'>No posts found</span>`)
    }
}

function outputPostsWithReplies(results, container) {
    container.html(' ')


    if (results.replyTo && results.replyTo._id) {
        var html = createPostHtml(results.replyTo)
        container.append(html)
    }

    var mainPostHtml = createPostHtml(results.postData)
    container.append(mainPostHtml)
    results.replies.forEach(reply => {
        var html = createPostHtml(reply)
        container.append(html)
    })
}
