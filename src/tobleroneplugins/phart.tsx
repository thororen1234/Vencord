
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

export default definePlugin({
    name: "phart",
    description: "plorp",
    
    authors:
    [
        Devs.Samwich
    ],

    start() {
        let audio = document.createElement('audio');
        audio.id = "phartAudio";
        audio.setAttribute('src', 'https://files.catbox.moe/2697lb.wav');
        document.addEventListener('keydown', function(event) 
        {
            audio.currentTime = 0;
            audio.play();
        });
    },
    
    stop()
    {
        document.getElementById("phartAudio")?.remove();
    }

});
    