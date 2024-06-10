/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "ToadLegs",
    description: "Makes every folder icon toad with legs (a must have)",
    authors:
    [
        Devs.Samwich
    ],
    icon: () =>
    {
        return (
            <img width={"100%"} height={"100%"} src="https://files.catbox.moe/axqr6i.jpg"></img>
        );
    },
    patches: [
        {
            find: "FolderIcon:function()",
            replacement: {
                match: /\i="",...\i}=\i;/,
                replace: "$&return $self.icon();"
            }
        }
    ],
    lowEffort: true
});
