import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { getCurrentChannel } from "@utils/discord";
import definePlugin, { OptionType, PluginDef } from "@utils/types";
import OpenAI from "openai";

let openai;

const settings = definePluginSettings({
    apiKey: {
        type: OptionType.STRING,
        description: "Your OpenAI API Key",
        default: "",
        restartNeeded: false
    }
});

async function readOutText(text) {

    const voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

    const randomVoiceIndex = Math.floor(Math.random() * voices.length);
    const randomVoice = voices[randomVoiceIndex];

    const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: randomVoice,
        input: text,
    });

    const mp3Data = await mp3Response.arrayBuffer();

    const mp3Blob = new Blob([mp3Data], { type: 'audio/mpeg' });

    const audioElement = new Audio();

    const audioURL = URL.createObjectURL(mp3Blob);

    audioElement.src = audioURL;
    audioElement.volume = 0.5;

    document.body.appendChild(audioElement);

    audioElement.play();
}


export default definePlugin({
    name: "TextToSpeech",
    description: "Reads out chat messages with openai tts",
    authors: [Devs.Samwich],
    flux:
    {
        async MESSAGE_CREATE({ optimistic, type, message, channelId }) {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.content) return;
            if(message.channel_id !== getCurrentChannel().id) return;

            console.log("running;");
            readOutText(message.content);
        }
    },
    settings,
    start()
    {
        openai = new OpenAI({ apiKey: settings.store.apiKey, dangerouslyAllowBrowser: true });
    }
});
