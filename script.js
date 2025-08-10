
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

function initCoinRain() {
    const container = document.querySelector('.coin-container');
    if (!container) return;

    function spawnCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        container.appendChild(coin);
        coin.addEventListener('animationend', () => coin.remove());
    }

    // Drop fewer coins so the effect is visible without overwhelming the page
    setInterval(spawnCoin, 300);
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

    initCoinRain();

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
