export async function textProcessing(data) {
    
    let {input, prompt} = data;

    if (input.length == 0) { return input; }
    
    const requestBody = {
        model: "wizardlm-uncensored",
        prompt: `You are working for a message personifier, when messaged, respond the content of the users message, but ${prompt}. DO NOT Modify the original sentiment of the message and never respond to the users message, only respond with the modified version. If a user sends a link, leave it alone and do not add anything to it.`,
        input: input
    };

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        console.log(data);

        if (!data || !data.output) {
            return input;
        }

        return data.output;
    } catch (error) {
        console.error('Error processing text:', error);
        return input;
    }
}