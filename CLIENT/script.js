async function interpretInput() {
    const textInput = document.getElementById("textInput").value;

    const response = await fetch('/interpret', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textInput })
    });

    const data = await response.json();

    if (data.success) {
        // Update de UI met de reactie van de server
        alert(data.message); // Toon een melding van het succesvol interpreteren
        updateTodoList(); // Werk de to-do lijst bij
    } else {
        alert(data.message); // Toon een foutmelding als interpretatie mislukt
    }
}

async function updateTodoList() {
    const response = await fetch('/todolist');
    const data = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = '';

    data.todoList.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task;
        taskList.appendChild(li);
    });
}

// Laad de to-do lijst bij het starten van de applicatie
updateTodoList();