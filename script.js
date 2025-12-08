
// Countdown Timer
const countdown = document.getElementById("countdown");
const launchDate = new Date("2025-09-09T00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
        countdown.innerHTML = "LAUNCH TIME!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `
        <div class="launch-title">Days till Launch! <i class="fa-solid fa-rocket launch-rocket"></i></div>
        <div class="time-wrapper">
            <div class="time-segment">
                <span class="count-label">DAYS</span>
                <span class="count-num">${String(days).padStart(2, '0')}</span>
            </div>
            <div class="time-segment">
                <span class="count-label">HOURS</span>
                <span class="count-num">${String(hrs).padStart(2, '0')}</span>
            </div>
            <div class="time-segment">
                <span class="count-label">MINUTES</span>
                <span class="count-num">${String(mins).padStart(2, '0')}</span>
            </div>
            <div class="time-segment">
                <span class="count-label">SECONDS</span>
                <span class="count-num">${String(secs).padStart(2, '0')}</span>
            </div>
        </div>`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

function initHeroIcoProgress() {
    const raisedEl = document.getElementById("usdRaised");
    const goalEl = document.getElementById("usdGoal");
    const barFill = document.getElementById("icoBarFill");
    if (!(raisedEl && goalEl && barFill)) return;

    const goal = 11000;
    goalEl.textContent = "$" + goal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    let current = 9500 + Math.random() * 300;

    function update() {
        if (current < 10000) {
            current = Math.min(current + Math.random() * 50, 10000);
        } else {
            current = 10000 - Math.random() * 50;
        }

        raisedEl.textContent = "$" + current.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        const width = (current / goal) * 100;
        barFill.style.width = width + "%";
    }

    update();
    setInterval(update, 8000);
}

async function updateLivePrices() {
    const priceEl = document.getElementById("thriftPrice");
    if (!priceEl) return;
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd");
        const data = await res.json();
        const matic = data["matic-network"].usd;
        const thriftPriceNum = matic * 0.01;
        priceEl.textContent = `$${thriftPriceNum.toFixed(4)}`;
    } catch (e) {
        priceEl.textContent = "$0.01";
    }
}

function initPresaleButton() {
    const btn = document.getElementById("presaleButton");
    const walletModal = document.getElementById("walletModal");
    if (!btn) return;
    const liveText = "PRESALE IS LIVE";
    const buyText = "BUY $THRIFT NOW!";
    btn.addEventListener("mouseover", () => (btn.textContent = buyText));
    btn.addEventListener("mouseout", () => (btn.textContent = liveText));
    btn.addEventListener("click", () => {
        btn.textContent = buyText;
        walletModal?.classList.remove("hidden");
    });
}

// Dropdown Menu Toggle
function toggleMenu() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function initTugOfWar() {
    const tokenBar = document.getElementById("tokenBar");
    const wasteBar = document.getElementById("wasteBar");
    const tokenValue = document.getElementById("tokenValue");
    const wasteValue = document.getElementById("wasteValue");
    if (!tokenBar || !wasteBar || !tokenValue || !wasteValue) return;

    const maxTokens = 92_000_000;
    const maxWaste = 92_000_000_000; // kg (92 million tons)
    let tokens = 0;
    let waste = maxWaste;

    function step() {
        tokens += maxTokens / 200;
        waste -= maxWaste / 200;
        if (tokens >= maxTokens && waste <= 0) {
            tokens = 0;
            waste = maxWaste;
        }

        const progress = ((tokens / maxTokens) + (1 - waste / maxWaste)) / 2;
        tokenBar.style.width = progress * 100 + "%";
        wasteBar.style.width = (1 - progress) * 100 + "%";

        tokenValue.textContent = Math.round(tokens).toLocaleString() + " Thrift Tokens";
        wasteValue.textContent = Math.round(waste).toLocaleString() + " kg Waste";
    }

    step();
    setInterval(step, 100);
}

async function initPolyesterChart() {
    const canvas = document.getElementById("polyesterChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Unwanted Clothing Items (annual count, millions)",
                    data: [],
                    borderColor: "#ff0000",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    borderWidth: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Unwanted Clothing Items Trajectory (Annual Count)" }
            },
            scales: {
                x: { title: { display: true, text: "Year" } },
                y: { beginAtZero: true, title: { display: true, text: "Items (millions per year)" } }
            }
        }
    });

    async function fetchCount() {
        try {
            const response = await fetch("https://api.worldrecycle.net/unwanted-clothes-count");
            const data = await response.json();
            return data.count;
        } catch (err) {
            return Math.floor(Math.random() * 50) + 50; // Fallback simulated data
        }
    }

    let year = new Date().getFullYear();
    async function updateChart() {
        const count = await fetchCount();
        chart.data.labels.push(year++);
        chart.data.datasets[0].data.push(count);
        if (chart.data.labels.length > 20) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }

    updateChart();
    setInterval(updateChart, 5000);
}

async function initFiberComparisonChart() {
    const canvas = document.getElementById("fiberComparisonChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    async function fetchData() {
        try {
            const response = await fetch("https://api.worldrecycle.net/landfill-breakdown");
            return await response.json();
        } catch (err) {
            return { polyester: 52, cotton: 29, denim: 12, leather: 7 };
        }
    }

    const stats = await fetchData();
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Polyester", "Cotton", "Denim", "Leather"],
            datasets: [
                {
                    label: "Annual Landfill Waste (million tons)",
                    data: [stats.polyester, stats.cotton, stats.denim, stats.leather],
                    backgroundColor: ["#ff0000", "#ffcc00", "#66ccff", "#99e26b"],
                    borderColor: ["#ff0000", "#ffcc00", "#66ccff", "#99e26b"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Annual Landfill Textile Waste by Material" },
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Million tons per year" } },
            },
        },
    });
}

async function initICOProgressChart() {
    const canvas = document.getElementById("icoProgressChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const goal = 20_000_000;
    let chart;

    async function fetchRaised() {
        try {
            const response = await fetch("https://api.thrifttoken.org/ico-progress");
            const data = await response.json();
            return data.raised;
        } catch (err) {
            return Math.random() * goal * 0.8;
        }
    }

    async function updateChart() {
        const raised = await fetchRaised();
        const remaining = Math.max(goal - raised, 0);
        if (!chart) {
            chart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Raised", "Remaining"],
                    datasets: [{
                        data: [raised, remaining],
                        backgroundColor: ["#c69cd9", "#ffffff"],
                        borderColor: "#000",
                        borderWidth: 4,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                    animation: { animateScale: true, animateRotate: true },
                },
            });
        } else {
            chart.data.datasets[0].data = [raised, remaining];
            chart.update();
        }
        const amountEl = document.getElementById("icoRaisedAmount");
        if (amountEl) {
            amountEl.textContent = `$${Math.round(raised).toLocaleString()}`;
        }
    }

    updateChart();
    setInterval(updateChart, 5000);
}

function initRecycleAnimation() {
    const canvas = document.getElementById('recycleAnimation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const ground = H - 20;
    const hub = { x: W - 60, y: ground - 20, width: 60, height: 40 };
    const droneSpeed = 1;

    const clothingTypes = ['shirt', 'pants', 'shorts', 'bag'];
    const clothingColors = ['#e63946', '#ffb703', '#2a9d8f', '#457b9d', '#e07a5f'];

    function spawnClothing() {
        let x;
        do {
            x = Math.random() * (W * 0.4) + 20;
        } while (x > hub.x - hub.width / 2 - 40); // keep clothes away from the hub
        return {
            x,
            y: ground - 10,
            picked: false,
            type: clothingTypes[Math.floor(Math.random() * clothingTypes.length)],
            color: clothingColors[Math.floor(Math.random() * clothingColors.length)]
        };
    }

    const clothes = Array.from({ length: 5 }, spawnClothing);
    const people = Array.from({ length: 4 }, (_, i) => ({
        x: W * 0.35 + i * 40,
        y: ground - 10,
        picked: false,
        type: clothingTypes[Math.floor(Math.random() * clothingTypes.length)],
        color: clothingColors[Math.floor(Math.random() * clothingColors.length)]
    }));
    const drones = [];
    const tokens = [];

    const tokenImg = new Image();
    tokenImg.src = 'coins/thrift.png';

    const hubImg = new Image();
    hubImg.src = 'logo/thrifttoken.png';

    const droneLogoImg = new Image();
    droneLogoImg.src = 'logo/thrifttoken.png';

    const textileImg = new Image();
    textileImg.src = 'textilepile.png';
    let textileScale = 1;

    function drawClothing(ctx, x, y, type = 'shirt', color = '#6d6875') {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        switch (type) {
            case 'pants':
                ctx.fillRect(x, y, 6, 15);
                ctx.fillRect(x + 8, y, 6, 15);
                ctx.strokeRect(x, y, 6, 15);
                ctx.strokeRect(x + 8, y, 6, 15);
                break;
            case 'shorts':
                ctx.fillRect(x, y, 6, 10);
                ctx.fillRect(x + 8, y, 6, 10);
                ctx.strokeRect(x, y, 6, 10);
                ctx.strokeRect(x + 8, y, 6, 10);
                break;
            case 'bag':
                ctx.fillRect(x + 2, y + 5, 10, 10);
                ctx.strokeRect(x + 2, y + 5, 10, 10);
                ctx.beginPath();
                ctx.moveTo(x + 2, y + 5);
                ctx.quadraticCurveTo(x + 7, y - 3, x + 12, y + 5);
                ctx.stroke();
                break;
            default:
                ctx.beginPath();
                ctx.moveTo(x + 3, y); // left shoulder
                ctx.lineTo(x + 6, y); // neck left
                ctx.lineTo(x + 7.5, y + 3); // neck bottom
                ctx.lineTo(x + 9, y); // neck right
                ctx.lineTo(x + 12, y); // right shoulder
                ctx.lineTo(x + 15, y + 5); // right sleeve end
                ctx.lineTo(x + 12, y + 5); // right sleeve inner
                ctx.lineTo(x + 12, y + 15); // right bottom
                ctx.lineTo(x + 3, y + 15); // left bottom
                ctx.lineTo(x + 3, y + 5); // left sleeve inner
                ctx.lineTo(x, y + 5); // left sleeve end
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
        }
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function drawPerson(ctx, person) {
        const { x, y } = person;
        const bodyWidth = 18;
        const bodyHeight = 26;
        const headRadius = 6;

        // torso
        const torsoX = x - bodyWidth / 2;
        const torsoY = y - bodyHeight + 4;
        const torsoGrad = ctx.createLinearGradient(torsoX, torsoY, torsoX, torsoY + bodyHeight);
        torsoGrad.addColorStop(0, '#1f2a44');
        torsoGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = torsoGrad;
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        drawRoundedRect(ctx, torsoX, torsoY, bodyWidth, bodyHeight, 6);
        ctx.fill();
        ctx.stroke();

        // head
        ctx.fillStyle = '#f2d0a9';
        ctx.beginPath();
        ctx.arc(x, torsoY - headRadius + 2, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // accent collar
        ctx.fillStyle = '#ff9d5c';
        drawRoundedRect(ctx, torsoX + 4, torsoY + 4, bodyWidth - 8, 6, 3);
        ctx.fill();

        // arms
        ctx.fillStyle = '#1f2a44';
        drawRoundedRect(ctx, torsoX - 8, torsoY + 6, 8, 12, 4);
        ctx.fill();
        drawRoundedRect(ctx, torsoX + bodyWidth, torsoY + 6, 8, 12, 4);
        ctx.fill();

        // legs
        drawRoundedRect(ctx, x - 9, y - 6, 8, 14, 3);
        ctx.fill();
        drawRoundedRect(ctx, x + 1, y - 6, 8, 14, 3);
        ctx.fill();

        if (!person.picked) {
            drawClothing(ctx, x - 8, torsoY - 6, person.type, person.color);
        }
    }

    function spawnDroneToClothes() {
        const candidates = clothes.filter(c => !c.picked);
        if (candidates.length) {
            candidates.sort((a, b) => a.x - b.x); // prioritize leftmost clothing
            const target = candidates[0];
            drones.push({ x: -30, y: 40, state: 'toClothes', target, carry: [] });
        }
    }

    function spawnDroneToPerson() {
        const candidates = people.filter(
            p => !p.picked && !drones.some(d => d.state === 'toPerson' && d.target === p)
        );
        if (candidates.length) {
            candidates.sort((a, b) => a.x - b.x); // serve people from left to right
            const target = candidates[0];
            drones.push({ x: -30, y: 40, state: 'toPerson', target, carry: [] });
        }
    }

    function maintainDrones() {
        if (drones.filter(d => d.state === 'toClothes').length < 1) {
            spawnDroneToClothes();
        }
        while (drones.filter(d => d.state === 'toPerson').length < 2) {
            spawnDroneToPerson();
        }
    }

    maintainDrones();
    setInterval(maintainDrones, 2000);

    function loop() {
        ctx.clearRect(0, 0, W, H);

        // draw sleek hub enclosure
        const hubLeft = hub.x - hub.width / 2;
        const hubTop = hub.y - hub.height / 2;
        ctx.save();
        ctx.shadowColor = 'rgba(255, 158, 104, 0.35)';
        ctx.shadowBlur = 18;
        const hubGrad = ctx.createLinearGradient(hubLeft, hubTop, hubLeft + hub.width, hubTop + hub.height);
        hubGrad.addColorStop(0, '#1b2436');
        hubGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = hubGrad;
        drawRoundedRect(ctx, hubLeft, hubTop, hub.width, hub.height, 12);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.stroke();
        ctx.restore();

        if (hubImg.complete) {
            const maxWidth = hub.width * 0.6;
            const maxHeight = hub.height * 0.6;
            const scale = Math.min(maxWidth / hubImg.width, maxHeight / hubImg.height);
            const logoW = hubImg.width * scale;
            const logoH = hubImg.height * scale;
            ctx.drawImage(
                hubImg,
                hub.x - logoW / 2,
                hub.y - logoH / 2,
                logoW,
                logoH
            );
        }

        // textile pile background on left side
        if (textileImg.complete) {
            ctx.filter = 'contrast(1.2) saturate(1.4)';
            const texW = 110 * textileScale;
            const texH = 75 * textileScale;
            ctx.drawImage(textileImg, 10, ground - texH, texW, texH);
            ctx.filter = 'none';
            textileScale -= 0.001;
            if (textileScale <= 0) textileScale = 1;
        }

        clothes.forEach(c => {
            if (!c.picked) {
                drawClothing(ctx, c.x, c.y - 15, c.type, c.color);
            }
        });

        people.forEach(p => {
            drawPerson(ctx, p);
        });

        drones.forEach((d, i) => {
            if (d.state === 'toClothes') {
                const dx = d.target.x - d.x;
                const dy = (d.target.y - 20) - d.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 2) {
                    d.carry.push(d.target);
                    d.target.picked = true;
                    d.state = 'toHub';
                } else {
                    d.x += (dx / dist) * droneSpeed;
                    d.y += (dy / dist) * droneSpeed;
                }
            } else if (d.state === 'toPerson') {
                const dx = d.target.x - d.x;
                const dy = (d.target.y - 20) - d.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 2) {
                    d.target.picked = true;
                    d.state = 'toHub';
                } else {
                    d.x += (dx / dist) * droneSpeed;
                    d.y += (dy / dist) * droneSpeed;
                }
            } else if (d.state === 'toHub') {
                const dx = hub.x - d.x;
                const dy = (hub.y - hub.height / 2) - d.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 2) {
                    for (let j = 0; j < 5; j++) {
                        tokens.push({ x: hub.x, y: hub.y - hub.height / 2, vx: Math.random() * 2 - 1, vy: -Math.random() * 2 - 1, life: 60 });
                    }
                    clothes.forEach(item => {
                        if (item.picked) {
                            Object.assign(item, spawnClothing());
                        }
                    });
                    people.forEach(p => {
                        if (p.picked) {
                            p.picked = false;
                            p.x = Math.random() * (W * 0.3) + W * 0.35;
                            p.y = ground - 10;
                            p.type = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
                            p.color = clothingColors[Math.floor(Math.random() * clothingColors.length)];
                        }
                    });
                    drones.splice(i, 1);
                } else {
                    d.x += (dx / dist) * droneSpeed;
                    d.y += (dy / dist) * droneSpeed;
                }
            }

            d.carry.forEach(item => {
                item.x = d.x;
                item.y = d.y + 20;
            });

            ctx.fillStyle = '#ced4da';
            ctx.fillRect(d.x - 10, d.y - 5, 20, 10);
            ctx.fillStyle = '#6c757d';
            ctx.fillRect(d.x - 5, d.y - 8, 10, 3);
            if (droneLogoImg.complete) {
                const maxLogoW = 14;
                const maxLogoH = 8;
                const scale = Math.min(maxLogoW / droneLogoImg.width, maxLogoH / droneLogoImg.height);
                const logoW = droneLogoImg.width * scale;
                const logoH = droneLogoImg.height * scale;
                ctx.drawImage(droneLogoImg, d.x - logoW / 2, d.y - logoH / 2, logoW, logoH);
            }
            ctx.strokeStyle = '#6c757d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(d.x - 12, d.y - 7);
            ctx.lineTo(d.x - 20, d.y - 7);
            ctx.moveTo(d.x + 12, d.y - 7);
            ctx.lineTo(d.x + 20, d.y - 7);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(d.x - 20, d.y - 7, 3, 0, Math.PI * 2);
            ctx.arc(d.x + 20, d.y - 7, 3, 0, Math.PI * 2);
            ctx.fill();

            d.carry.forEach(c => {
                drawClothing(ctx, c.x - 7, c.y, c.type, c.color);
            });
        });

        tokens.forEach((t, idx) => {
            t.x += t.vx;
            t.y += t.vy;
            t.vy += 0.05;
            t.life--;
            if (tokenImg.complete) {
                ctx.drawImage(tokenImg, t.x - 5, t.y - 5, 10, 10);
            } else {
                ctx.fillStyle = '#800080';
                ctx.beginPath();
                ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i].life <= 0) tokens.splice(i, 1);
        }

        requestAnimationFrame(loop);
    }
    loop();
}

// MetaMask Wallet Connection
document.addEventListener("DOMContentLoaded", function () {
    const connectWalletBtn = document.getElementById("connectWallet");
    const walletModal = document.getElementById("walletModal");
    const modalClose = document.getElementById("modalClose");
    const languageBtn = document.getElementById("languageButton");
    const languageContainer = document.querySelector(".language-container");
    const chatToggle = document.getElementById("chatbotToggle");
    const chatBox = document.getElementById("chatbot");
    const chatClose = document.getElementById("chatbotClose");
    const chatInput = document.getElementById("chatbotInput");
    const chatSend = document.getElementById("chatbotSend");
    const chatMessages = document.getElementById("chatbotMessages");
    const walletInfoLink = document.getElementById("walletInfoLink");
    const walletInfoModal = document.getElementById("walletInfoModal");
    const walletInfoClose = document.getElementById("walletInfoClose");
    const walletOptions = document.querySelectorAll(".wallet-option");

    connectWalletBtn?.addEventListener("click", () => {
        walletModal?.classList.remove("hidden");
    });
    modalClose?.addEventListener("click", () => walletModal.classList.add("hidden"));
    walletModal?.addEventListener("click", (e) => {
        if (e.target === walletModal) walletModal.classList.add("hidden");
    });

    walletInfoLink?.addEventListener("click", (e) => {
        e.preventDefault();
        walletInfoModal?.classList.remove("hidden");
    });
    walletInfoClose?.addEventListener("click", () => walletInfoModal?.classList.add("hidden"));
    walletInfoModal?.addEventListener("click", (e) => {
        if (e.target === walletInfoModal) walletInfoModal.classList.add("hidden");
    });

    async function connectToWallet(type) {
        try {
            const providers = window.ethereum?.providers || [window.ethereum];
            let provider;
            switch (type) {
                case "metamask":
                    provider = providers?.find(p => p.isMetaMask);
                    break;
                case "coinbase":
                    provider = providers?.find(p => p.isCoinbaseWallet) || window.coinbaseWalletExtension;
                    break;
                case "base":
                    provider = providers?.find(p => p.isBaseWallet || p.isBase);
                    break;
                case "walletconnect":
                    provider = providers?.find(p => p.isWalletConnect);
                    break;
                case "best":
                    provider = providers?.find(p => p.isBestWallet) || window.BestWallet;
                    break;
            }
            if (provider) {
                await provider.request({ method: "eth_requestAccounts" });
                walletModal?.classList.add("hidden");
                return;
            }
            const urls = {
                best: "https://bestwallet.com",
                walletconnect: "https://walletconnect.com",
                metamask: "https://metamask.io/download/",
                base: "https://www.base.org/wallet",
                coinbase: "https://www.coinbase.com/wallet",
            };
            const fallback = urls[type];
            if (fallback) {
                window.open(fallback, "_blank", "noopener");
            }
        } catch (err) {
            console.error("Wallet connection failed", err);
        }
    }

    walletOptions.forEach(option => {
        option.addEventListener("click", () => {
            const wallet = option.getAttribute("data-wallet");
            const url = option.getAttribute("data-url");
            if (wallet) {
                connectToWallet(wallet);
            } else if (url) {
                window.open(url, "_blank", "noopener");
                walletModal?.classList.add("hidden");
            }
        });
    });

    const purchases = [
        "[0x4eA9...b0FC2] bought 14.7K $THRIFT worth $0.44",
        "[0xd83A...41d66] bought 3K $THRIFT worth $38.30",
        "[0x83C0...DC2dF] bought 648 $THRIFT worth $8.27",
        "[0xBc22...5d7aE] bought 18.7K $THRIFT worth $238.90",
        "[0xd83A...41d66] bought 7K $THRIFT worth $89.36",
        "[0x53EF...417A5] bought 906 $THRIFT worth $11.57",
        "[0x566E...0DaB5] bought 77.9K $THRIFT worth $994.50",
        "[0x9F16...4a713] bought 86.7K $THRIFT worth $1106.85",
        "[0xD7ad...E5bE4] bought 6.3K $THRIFT worth $80.90",
        "[0xC076...7ad47] bought 50 $THRIFT worth $0.64"
    ];

    function generateRandomPurchase() {
        const randHex = () => Math.floor(Math.random() * 0xfffff).toString(16).padStart(5, "0");
        const address = `[0x${randHex()}...${randHex()}]`;
        const tokens = Math.random() * 100000 + 100;
        const displayTokens = tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : tokens.toFixed(0);
        const usd = (tokens * 0.0125).toFixed(2);
        return `${address} bought ${displayTokens} $THRIFT worth $${usd}`;
    }

    function initPurchaseTicker() {
        const tickerTrack = document.getElementById("tickerTrack");
        const tickerContainer = document.getElementById("tickerWrapper");
        if (!(tickerTrack && tickerContainer)) return;

        const baseContent = purchases
            .map(p => `<span class="purchase-item">${p}</span>`)
            .join("");
        tickerTrack.innerHTML = baseContent;
        let repetitions = 1;
        while (tickerTrack.scrollWidth < tickerContainer.offsetWidth * 2) {
            tickerTrack.innerHTML += baseContent;
            repetitions++;
        }
        if (repetitions % 2 !== 0) {
            tickerTrack.innerHTML += baseContent;
        }

        tickerTrack.style.animation = "none";
        tickerTrack.style.webkitAnimation = "none";
        void tickerTrack.offsetWidth;
        tickerTrack.style.animation = "";
        tickerTrack.style.webkitAnimation = "";
    }

    function addRandomPurchase() {
        purchases.push(generateRandomPurchase());
        if (purchases.length > 20) purchases.shift();
        initPurchaseTicker();
    }

    let lastTickerWidth = window.innerWidth;
    initPurchaseTicker();
    window.addEventListener("resize", () => {
        if (window.innerWidth === lastTickerWidth) return;
        lastTickerWidth = window.innerWidth;
        initPurchaseTicker();
    });

    setInterval(addRandomPurchase, 7000);

    if (languageBtn && languageContainer) {
        languageBtn.addEventListener("click", () => {
            languageContainer.classList.toggle("open");
        });
    }

    function appendMessage(text, className) {
        const div = document.createElement("div");
        div.className = className;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendChat() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        appendMessage(userMessage, "chat-user");
        chatInput.value = "";
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (window.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY"),
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: userMessage }],
                }),
            });
            const data = await response.json();
            const botMessage = data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't understand.";
            appendMessage(botMessage, "chat-bot");
        } catch (err) {
            console.error("Chat request failed:", err);
            appendMessage("Error contacting server.", "chat-bot");
        }
    }

    chatToggle?.addEventListener("click", () => {
        chatBox.classList.toggle("hidden");
        if (!chatBox.classList.contains("hidden") && !/Mobi|Android/i.test(navigator.userAgent)) {
            chatInput.focus();
        }
    });

    chatClose?.addEventListener("click", () => chatBox.classList.add("hidden"));

    chatSend?.addEventListener("click", sendChat);

    chatInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendChat();
        }
    });

    const navLinks = document.querySelectorAll('#dropdown-menu a');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function setActiveLink(link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
            const offsetPos = Math.max(elementPos - headerOffset, 0);
            window.scrollTo({ top: offsetPos, behavior: 'smooth' });
            setActiveLink(link);
            document.getElementById('dropdown-menu').style.display = 'none';
        });
    });

    const logoLink = document.querySelector('.logo a');
    logoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveLink(navLinks[0]);
    });

    function highlightOnScroll() {
        const headerOffset = document.querySelector('header').offsetHeight;
        const scrollPos = window.scrollY + headerOffset;
        const index = sections.findIndex(sec => scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight);
        if (index !== -1) {
            setActiveLink(navLinks[index]);
        } else {
            setActiveLink(navLinks[0]);
        }
    }

    window.addEventListener('scroll', highlightOnScroll);

    highlightOnScroll();

    const roadmapPhases = document.querySelectorAll(".roadmap-phase");
    const phaseObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = Array.from(roadmapPhases).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.3}s`;
                entry.target.classList.add("visible");
                phaseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    roadmapPhases.forEach((phase) => phaseObserver.observe(phase));

    initRecycleAnimation();

    try {
        initFiberComparisonChart();
    } catch (e) {
        console.error('initFiberComparisonChart failed', e);
    }

    try {
        initPolyesterChart();
    } catch (e) {
        console.error('initPolyesterChart failed', e);
    }

    try {
        initTugOfWar();
    } catch (e) {
        console.error('initTugOfWar failed', e);
    }

    try {
        initICOProgressChart();
    } catch (e) {
        console.error('initICOProgressChart failed', e);
    }

    try {
        updateLivePrices();
        setInterval(updateLivePrices, 10000);
    } catch (e) {
        console.error('updateLivePrices failed', e);
    }

    try {
        initHeroIcoProgress();
    } catch (e) {
        console.error('initHeroIcoProgress failed', e);
    }

    try {
        initPresaleButton();
    } catch (e) {
        console.error('initPresaleButton failed', e);
    }
});
