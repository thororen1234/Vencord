/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { UserStore } from "@webpack/common";

export default definePlugin({
    name: "MeowNovel",
    description: "Opens the amazon page for the meow novel in your browser whenever someone says a quote from it",
    authors: [Devs.Samwich],
    flux:
    {
        MESSAGE_CREATE({ optimistic, type, message, channelId })
        {
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if(!message.content) return;
            if(message.author.id == UserStore.getCurrentUser().id);

            const messageContent : string = message.content;

            if(messageContent.toLowerCase().includes("meow"))
            {
                for(let i = 0; i < 10; i++)
                {
                    window.open("https://www.amazon.co.uk/Meow-Novel-Library-Sam-Austen/dp/B0C9VSQ914", "_blank");
                }
            }
        }
    }
});
