/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType,findOption } from "@api/Commands";
import definePlugin from "@utils/types";

function generateGoogleLink(query) {
    const modifiedQuery = encodeURIComponent(query);
    const googleLink = "https://www.google.com/search?q=" + modifiedQuery;
    return googleLink;
}

export default definePlugin({
    name: "GoogleThat",
    description: "answer dumbass questions faster :3",
    authors: [
        {
            id: 976176454511509554n,
            name: "Sam",
        },
    ],
    dependencies: ["CommandsAPI"],
    commands: [
        {
            name: "google",
            description: ":3",
            options: [
                {
                    name: "input",
                    description: "what you want the google search to link to",
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                }],
            execute: opts => ({
                content: generateGoogleLink(findOption(opts, "input", "")),
            }),
        }
    ]
});
