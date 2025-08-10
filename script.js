
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
                    label: "Unwanted Clothing Items (millions)",
                    data: [],
                    borderColor: "#c69cd9",
                    backgroundColor: "rgba(198,156,217,0.2)",
                    borderWidth: 3,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Unwanted Clothing Items in Thrifts (Live)" }
            },
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { beginAtZero: true, title: { display: true, text: "Items (millions)" } }
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

    async function updateChart() {
        const count = await fetchCount();
        const now = new Date().toLocaleTimeString();
        chart.data.labels.push(now);
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

    initPolyesterChart();
});
