$(document).ready(() => {
  $('.comments').hide();

  // Deleting post request
  $('.delButton').click(function(event) {
    event.preventDefault();
    let elem = $(this).parent('article').toggle('slide');
    let id = $(this).parent('article').attr('id');
    $.get({
      type: 'DELETE',
      url: `/posts/${id}`
    })
  });

  $('.commentButton').click(function() {
    $(this).parent().next().slideToggle('ease');
  });

  // Deleting comment request
  $('.delButtonComment').click(function(event) {
    event.preventDefault();
    let elem = $(this).closest('.singleComment').toggle('slide');
    let id = $(this).closest('.singleComment').attr('id');
    $.get({
      type: 'DELETE',
      url: `/posts:${id}`
    })
  });

  $('.commentFormButton').click(function(event) {
    event.preventDefault();
    let id = $(this).closest('article').attr('id');
    let textarea = $(this).parents('.commentForm').find('.input');
    let comment = textarea.val();

    $.ajax({
      type: 'POST',
      url: '/posts',
      data: {
        id: id,
        comment: comment
      },
      success: function(response) {
        textarea.val('');
        let data = JSON.parse(response);
        $(event.target).closest('.comments').children('.singleComment').first().before(
          `<div class="singleComment" id="${data.id}">
              <div class="delButtonComment">delete</div>
              <p>
                ${data.comment}
              </p>
              <div class="commentFooter">
                <p class="nav" id="created">
                  ${data.createdAt.substring(8,10)}.${data.createdAt.substring(6,7)}.${data.createdAt.substring(0,4)}
                </p>
                <p class="nav" id="publisherComment">
                  ${data.commentUser}
                </p>
              </div>
            </div>`
        );
        $('h3').hide();
        $('.delButtonComment').click(function(event) {
          event.preventDefault();
          let elem = $(this).closest('.singleComment').toggle('slide');
          let id = $(this).closest('.singleComment').attr('id');
          $.get({
            type: 'DELETE',
            url: `/posts:${id}`
          })
        });
      }
    })
  });
});

function checkMail(value) {
  if (value.trim() == "") {
    document.getElementById('error').innerHTML = "all field are required";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  } else if (!value.trim().includes('@') || !value.trim().includes('.')) {
    document.getElementById('error').innerHTML = "email format invald";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  } else {
    document.getElementById('error').innerHTML = "";
  }
};

function checkPssw(value) {
  if (value.trim() == "") {
    document.getElementById('error').innerHTML = "all field are required";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  } else if (value.trim().length < 3) {
    document.getElementById('error').innerHTML = "password too short";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  } else {
    document.getElementById('error').innerHTML = "";
  }
};

function check(value) {
  if (value.trim() == "") {
    document.getElementById('error').innerHTML = "all field are required";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  } else {
    document.getElementById('error').innerHTML = "";
  }
};

document.addEventListener('invalid', (function() {
  return function(e) {
    e.preventDefault();
    document.getElementById('error').innerHTML = "invalid email format";
    setTimeout(function() {
      document.getElementById('error').innerHTML = ""
    }, 2500)
  };
})(), true);