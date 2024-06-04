/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { addPreSendListener, MessageExtra, MessageObject, removePreSendListener } from "@api/MessageEvents";
import { showNotification } from "@api/Notifications";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { SelectedChannelStore } from "@webpack/common";
let id: string;

let curNotif: null | any = null;
const eligibleChannels = new Set([
    // chat
    "1015060231060983891", // off topic
    "1121201005456011366", // german
    "1026504914131759104", // regulars
    "1223973149222375536", // programming
    "1232316599697149982", // international

    // development
    "1015063227299811479", // core
    "1032770730703716362", // plugin
    "1134844326933954622", // theme
    "1216096100382019634", // website
    "1216096162008924291", // vesktop
    "1215380773033476106", // client mod wiki
]);
const handleMessageCreate = (e: any) => {
    if (e.message.author.id !== id) return;
    if (curNotif != null) return;
    if (!eligibleChannels.has(e.channelId)) return;
    showNotification({
        title: "Xp Gained :3",
        body: `You gained ${Math.min(Math.ceil((e.message.content.length / 10) ** 2), 30)}`
    });
    curNotif = setTimeout(() => {
        curNotif = null;
        showNotification({
            title: "You can now gain exp",
            body: "guh"
        });
    }, 2.5 * 60_000);
};
const settings = definePluginSettings({
    padTo55: {
        type: OptionType.BOOLEAN,
        description: "pad your message to 55\nWOULD NOT RECCOMEND",
        default: false

    }
});
let preSend: any;
export default definePlugin({
    settings,
    patches: [
        {
            find: "let{type:N,textValue:p,maxCharacterCount",
            replacement: {
                match: /let{type/,
                replace: "e.showRemainingCharsAfterCount=4000;e.maxCharacterCount=0;$&"
            }
        },
        {
            find: "let{type:N,textValue:p,maxCharacterCount",
            replacement: {
                match: /(,.=)(.-.)(,)/,
                replace: "$1$self.genNumber(e)$3"
            }
        }
    ],
    name: "_xpCooldown",
    authors: [{
        name: "person",
        id: 0n
    }],
    description: "notifys you when your exp is off cooldown",
    flux: {
        MESSAGE_CREATE: handleMessageCreate,
    },
    start: () => {
        const ZWSP = "​";
        id = Vencord.Webpack.Common.UserStore.getCurrentUser().id;
        preSend = addPreSendListener((cID: string, m: MessageObject, e: MessageExtra) => {
            if(!settings.store.padTo55) return;
            console.log("padding");
            if(!eligibleChannels.has(cID)) return;
            while (Math.ceil((m.content.length/10)**2) < 31){
                m.content += ZWSP;
            }
        });
    },
    stop: () => {
        removePreSendListener(preSend);
        if (curNotif != null){
            clearTimeout(curNotif);
        }
        curNotif = null;

    },
    genNumber(e: any): string {
        if (!e.textValue) return "";
        if (!eligibleChannels.has(SelectedChannelStore.getChannelId())) return "";
        return Math.min(Math.ceil((e.textValue.length/10)**2), 30).toString();
    }

});
