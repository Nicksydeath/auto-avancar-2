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

    #autoMenuHideBtn {
        all: initial !important;
        position: fixed !important;
        top: 8px !important;
        right: 212px !important;
        width: 12px !important;
        height: 12px !important;
        border-radius: 50% !important;
        background: #888 !important;
        cursor: pointer !important;
        z-index: 999999999 !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.5) !important;
        transition: background 0.2s !important;
    }

    #autoMenuHideBtn:hover {
        background: #aaa !important;
    }
    `;
    document.head.appendChild(style);

    const menu = document.createElement("div");
    menu.id = "autoMenu";
    menu.innerHTML = `
        <div id="autoMenuInner" style="display:flex;flex-direction:column;align-items:stretch;gap:4px;width:100%;">
        <div class="menu-title">Auto Avançar</div>
        <div class="label">Intervalo (min.seg)</div>
        <input id="delayInput" type="text" value="1">
        <div id="countdown">00:00</div>
        <div class="label">Próximo clique</div>
        <button id="toggleBtn">Iniciar</button>
        </div>
    `;

    // Botão de ocultar
    const hideBtn = document.createElement('div');
    hideBtn.id = 'autoMenuHideBtn';
    hideBtn.title = 'Ocultar menu';
    document.body.appendChild(hideBtn);

    let menuVisible = true;
    hideBtn.onclick = function() {
        menuVisible = !menuVisible;
        const inner = document.getElementById('autoMenuInner');
        if (!menuVisible) {
            inner.style.setProperty('display', 'none', 'important');
            menu.style.setProperty('padding', '0', 'important');
            menu.style.setProperty('border', 'none', 'important');
            menu.style.setProperty('background', 'transparent', 'important');
            menu.style.setProperty('box-shadow', 'none', 'important');
            hideBtn.style.setProperty('background', '#555', 'important');
            hideBtn.title = 'Mostrar menu';
        } else {
            inner.style.setProperty('display', 'flex', 'important');
            menu.style.setProperty('padding', '10px 10px 8px 10px', 'important');
            menu.style.setProperty('border', '1px solid #00ff88', 'important');
            menu.style.setProperty('background', '#111', 'important');
            menu.style.setProperty('box-shadow', 'none', 'important');
            hideBtn.style.setProperty('background', '#888', 'important');
            hideBtn.title = 'Ocultar menu';
        }
    };
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
        console.debug('%c[AA] ⏭ avançando página — ' + new Date().toLocaleTimeString(), 'color:#00ff88;font-weight:bold;font-family:monospace');
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
        const jitter = Math.floor(Math.random() * 21) - 10;
        remainingSeconds = Math.max(5, totalSeconds + jitter);
        console.debug('%c[AA] ⏱ próximo clique em ' + remainingSeconds + 's (jitter: ' + (jitter >= 0 ? '+' : '') + jitter + 's)', 'color:#00ff88;font-family:monospace');
        document.getElementById("countdown").textContent = formatTime(remainingSeconds);

        countdownInterval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
                clickNextButton();
                const nextJitter = Math.floor(Math.random() * 21) - 10;
                remainingSeconds = Math.max(5, totalSeconds + nextJitter);
                console.debug('%c[AA] ⏱ próximo clique em ' + remainingSeconds + 's (jitter: ' + (nextJitter >= 0 ? '+' : '') + nextJitter + 's)', 'color:#00ff88;font-family:monospace');
            }
            document.getElementById("countdown").textContent = formatTime(remainingSeconds);
        }, 1000);
    }


    // ======= MOVIMENTO FALSO DE MOUSE =======
    let mouseX = Math.floor(Math.random() * window.innerWidth);
    let mouseY = Math.floor(Math.random() * window.innerHeight);
    let mouseTarget = { x: mouseX, y: mouseY };
    let mouseMoveTimeout = null;

    function easeToTarget() {
        // Suaviza o movimento em direção ao alvo (simula inércia humana)
        mouseX += (mouseTarget.x - mouseX) * (0.04 + Math.random() * 0.06);
        mouseY += (mouseTarget.y - mouseY) * (0.04 + Math.random() * 0.06);

        document.dispatchEvent(new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            clientX: Math.round(mouseX),
            clientY: Math.round(mouseY),
            movementX: Math.round(mouseTarget.x - mouseX),
            movementY: Math.round(mouseTarget.y - mouseY)
        }));

        const distX = Math.abs(mouseTarget.x - mouseX);
        const distY = Math.abs(mouseTarget.y - mouseY);

        if (distX > 2 || distY > 2) {
            // Delay humano variável entre 12-45ms (mais lento e irregular)
            const moveDelay = 12 + Math.random() * 33;
            mouseMoveTimeout = setTimeout(easeToTarget, moveDelay);
        } else {
            // Pausa aleatória antes do próximo destino: 2-9s
            const pause = 2000 + Math.random() * 7000;
            mouseMoveTimeout = setTimeout(pickNewTarget, pause);
        }
    }

    function pickNewTarget() {
        // Passo aleatório entre 80px e 500px para variar bastante
        const maxStep = 80 + Math.floor(Math.random() * 420);
        const angleJitter = Math.random() * Math.PI * 2;
        const dist = maxStep * (0.4 + Math.random() * 0.6);
        mouseTarget.x = Math.max(0, Math.min(window.innerWidth,
            mouseX + Math.cos(angleJitter) * dist));
        mouseTarget.y = Math.max(0, Math.min(window.innerHeight,
            mouseY + Math.sin(angleJitter) * dist));
        console.debug('%c[AA] 🖱 mouse → (' + Math.round(mouseTarget.x) + ', ' + Math.round(mouseTarget.y) + ')', 'color:#00ff88;font-family:monospace');
        easeToTarget();
    }

    // Inicia o movimento falso
    pickNewTarget();

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


    // ======= ATALHO CTRL+SHIFT =======
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            e.stopImmediatePropagation();
            hideBtn.click();
        }
    }, true);

})();
