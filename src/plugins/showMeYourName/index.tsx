/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 rini
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { RestAPI, UserStore } from "@webpack/common";
import { Message, User } from "discord-types/general";
interface UsernameProps {
    author: { nick: string; };
    message: Message;
    withMentionPrefix?: boolean;
    isRepliedMessage: boolean;
    userOverride?: User;
}
interface MemberListProps {
    nick: null | string,
    user: User & {globalName?: string}
}
let a: MemberListProps;
const settings = definePluginSettings({
    mode: {
        type: OptionType.SELECT,
        description: "How to display usernames and nicks",
        options: [
            { label: "Username then nickname", value: "user-nick", default: true },
            { label: "Nickname then username", value: "nick-user" },
            { label: "Username only", value: "user" },
        ],
    },
    displayNames: {
        type: OptionType.BOOLEAN,
        description: "Use display names in place of usernames",
        default: false
    },
    inReplies: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Also apply functionality to reply previews",
    },
    tabList: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Also show names in the member list.",
        restartNeeded: true
    },
    mentions: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "Also show names in user mentions.",
        restartNeeded: true
    }
});

// discord types is outdated and does not have globalName
function getName(nick: string | null, user: User & {globalName?: string}){
    if(!nick){
        return settings.store.displayNames ? user.globalName ?? user.username : user.username;
    }
    let { username } = user;
    if (settings.store.displayNames)
        username = user.globalName || username;
    if(nick.toLowerCase() === username)
        return nick;
    switch(settings.store.mode){
        case "user-nick":
            return `${username} (${nick})`;
        case "user":
            return username;
        case "nick-user":
            return `${nick} (${username})`;
        default:
            // we should never be here
            return "ERROR in SMYN";
    }
}
export default definePlugin({
    name: "ShowMeYourName",
    description: "Display usernames next to nicks, or no nicks at all",
    authors: [Devs.Rini, Devs.TheKodeToad, Devs.sadan],
    patches: [
        {
            find: '?"@":"")',
            replacement: {
                match: /(?<=onContextMenu:\i,children:).*?\)}/,
                replace: "$self.renderUsername(arguments[0])}"
            }
        },
        {
            find: "MEMBER_LIST_ITEM_AVATAR_DECORATION_PADDING)",
            replacement: {
                match: /(NameWithRole,{.{0,40}name:).*?(,)/,
                replace: "$1$self.patchMemberList(arguments[0])$2"
            }
        },
        {
            find: ".USER_MENTION)",
            group: true,
            predicate: () => settings.store.mentions,
            replacement: [{
                match: /(concat\().*?\)/,
                replace: "$1$self.patchMention(vencordNick, arguments[0].userId))"
            },
            {
                match: /(\i)=.{0,50}getNickname.*?\)\)/,
                replace: "$&,vencordNick=$1"
            }
            ]
        }
    ],
    settings,

    renderUsername: ErrorBoundary.wrap(({ author, message, isRepliedMessage, withMentionPrefix, userOverride }: UsernameProps) => {
        try {
            const user = userOverride ?? message.author;
            let { username } = user;
            if (settings.store.displayNames)
                username = (user as any).globalName || username;

            const { nick } = author;
            const prefix = withMentionPrefix ? "@" : "";

            if (isRepliedMessage && !settings.store.inReplies || username.toLowerCase() === nick.toLowerCase())
                return <>{prefix}{nick}</>;

            if (settings.store.mode === "user-nick")
                return <>{prefix}{username} <span className="vc-smyn-suffix">{nick}</span></>;

            if (settings.store.mode === "nick-user")
                return <>{prefix}{nick} <span className="vc-smyn-suffix">{username}</span></>;

            return <>{prefix}{username}</>;
        } catch {
            return <>{author?.nick}</>;
        }
    }, { noop: true }),
    patchMemberList(props: MemberListProps){
        return getName(props.nick, props.user);
    },
    patchMention(nick: string, userid: string){
        return getName(nick, log(UserStore.getUser(userid)));
    }
});
function log<T>(f: T): T{
    // console.log(f)
    return f;
}
