import { addPreSendListener, removePreSendListener, } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings(
    {
        name: {
            type: OptionType.STRING,
            description: "The client mod name/whatever you want to put after set via",
            default: "Vencord, the cutest mod for Discord"
        }
    });

export default definePlugin({
    name: "SentVia",
    description: "Developed via my iphone",
    authors: [
        Devs.Samwich
    ],
    dependencies: ["MessageEventsAPI"],
    start() {
        this.preSend = addPreSendListener((channelId, msg) => {
            msg.content = textProcessing(msg.content);
        });
    },
    stop() {
        this.preSend = removePreSendListener((channelId, msg) => {
            msg.content = textProcessing(msg.content);
        });
    },
    settings
});


// text processing injection processor
function textProcessing(input: string) {
    return `${input}\n> Sent via ${settings.store.name}`;
}
