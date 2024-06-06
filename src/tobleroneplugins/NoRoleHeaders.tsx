 
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { RelationshipStore } from "@webpack/common";
import { Text } from "@webpack/common";
import { GuildStore, GuildMemberStore } from "@webpack/common";

export default definePlugin({
    name: "NoRoleHeaders",
    description: "We are all equal!!",
    authors:
    [
        Devs.Samwich
    ],
    patches: [
        {
            find: "._areActivitiesExperimentallyHidden=(",
            replacement: {
                match: /\i.memo\(function\(\i\){/,
                replace: "$&return null;"
            }
        } 
    ]
});
