(function () {
    if (document.getElementById("autoMenu")) {
        return;
    }

    const style = document.createElement("style");
    style.textContent = `
    #autoMenu {
        all: initial;
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 99999999 !important;
        background: #111 !important;
        border: 1px solid #00ff88 !important;
        border-radius: 6px !important;
        width: 160px !important;
        padding: 10px 10px 8px 10px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 4px !important;
        font-family: monospace !important;
        color: #00ff88 !important;
    }

    #autoMenu * {
        all: unset;
        box-sizing: border-box !important;
        font-family: monospace !important;
    }

    #autoMenu .menu-title {
        display: block !important;
        text-align: center !important;
        font-size: 12px !important;
        font-weight: bold !important;
        color: #00ff88 !important;
        padding-bottom: 6px !important;
        border-bottom: 1px solid #222 !important;
    }

    #autoMenu .label {
        display: block !important;
        font-size: 9px !important;
        text-align: center !important;
        color: #00cc6a !important;
        opacity: 0.8 !important;
    }

    #autoMenu input {
        display: block !important;
        background: #0d0d0d !important;
        color: #00ff88 !important;
        border: 1px solid #00ff8855 !important;
        border-radius: 3px !important;
        text-align: center !important;
        font-size: 13px !important;
        padding: 4px !important;
        width: 100% !important;
        outline: none !important;
    }

    #autoMenu input:focus {
        border-color: #00ff88 !important;
    }

    #countdown {
        display: block !important;
        text-align: center !important;
        font-size: 22px !important;
        font-weight: bold !important;
        letter-spacing: 2px !important;
        color: #00ff88 !important;
        line-height: 1.2 !important;
    }

    #autoMenu #toggleBtn {
        display: block !important;
        background: #0d0d0d !important;
        color: #00ff88 !important;
        border: 1px solid #00ff88 !important;
        border-radius: 3px !important;
        padding: 5px !important;
        font-size: 12px !important;
        cursor: pointer !important;
        width: 100% !important;
        text-align: center !important;
        transition: background 0.15s, color 0.15s !important;
    }

    #autoMenu #toggleBtn:hover {
        background: #00ff88 !important;
        color: #0d0d0d !important;
    }
    `;
    document.head.appendChild(style);

    const menu = document.createElement("div");
    menu.id = "autoMenu";
    menu.innerHTML = `
        <div class="menu-title">Auto Avançar</div>
        <div class="label">Intervalo (min.seg)</div>
        <input id="delayInput" type="text" value="1">
        <div id="countdown">00:00</div>
        <div class="label">Próximo clique</div>
        <button id="toggleBtn">Iniciar</button>
    `;
    document.body.appendChild(menu);

    let countdownInterval = null;
    let running = false;
    let remainingSeconds = 0;
    let totalSeconds = 0;

    function formatTime(seconds) {
        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");
        return `${min}:${sec}`;
    }

    function clickNextButton() {
        const targets = [
            document.querySelector("[id*='vanilla-reader']"),
            document.querySelector("vanilla-reader"),
            document.querySelector("main"),
            document.body
        ];
        const target = targets.find(el => el !== null);
        target.dispatchEvent(new KeyboardEvent("keydown", {
            key: "ArrowRight",
            code: "ArrowRight",
            keyCode: 39,
            bubbles: true,
            cancelable: true
        }));
    }

    function convertInputToSeconds(value) {
        const parts = value.split(".");
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parts[1] ? parseInt(parts[1].padEnd(2, "0")) : 0;
        return (minutes * 60) + seconds;
    }

    function startCycle() {
        remainingSeconds = totalSeconds;
        document.getElementById("countdown").textContent = formatTime(remainingSeconds);

        countdownInterval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
                clickNextButton();
                remainingSeconds = totalSeconds;
            }
            document.getElementById("countdown").textContent = formatTime(remainingSeconds);
        }, 1000);
    }

    document.getElementById("toggleBtn").onclick = function () {
        if (!running) {
            totalSeconds = convertInputToSeconds(document.getElementById("delayInput").value);
            if (!totalSeconds || totalSeconds <= 0) return;
            this.textContent = "Parar";
            running = true;
            startCycle();
        } else {
            this.textContent = "Iniciar";
            clearInterval(countdownInterval);
            document.getElementById("countdown").textContent = "00:00";
            running = false;
        }
    };

})();
