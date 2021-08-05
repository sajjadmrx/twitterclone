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

    const textbox = $('#postTextarea')
    const value = textbox.val().trim()


    if (value == '')
        return alert('No text to post!')
    var data = { content: value }
    $.post('/api/post', data, (postData, status, xhr) => {

    })
})