import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Text } from "@webpack/common";
import { definePluginSettings } from "@api/Settings";

//there has to be a better fucking way to do this
function PrideFlagEmoji()
{
    if(settings.store.flagSelection == "pride")
    {
        return <img aria-label="🏳️‍🌈" src="/assets/29c6014c4034ec61a866.svg" alt="🏳️‍🌈" draggable="false" className="emoji" data-type="emoji" data-name=":rainbow_flag:"></img>
    }
    else
    {
        return <img aria-label="🏳️‍⚧️" src="/assets/1ed0ec8857cfc91cbf3e.svg" alt="🏳️‍⚧️" draggable="false" className="emoji" data-type="emoji" data-name=":transgender_flag:"></img>
    }
}

const settings = definePluginSettings(
    {
        flagSelection: {
            type: OptionType.SELECT,
            description: "The flag that should be use",
            options: [{value: "pride", label: "Standard rainbow flag", default: true}, {value: "trans", label: "Trans flag"}],
            restartNeeded: true
        },
    });

    
function newMessageComponent(props)
{
    if(!props.message.content.length) return props.content;
    return <Text variant="text-md/normal">{props.content} <PrideFlagEmoji/></Text>;
}

export default definePlugin({
    name: "WokeCord",
    description: "THEY MADE DISCORD WOKE (adds a pride flag to the end of every message)",
    authors:
    [
        Devs.Samwich
    ],
    settings,
    newMessageComponent: newMessageComponent,
    patches: [
        {
            find: "MessageFlags.SOURCE_MESSAGE_DELETED)?",
            replacement: {
                match: /.memo\(function\(\i\){var \i;/,
                replace: "$&return $self.newMessageComponent(arguments[0]);"
            }
        } 
    ]
});
