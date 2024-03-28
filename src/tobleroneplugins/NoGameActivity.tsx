/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { StatusSettingsStores } from "@webpack/common";

export default definePlugin({
    name: "NoGameActivity",
    description: "Ensure your game activity is always disabled.",
    authors:
    [
        Devs.Samwich
    ],
    start()
    {
        StatusSettingsStores.ShowCurrentGame.updateSetting(false);
    },
    stop()
    {
        StatusSettingsStores.ShowCurrentGame.updateSetting(true);
    }
});

