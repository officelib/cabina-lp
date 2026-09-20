(() => {
  "use strict";

  const endpoint = "https://cabina-stripe-license.officelib.workers.dev/order/";
  const retryIntervalMs = 2_000;
  const maxWaitMs = 20_000;
  const storageKey = "cabina.order.session";
  const unavailableMessage = "この画面ではキーを表示できません。ご購入時のメールをご確認ください。";

  const title = document.querySelector("[data-order-title]");
  const message = document.querySelector("[data-order-message]");
  const licensePanel = document.querySelector("[data-license-panel]");
  const licenseKey = document.querySelector("[data-license-key]");
  const copyButton = document.querySelector("[data-copy-button]");
  const copyStatus = document.querySelector("[data-copy-status]");
  const testModeNote = document.querySelector("[data-test-mode-note]");

  // session_idはURLから消す（履歴や共有で漏れないように）。ただし消すだけだと
  // 再読み込みでキーを二度と出せなくなる。キーは決済から30分は取り直せる仕様なので、
  // 同じタブの間だけ持っておく。タブを閉じれば消える
  const readSessionId = () => {
    const fromUrl = new URLSearchParams(window.location.search).get("session_id");
    if (fromUrl) {
      try {
        window.sessionStorage.setItem(storageKey, fromUrl);
      } catch {
        // プライベートモード等で保存できないことがある。再読み込みが効かなくなるだけ
      }
      if (window.history.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
      return fromUrl;
    }
    try {
      return window.sessionStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const sessionId = readSessionId();

  const showUnavailable = () => {
    title.textContent = "ライセンスキーはメールでお届けします";
    message.textContent = unavailableMessage;
    licensePanel.hidden = true;
  };

  const showReady = (order) => {
    title.textContent = "ご購入ありがとうございます";
    message.textContent = "ライセンスキーを発行しました。";
    licenseKey.textContent = order.license_key;
    licensePanel.hidden = false;
    testModeNote.hidden = order.livemode !== false;

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(order.license_key);
        copyStatus.textContent = "コピーしました";
      } catch {
        copyStatus.textContent = "コピーできませんでした。キーを選択してコピーしてください。";
      }
    });
  };

  // 通信の失敗もJSONで返ってこなかった場合もnullを返す。呼び出し側で「まだ分からない」として扱う
  const fetchOrder = async () => {
    try {
      const response = await fetch(`${endpoint}${encodeURIComponent(sessionId)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "omit"
      });
      return await response.json();
    } catch {
      return null;
    }
  };

  const deadline = Date.now() + maxWaitMs;

  const checkOrder = async () => {
    const order = await fetchOrder();

    if (order && order.status === "ready" && typeof order.license_key === "string") {
      showReady(order);
      return;
    }

    // unavailable と invalid は確定した答え。待っても変わらないのですぐ切り替える
    if (order && (order.status === "unavailable" || order.status === "invalid")) {
      showUnavailable();
      return;
    }

    // pending、または通信・応答の失敗。決済直後は必ずpendingから始まるうえ、
    // 一度の通信の失敗であきらめると、買えた人に「買えていない」と見せることになる。
    // 期限までは同じように待つ
    if (Date.now() + retryIntervalMs <= deadline) {
      window.setTimeout(checkOrder, retryIntervalMs);
      return;
    }

    showUnavailable();
  };

  if (!sessionId) {
    showUnavailable();
    return;
  }

  checkOrder();
})();
