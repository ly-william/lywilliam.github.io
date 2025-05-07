function error(message) {
    var msg = $("#error_msg")
    msg.text(message)
    msg.removeAttr("hidden")
}

function submit_remove() {
  window.location.href = '../../index.html'
    // fetch(window.location.href, {
    //     method:'POST',
    //     headers:{
    //         'Content-Type':'application/json',
    //         'X-CSRFToken':csrftoken,
    //     }, 
    //     body:JSON.stringify({'remove_class': true}),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //     if (data["success"])
    //         window.location.href = main_page;
    //     else
    //         error("An error occured while removing this class. Please try again.")
    // })
}

function setPlaceholder(num) {
  if (num == 0) {
    $("#groupchat_link").attr("placeholder", "https://www.snapchat.com/t/...")
  } else if (num == 1) {
    $("#groupchat_link").attr("placeholder", "https://discord.gg/...")
  }
}

function set_groupchat_message(message, messageType) {
  var msg = $("#groupchat_modal_message")
  msg.removeClass(['alert-warning', 'alert-success'])
  msg.addClass('alert-'+messageType);
  msg.html(message)
  msg.removeAttr("hidden")
}

function submit_set_groupchat() {
  var social_media = $('input[name="social_media"]:checked').val()
  var link = $("#groupchat_link").val().trim()
  if (link === '') {
      set_groupchat_message('Please enter the groupchat\'s invite link.', 'warning')
      return
  }
  if (link.substring(0, 3).toLowerCase() == "www")
    link = "https://" + link
  if (social_media == "discord") {
    if (link.substring(0, 19).toLowerCase() != "https://discord.gg/") {
        set_groupchat_message("Please ensure link follows the following format: <strong>https://discord.gg/...</strong>", "warning")
        return;
    }
    var lengths = [7, 8, 10]
    if (!lengths.includes(link.substring(19).length)) {
      set_groupchat_message("Please enter a valid group chat link.", "warning")
      return
    }
  } else if (social_media == "snapchat") {
    if (!link.includes("https://www.snapchat.com/t/")) {
        set_groupchat_message("Please ensure link follows the following format: <strong>https://www.snapchat.com/t/...</strong>", "warning")
        return;
    }
    if (link.substring(32).length == 0) {
      set_groupchat_message("Please enter a valid group chat link.", "warning")
      return;    
    }
  }

  $("#groupchat_modal_message").attr('hidden', '')
  $("#set_groupchat_button").attr('hidden', '')
  $("#set_groupchat_spinner").removeAttr('hidden')
  $("#groupchat_link").attr('disabled', '')
  $('input[name="social_media"]').attr('disabled', '')

  setTimeout(() => null, 500)

  set_groupchat_message("Successfully updated groupchat link.", "success")
  $("#groupchat_link").val("") 
  if (social_media == "snapchat")  {
    $("#snapchat_picture_monochrome").remove()
    $("#snapchat_picture").parent().removeAttr('hidden')
    $("#snapchat_picture").parent().attr('href', link)
  } else if (social_media == "discord") {
    $("#discord_picture_monochrome").remove()
    $("#discord_picture").parent().removeAttr('hidden')
    $("#discord_picture").parent().attr('href', link)
  }
  add_change(link, social_media)
  $("#groupchat_modal_message").removeAttr('hidden')
  $("#set_groupchat_button").removeAttr('hidden')
  $("#set_groupchat_spinner").attr('hidden', '')
  $("#groupchat_link").removeAttr('disabled')
  $('input[name="social_media"]').removeAttr('disabled')
}

function openModal(social_media) {
  if (social_media == "snapchat") {
    $('#groupchatModal').modal('show')
    $("#social_media_snapchat").prop("checked", true).trigger("click");
  } else if (social_media == "discord") {
    $('#groupchatModal').modal('show')
    $('#social_media_discord').prop("checked", true).trigger("click");
  }
}

function set_gc_history_alert(message) {
  $("#gc_history_alert").html(`<a href="${message}">${message}</a>`).removeAttr('hidden')
}


function add_change(link, social_media) {
  var today = new Date()
  // var date = (today.getUTCMonth() < 9 ? "0" + (today.getUTCMonth() + 1) : today.getUTCMonth() + 1) + "-" + (today.getUTCDate() < 10 ? "0" + today.getUTCDate() : today.getUTCDate()) + "-" + (today.getUTCFullYear() % 100)
  var date = moment().tz('America/New_York').format('MM-DD-YY')
    var row = $("<tr><td></td><td></td><td><span></span></td></tr>")
      .find("td:nth-child(1)")
        .text(date + " EST")
      .end()
      .find("td:nth-child(2)")
        .text(full_name)
      .end()
      .find("td:nth-child(3)")
        .addClass("text-primary")
        .find("span")
          .attr("onclick", "set_gc_history_alert('" + link + "')")
          .addClass("clickable")
          .text("Show Link")
        .end()
      .end()
  var tbody = $("#groupchat_history_" + social_media).find("tbody")
  row.prependTo(tbody)

  $("#groupchat_history_"+social_media).removeAttr("hidden")
  $("#groupchat_history_empty_"+social_media).remove()
}

$(document).ready(function() {
    var groupchat_link = document.getElementById("groupchat_link")
    $('#groupchatModal').on('hidden.bs.modal', function (e) {
        // resets to default
        if (!groupchat_link.hasAttribute("disabled"))
            groupchat_link.value = ''
        $("#groupchat_modal_message").attr('hidden', '')
    })
    $('#gc_history_modal').on('hidden.bs.modal', function (e) {
      $("#gc_history_alert").attr('hidden', '')
  })
});