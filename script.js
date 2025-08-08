
// Countdown Timer
const countdown = document.getElementById("countdown");
const launchDate = new Date("2025-12-01T00:00:00").getTime();

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

    countdown.innerHTML = `${days}d ${hrs}h ${mins}m ${secs}s`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Dropdown Menu Toggle
function toggleMenu() {
    const menu = document.getElementById("dropdown-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// MetaMask Wallet Connection
document.addEventListener("DOMContentLoaded", function () {
    const connectWalletBtn = document.getElementById("connectWallet");

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
});
