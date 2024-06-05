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

import { LazyComponent } from "@utils/lazyReact";
import { Modals, openModalLazy } from "@utils/modal";
import definePlugin from "@utils/types";
export const ModalRootdiv = LazyComponent(() => Modals.ModalRoot);
function openThing() {
    openModalLazy(async() => {
        return m => (
            <div className="custom-idle-div-page">
                <h1>You are now idle</h1>
            </div>
        );
    });
}
export default definePlugin({
    name: "_IdlePage",
    description: "Shows a blank page when you go idle",
    patches: [
        {
            find: ".Messages.DISCODO_DISABLED",
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
    startIdle(){
        console.log("clicked");
    },
    commands: [
        {
            name:"test",
            description:"test command",
            execute(){
                console.log("OPENING");
                openThing();
            }
        }
    ]
});
