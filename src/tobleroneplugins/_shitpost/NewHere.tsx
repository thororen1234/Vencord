/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, useSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    message: {
        type: OptionType.STRING,
        description: "",
        default: "I'm new here, avoid me at all costs."
    }
});

export default definePlugin({
    name: "NewHere",
    description: "Replaces the new user text with whatever you want",
    settings,
    authors: [Devs.Samwich],
    patches: [
        {
            find: "className:d.newMemberBadge",
            replacement: {
                match: /\i.default.Messages.NEW_MEMBER_BADGE_TOOLTIP_TEXT/,
                replace: "$self.settings.store.message"
            },
        },
        {
            find: "AnalyticEvents.NEW_MEMBER_MENTION_CTA_CLICKED",
            replacement: {
                match: /\i.default.Messages.NEW_MEMBER_BADGE_TOOLTIP_TEXT/,
                replace: "$self.settings.store.message"
            },
        }
    ],
    lowEffort: true
});