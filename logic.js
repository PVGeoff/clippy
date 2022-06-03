$(function () {
  let cL = [];
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
    if (!cL.includes(data.text)) {
      cL.push(data.text);
      let toAppend = `<p class="active copy-me">${data.text}</p><span class="pin"><i class="fa fa-copy"/></span>`;
      $(".text-append").append(toAppend);
      $("html, body").animate(
        {
          scrollTop: $(this).height(),
        },
        "fast"
      );
    }
  });
  $(document.body).on("mousedown", ".copy-me", function (e) {
    if (e.which == 1) {
      let text = $(this).html();
      navigator.clipboard.writeText(text);
    } else if (e.which == 3) {
      $(this).remove();
      cL = cL.filter((e) => e != $(this).html());
    }
  });
  $(document.body).on("mousedown", ".pin", function (e) {
    console.log($(this));
  });
});
