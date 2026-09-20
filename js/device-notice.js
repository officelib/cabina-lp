(() => {
  const notice = document.querySelector("[data-device-notice]");
  if (!notice || /Windows NT/i.test(navigator.userAgent)) return;

  notice.hidden = false;
  document.body.classList.add("device-notice-visible");

  const copyButton = notice.querySelector("[data-device-notice-copy]");
  const message = notice.querySelector("[data-device-notice-message]");
  if (!copyButton || !message) return;

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.textContent = "URLをコピーしました。お使いのPCで開いてください。";
      copyButton.textContent = "コピーしました";
    } catch {
      message.textContent = "URLをコピーできませんでした。お使いのPCでこのページを開いてください。";
    }
  });
})();
