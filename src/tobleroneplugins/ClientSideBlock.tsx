import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings(
{
    usersToBlock: {
        type: OptionType.STRING,
        description: "IDs seperated by a comma and a space",
        default: "",
        restartNeeded: true
    }
});

//I KNOW THE NAMING IS WRONG BUT I CANT CHANGE IT NOW
function shouldShowUser(id)
{
    return settings.store.usersToBlock.split(", ").includes(id);
}

export default definePlugin({
    name: "ClientSideBlock",
    description: "Allows you to locally hide most content related to a specific user (messages, friends list object, dms, member list)",
    authors:
    [
        Devs.Samwich
    ],
    settings,
    shouldShowUser: shouldShowUser,
    patches: [
        // messages
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
        }
        //got to work on this, arguments[0] returns a module instead of the actual arguments. i may be stupid ;-;
        /*
        {
            find: "PrivateChannel.renderAvatar",
            replacement: 
            {
                match: /,\[\i,\i,\i\]\);/,
                replace: "$&if($self.shouldShowUser(arguments[0].channel.rawRecipients[0].id)) return null;"
            }
        }
        */
    ]
});
