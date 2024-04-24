import { addPreSendListener, removePreSendListener, } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { EmojiStore } from "@webpack/common";
import { Alerts } from "@webpack/common";
import definePlugin, { OptionType } from "@utils/types";

function getEmojiOK(id) : boolean
{
    if(EmojiStore.getCustomEmojiById(id) == null)
    {
        Alerts.show({ title: "Bad ID!", body: <p>The emoji ID in the plugin config is not a valid emoji, please select one.</p>});
        return false;
    }
    return true;
}

let messagePatch = (channelId, message) => 
{
    if(!getEmojiOK(settings.store.emojiID) || message.content.length == 0 || message.content == null) { return; }

    let emoji = EmojiStore.getCustomEmojiById(settings.store.emojiID);

    message.content = `${message.content} <:${emoji.name}:${emoji.id}>`;

}

const settings = definePluginSettings(
    {
        emojiID: {
            type: OptionType.STRING,
            description: "The id of the emoji to preface",
            default: ""
        }
});

export default definePlugin({
    name: "EmojiMessage",
    description: "Adds an emoji of your choice to the end of your message (funny)",
    authors: [
        Devs.Samwich
    ],
    dependencies: ["MessageEventsAPI"],
    start()
    {
        this.preSend = addPreSendListener(messagePatch);
        
    },
    stop()
    {
        this.preSend = removePreSendListener(messagePatch);
    },
    settings
});

