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

import { disableStyle, enableStyle } from "@api/Styles";
import definePlugin from "@utils/types";

import style from "./style.css?managed";

export default definePlugin({
    patches: [
        {
            find: ".CHARACTER_COUNT_OVER_LIMIT",
            replacement: {
                match: /let/,
                replace: "arguments[0].showRemainingCharsAfterCount=4000;arguments[0].maxCharacterCount=0;$&"
            }
        },
        {
            find: ".CHARACTER_COUNT_OVER_LIMIT",
            replacement: {
                match: /(,\i=)(\i-\i)(,)/,
                replace: "$1$self.genNumber(e)$3"
            }
        },
    ],
    name: "ShowCharacterCount",
    authors: [{
        name: "sadan",
        id: 521819891141967883n
    }],
    description: "Show your character count while typing.",
    genNumber(e: any): string {
        if (!e.textValue) return "";
        return e.textValue.length.toString();
    },
    start() {
        enableStyle(style);
    },
    stop(){
        disableStyle(style);
    }
});
