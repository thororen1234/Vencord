import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { UserSettingsActionCreators } from "@webpack/common";

function getMessage(opts, other)
{
    let frecencyStore = UserSettingsActionCreators.FrecencyUserSettingsActionCreators.getCurrentValue();

    let gifsArray = Object.keys(frecencyStore.favoriteGifs.gifs);

    let chosenGifUrl = gifsArray[Math.floor(Math.random() * gifsArray.length)];

    let ownerPing = "";

    if(other.guild != null)
    {
        if(other.guild.ownerId != null)
        {
            ownerPing = settings.store.pingOwnerChance && Math.random() <= 0.1 ? `<@${other.guild.ownerId}>` : "";
        }
    }

    return `${chosenGifUrl} ${ownerPing}`;
}


const settings = definePluginSettings({
    pingOwnerChance: {
        type: OptionType.BOOLEAN,
        description: "If there should be a 1 in 10 change to ping the owner of the guild (oh no)",
        default: true
    }
});

export default definePlugin({
    name: "GifRoulette",
    description: "Adds a command to send a random gif from your favourites, and a one in ten chance to ping the owner of the server",
    authors: [Devs.Samwich],
    dependencies: ["CommandsAPI"],
    settings,
    commands: [
        {
            name: "gifroulette",
            description: "Time to tempt your fate",
            execute: (opts, other) => ({
                content: getMessage(opts, other)
            }),
        }
    ]
});
