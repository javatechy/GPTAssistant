// Load API key and prompts from local storage
document.getElementById("apiKeyInput").value = localStorage.getItem("apiKey");
document.getElementById("promptPrefixInput").value = localStorage.getItem("promptPrefix");

// let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
// prompts.forEach(prompt => {
//     addPromptInput(prompt);
// });

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('generateInsight').addEventListener('click', function () {
        const inputData = document.getElementById('data').value;
        const apiKey = document.getElementById("apiKeyInput").value;
        localStorage.setItem("apiKey", apiKey)
        localStorage.setItem("promptPrefix", document.getElementById("promptPrefixInput").value)
        generateInsight(inputData, apiKey);
    });
});

// function addPromptInput(prompt) {
//     let promptsContainer = document.querySelector(".prompt-inputs");
//     let promptInput = document.createElement("div");
//     promptInput.classList.add("prompt-input");
//     promptInput.innerHTML = `
//       <input type="text" class="prompt-item" value="${prompt}">
//       <span class="remove-prompt">x</span>
//     `;
//     promptsContainer.appendChild(promptInput);

//     let removePromptButton = promptInput.querySelector(".remove-prompt");
//     removePromptButton.addEventListener("click", function () {
//         promptsContainer.removeChild(promptInput);
//         updatePromptsInLocalStorage()
//     });
// }

// function updatePromptsInLocalStorage() {
//     let prompts = [];
//     let promptInputs = document.querySelectorAll(".prompt-inputs .prompt-item");
//     promptInputs.forEach(function (input) {
//         prompts.push(input.value);
//     });
//     localStorage.setItem("prompts", JSON.stringify(prompts));
// }


function generateInsight(data, apiKey) {
    const prompt = 'Rephrase "' + data + '\"';
    const apiUrl = "https://api.openai.com/v1/completions";

    return new Promise((resolve, reject) => {
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 100,
                n: 1,
                temperature: 0.5
            })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    // alert(JSON.stringify(response))
                    reject(response.statusText);
                }
            })
            .then((result) => {
                console.log(result);
                // alert(JSON.stringify(result))
                document.getElementById("result").innerHTML = result.choices[0].text;
                console.log(result.choices[0].text);
                resolve(result.choices[0].text);
            })
            .catch((error) => {
                reject(error);
            });
    });
}