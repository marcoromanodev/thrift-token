
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
        <div class="time-segment">
            <span class="count-num">${days}</span>
            <span class="count-label">Days</span>
        </div>
        <div class="time-segment">
            <span class="count-num">${hrs}</span>
            <span class="count-label">Hours</span>
        </div>
        <div class="time-segment">
            <span class="count-num">${mins}</span>
            <span class="count-label">Minutes</span>
        </div>
        <div class="time-segment">
            <span class="count-num">${secs}</span>
            <span class="count-label">Seconds</span>
        </div>`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Dropdown Menu Toggle
function toggleMenu() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function initTugOfWar() {
    const tokenBar = document.getElementById("tokenBar");
    const wasteBar = document.getElementById("wasteBar");
    const tokenCount = document.getElementById("tokenCount");
    const wasteCount = document.getElementById("wasteCount");
    if (!tokenBar || !wasteBar) return;

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

        tokenCount.textContent = Math.round(tokens).toLocaleString() + " Thrift Tokens";
        wasteCount.textContent = Math.round(waste).toLocaleString() + " kg Waste";
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
    const hub = { x: W - 60, y: ground - 40 };
    const hubRadius = 25;
    const baseHeight = 20;

    const clothingTypes = ['shirt', 'pants', 'shorts', 'bag'];
    const clothingColors = ['#e63946', '#ffb703', '#2a9d8f', '#457b9d', '#e07a5f'];

    function spawnClothing() {
        let x;
        do {
            x = Math.random() * (W * 0.4) + 20;
        } while (x > hub.x - hubRadius - 40); // keep clothes away from the hub
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

    function drawPerson(ctx, person) {
        const { x, y } = person;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#f2d0a9';
        // head
        ctx.beginPath();
        ctx.arc(x, y - 12, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // body
        ctx.beginPath();
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x, y);
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x - 5, y - 10);
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x + 5, y - 10);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 4, y + 8);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 4, y + 8);
        ctx.stroke();
        if (!person.picked) {
            drawClothing(ctx, x - 8, y - 25, person.type, person.color);
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

        // draw futuristic dome hub
        ctx.save();
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;
        const domeGrad = ctx.createLinearGradient(hub.x - hubRadius, hub.y - hubRadius, hub.x + hubRadius, hub.y);
        domeGrad.addColorStop(0, '#8ecae6');
        domeGrad.addColorStop(1, '#219ebc');
        ctx.fillStyle = domeGrad;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hubRadius, Math.PI, 0);
        ctx.fill();
        const baseGrad = ctx.createLinearGradient(hub.x - hubRadius, hub.y, hub.x - hubRadius, hub.y + baseHeight);
        baseGrad.addColorStop(0, '#8ecae6');
        baseGrad.addColorStop(1, '#219ebc');
        ctx.fillStyle = baseGrad;
        ctx.fillRect(hub.x - hubRadius, hub.y, hubRadius * 2, baseHeight);
        ctx.restore();
        ctx.strokeStyle = '#023047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hubRadius, Math.PI, 0);
        ctx.stroke();
        ctx.strokeRect(hub.x - hubRadius, hub.y, hubRadius * 2, baseHeight);
        ctx.fillStyle = '#ffb703';
        const doorX = hub.x - 5;
        const doorY = hub.y + baseHeight / 2;
        const doorW = 10;
        const doorH = baseHeight / 2;
        ctx.fillRect(doorX, doorY, doorW, doorH);
        ctx.strokeRect(doorX, doorY, doorW, doorH);
        if (hubImg.complete) {
            // keep the Thrift Token logo sized to the hub and centered
            const maxWidth = hubRadius * 1.8;
            const maxHeight = hubRadius * 0.9;
            const scale = Math.min(maxWidth / hubImg.width, maxHeight / hubImg.height);
            const logoW = hubImg.width * scale;
            const logoH = hubImg.height * scale;
            ctx.drawImage(
                hubImg,
                hub.x - logoW / 2,
                hub.y - hubRadius / 2 - logoH / 2,
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
                    d.x += (dx / dist) * 3;
                    d.y += (dy / dist) * 3;
                }
            } else if (d.state === 'toPerson') {
                const dx = d.target.x - d.x;
                const dy = (d.target.y - 20) - d.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 2) {
                    d.target.picked = true;
                    d.state = 'toHub';
                } else {
                    d.x += (dx / dist) * 3;
                    d.y += (dy / dist) * 3;
                }
            } else if (d.state === 'toHub') {
                const dx = hub.x - d.x;
                const dy = hub.y - d.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 2) {
                    for (let j = 0; j < 5; j++) {
                        tokens.push({ x: hub.x, y: hub.y, vx: Math.random() * 2 - 1, vy: -Math.random() * 2 - 1, life: 60 });
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
                    d.x += (dx / dist) * 3;
                    d.y += (dy / dist) * 3;
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
    const languageBtn = document.getElementById("languageButton");
    const languageContainer = document.querySelector(".language-container");
    const chatToggle = document.getElementById("chatbotToggle");
    const chatBox = document.getElementById("chatbot");
    const chatClose = document.getElementById("chatbotClose");
    const chatInput = document.getElementById("chatbotInput");
    const chatSend = document.getElementById("chatbotSend");
    const chatMessages = document.getElementById("chatbotMessages");

    connectWalletBtn.addEventListener("click", async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                connectWalletBtn.textContent = "Wallet: " + accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            alert("Please install MetaMask to use this feature.");
        }
    });

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
});
