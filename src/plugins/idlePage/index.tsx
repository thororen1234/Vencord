/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
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

import "./style.css";

import { definePluginSettings } from "@api/Settings";
import { LazyComponent } from "@utils/lazyReact";
import { closeModal, Modals, openModalLazy } from "@utils/modal";
import definePlugin, { OptionType } from "@utils/types";

export const ModalRootdiv = LazyComponent(() => Modals.ModalRoot);
export const settings = definePluginSettings({
    BackgroundColor: {
        type: OptionType.STRING,
        description: "Hex code of the backgorund. needs #",
        default: "#1a1b26"
    },
    onHomeClick: {
        type: OptionType.BOOLEAN,
        description: "run when the home button is click while already on the homepage",
        restartNeeded: true,
        default: true
    },
    text: {
        type: OptionType.STRING,
        description: "string to display on the idle page",
        default: ""
    },
    onIdle: {
        type: OptionType.BOOLEAN,
        description: "activate on idle",
        default: false
    }
}
);
let c = 0;
function openThing() {
    openModalLazy(async() => {
        return ()=> (
            <div className="custom-idle-div-page" style={{
                backgroundColor: settings.store.BackgroundColor
            }}
            onClick={()=>{
                closeModal("idle-modal");
            }}
            >
                <h1>{settings.store.text}</h1>
            </div>
        );
    }, {
        modalKey: "idle-modal"
    });
}
export default definePlugin({
    settings,
    flux: {
        IDLE: () =>{
            if (settings.store.onIdle)
                openThing();
        }
    },
    name: "_IdlePage",
    description: "Shows a blank page when you go idle",
    patches: [
        {
            find: ".Messages.DISCODO_DISABLED",
            predicate() {
                return settings.store.onHomeClick;
            },
            replacement: {
                match: /onClick:\(\)=>{/,
                replace: "$&$self.startIdle();"
            }
        }
    ],

    authors: [
        {
            name: "sadan",
            id: 521819891141967883n
        }
    ],
    start(){
        if (settings.store.onHomeClick)
            this.interval = setInterval(() => c = 0, 1000);
    },
    stop() {
        if (settings.store.onHomeClick)
            clearInterval(this.interval);
    },
    startIdle(){
        c++;
        if(c === 3){
            c = 0;
            openThing();
        }
    },
    commands: [
        {
            name:"test",
            description:"test command",
            execute(){
                openThing();
            }
        }
    ]
});
