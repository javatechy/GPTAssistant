// Load API key and prompts from local storage
document.getElementById("apiKeyInput").value = localStorage.getItem("apiKey");
document.getElementById("promptPrefixInput").value = localStorage.getItem("promptPrefix");

const spinner = document.getElementById("spinner");

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('generateInsight').addEventListener('click', function () {
        const inputData = document.getElementById('data').value;
        const apiKey = document.getElementById("apiKeyInput").value;
        const prefix = document.getElementById("promptPrefixInput").value

        spinner.style.display = "block";
        localStorage.setItem("apiKey", apiKey)
        localStorage.setItem("promptPrefix", document.getElementById("promptPrefixInput").value)
        generateInsight(prefix, inputData, apiKey);
        document.getElementById("copy-to-clipboard").style.display = "inline";
        
    });
});

document.getElementById("copy-to-clipboard").addEventListener("click", function () {
    const textarea = document.getElementById("result");
    textarea.select();
    document.execCommand("copy");
});

function generateInsight(prefix, data, apiKey) {
    const prompt = prefix + '"' + data + '"';
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
                max_tokens: 1024,
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
                spinner.style.display = "none";
            })
            .then((result) => {
                console.log(result);
                // alert(JSON.stringify(result))
                document.getElementById("result").innerHTML = result.choices[0].text;
                console.log(result.choices[0].text);
                resolve(result.choices[0].text);
                spinner.style.display = "none";
            })
            .catch((error) => {
                reject(error);
                spinner.style.display = "none";
            });
    });
}

function generateInsight2(prefix, data, apiKey) {
    const inputPrompt = prefix + '"' + data + '"';
    const response = [];
    const codeLength = inputPrompt.length;
    const maxTokens = 4097;
    const apiUrl = "https://api.openai.com/v1/completions";

    const makeRequest = (offset) => {
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
                    max_tokens: 1024,
                    n: 1,
                    temperature: 0.5
                })
            })
                .then((result) => {
                    // document.getElementById("copy-button").style.display = "inline";
                    console.log(result);
                    console.log("*************************************************************");
                    console.log(result.choices[0].text);
                    console.log("*************************************************************");
                    response.push(result.choices[0].text);
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
        });
    };

    const processCode = (offset) => {
        if (offset >= codeLength) {
            return Promise.resolve();
        }
        return makeRequest(offset).then(() => processCode(offset + maxTokens));
    };

    processCode(0).then(() => {
        const responseText = response.join("\n");
        console.log(responseText);
    });

}