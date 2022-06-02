$(function () {
  var windowTopBar = document.createElement("div");

  windowTopBar.className = "top-bar";

  windowTopBar.style.width = "100%";
  windowTopBar.style.height = "20px";
  windowTopBar.style.backgroundColor = "#000";
  windowTopBar.style.position = "fixed";
  windowTopBar.style.top = windowTopBar.style.left = 0;
  windowTopBar.style.webkitAppRegion = "drag";
  document.body.appendChild(windowTopBar);
  window.api.receive("copyText", (data) => {
    let toAppend = `<p class="active copy-me">${data.text} <span><i class="fa fa-clipboard"></span></p>`;
    $(".text-append").append(toAppend);
    $("html, body").animate(
      {
        scrollTop: $(this).height(),
      },
      "fast"
    );
  });
  $(document.body).on("mousedown keydown", ".copy-me", function (e) {
    console.log(e.which);
    console.log(e);
    if (e.which == 1) {
      let text = $(this).html();
      navigator.clipboard.writeText(text);
    } else if (e.which == 3) {
      $(this).remove();
    }
  });
});
