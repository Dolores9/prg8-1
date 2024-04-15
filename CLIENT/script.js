let chatHistory = [];

async function interpretInput() {
    const textInput = document.getElementById("textInput").value;

    const response = await fetch('/interpret', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textInput, chatHistory })
    });

    const data = await response.json();

    if (data.success) {
        // Update de chatgeschiedenis met het antwoord van de server
        const responseText = data.response;
        addToChatHistory(responseText);
        updateChatUI();
    } else {
        alert(data.message); // Toon een foutmelding als er een probleem optreedt
    }
}

function addToChatHistory(message) {
    chatHistory.push(message);
}

function updateChatUI() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.innerHTML = '';

    chatHistory.forEach(message => {
        const div = document.createElement("div");
        div.textContent = message;
        chatContainer.appendChild(div);
    });
}
