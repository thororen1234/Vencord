 
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { UserStore } from "@webpack/common";

function getVee()
{
    return UserStore.getUser("343383572805058560");
}

export default definePlugin({
    name: "VeeHiveMind",
    description: "Makes every user into vee (VERY BROKEN)",
    authors:
    [
        Devs.Samwich
    ],
    getVee : getVee,
    patches: [
        {
            find: ".messageListItem",
            replacement: {
                match: /renderContentOnly:\i}=\i;/,
                replace: "$&arguments[0].message.author = $self.getVee();"
            }
        }
    ]
});
