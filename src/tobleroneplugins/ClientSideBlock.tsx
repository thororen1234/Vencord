import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { FluxDispatcher, GuildStore, RelationshipStore, UserStore } from "@webpack/common";
import { Text } from "@webpack/common";
import { GuildMemberStore } from "@webpack/common";
import { GuildMember } from "discord-types/general";

const settings = definePluginSettings(
{
    usersToBlock: {
        type: OptionType.STRING,
        description: "User IDs seperated by a comma and a space",
        default: "",
        restartNeeded: true
    },
    hideBlockedUsers: {
        type: OptionType.BOOLEAN,
        description: "Should blocked users should also be hidden everywhere",
        default: true,
        restartNeeded: true
    },
    hideBlockedMessages: {
        type: OptionType.BOOLEAN,
        description: "Should messages from blocked users should be hidden fully (same as the old noblockedmessages plugin)",
        default: true,
        restartNeeded: true
    },
    blockedReplyDisplay: {
        type: OptionType.SELECT,
        description: "What should display instead of the message when someone replies to someone you have hidden",
        restartNeeded: true,
        options: [{value: "displayText", label: "Display text saying a hidden message was replied to", default: true},{value: "hideReply", label: "Literally nothing"}]
    },
    hideEmptyRoles: {
        type: OptionType.BOOLEAN,
        description: "Should role headers be hidden if all of their members are blocked",
        restartNeeded: true,
        options: [{value: "displayText", label: "Display text saying a hidden message was replied to", default: true},{value: "hideReply", label: "Literally nothing"}]
    }
});

//I KNOW THE NAMING IS WRONG BUT I CANT CHANGE IT NOW
function shouldShowUser(id)
{
    //hide the user if the user is blocked and the hide blocked users setting is enabled
    if(RelationshipStore.isBlocked(id) && settings.store.hideBlockedUsers)
    {
        return true;
    }
    //failsafe that is needed for some reason
    if(settings.store.usersToBlock.length == 0)
    {
        return false;
    }
    //hide the user if the id is in the users to block setting
    return settings.store.usersToBlock.split(", ").includes(id);
}

//This is really horror
function isRoleAllBlockedMembers(roleId, guildId) {
    const role = GuildStore.getRole(guildId, roleId);
    if (!role) return false;

    const membersWithRole : GuildMember[] = GuildMemberStore.getMembers(guildId).filter(member => member.roles.includes(roleId));
    if (membersWithRole.length === 0) return false;

    const usersToBlock = (settings.store.usersToBlock || '').split(", ").map(e => e.trim());

    //need to add an online check at some point but this sorta works for now
    return membersWithRole.every(member => usersToBlock.includes(member.userId) && !(UserStore.getUser(member.userId).desktop || UserStore.getUser(member.userId).mobile));
}


function hiddenReplyComponent()
{
    switch(settings.store.blockedReplyDisplay)
    {
        case "displayText":
            return <Text tag="p" selectable={false} variant="text-sm/normal" style={{marginTop: "0px", marginBottom: "0px"}}><i>↓ Replying to blocked message</i></Text>
        case "hideReply":
            return null;
    }
}

export default definePlugin({
    name: "ClientSideBlock",
    description: "Allows you to locally hide almost all content from any user",
    tags: ["blocked", "block", "hide", "hidden", "noblockedmessages"],
    authors:
    [
        Devs.Samwich
    ],
    settings,
    shouldShowUser: shouldShowUser,
    hiddenReplyComponent: hiddenReplyComponent,
    isRoleAllBlockedMembers: isRoleAllBlockedMembers,
    patches: [
        //message
        {
            find: ".messageListItem",
            replacement: {
                match: /renderContentOnly:\i}=\i;/,
                replace: "$&if($self.shouldShowUser(arguments[0].message.author.id)) return null; "
            }
        },
        //friends list (should work with all tabs)
        {
            find: "peopleListItemRef.current.componentWillLeave",
            replacement: {
                match: /\i}=this.state;/,
                replace: "$&if($self.shouldShowUser(this.props.user.id)) return null; "
            }
        },
        //member list
        {
            find: "this.props.isGuildEligibleForRecentlyOnline",
            replacement: {
                match: /new Date\(\i\):null;/,
                replace: "$&if($self.shouldShowUser(this.props.user.id)) return null; "
            }
        },
        //stop the role header from displaying if all users with that role are hidden (wip sorta)
        {
            find: "._areActivitiesExperimentallyHidden=(",
            replacement: {
                match: /\i.memo\(function\(\i\){/,
                replace: "$&if($self.isRoleAllBlockedMembers(arguments[0].id, arguments[0].guildId)) return null;"
            }
        },
        //"1 blocked message"
        {
            find: ".default.Messages.BLOCKED_MESSAGES_HIDE.format(",
            replacement: {
                match: /\i.memo\(function\(\i\){/,
                replace: "$&return null;"
            },
            predicate: () => settings.store.hideBlockedMessages
        },
        //replies
        {
            find: ".MessageTypes.GUILD_APPLICATION_PREMIUM_SUBSCRIPTION||",
            replacement: [
                {
                    match: /let \i;let\{repliedAuthor:/,
                    replace: `
                        if(arguments[0] != null && arguments[0].referencedMessage.message != null)
                        {
                            if($self.shouldShowUser(arguments[0].referencedMessage.message.author.id))
                            {
                                return $self.hiddenReplyComponent();
                            }
                        }$&
                    `
                }
            ]
        },
        //dm list
        {
            find: "PrivateChannel.renderAvatar",
            replacement: {
                //horror but it works
                match: /function\(\i,(\i),\i\){.*,\[\i,\i,\i\]\);/,
                replace: "$&if($self.shouldShowUser($1.rawRecipients[0].id)) return null;"
            }
        }
    ]
});
