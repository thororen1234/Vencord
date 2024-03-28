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

import { useSettings } from "@api/Settings";
import { classNameFactory } from "@api/Styles";
import { Margins } from "@utils/margins";
import { identity } from "@utils/misc";
import { relaunch, showItemInFolder } from "@utils/native";
import { useAwaiter } from "@utils/react";
import { rebuildAndRestart } from "@utils/Rebuild";
import { Button, Card, Forms, React, Select, Switch } from "@webpack/common";

import { SettingsTab, wrapTab } from "./shared";
import { title } from "process";
import { notEqual } from "assert";

const cl = classNameFactory("vc-settings-");
type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function VencordSettings() {
    const [settingsDir, , settingsDirPending] = useAwaiter(VencordNative.settings.getSettingsDir, {
        fallbackValue: "Loading..."
    });
    const settings = useSettings();


    const isWindows = navigator.platform.toLowerCase().startsWith("win");
    const isMac = navigator.platform.toLowerCase().startsWith("mac");
    const needsVibrancySettings = IS_DISCORD_DESKTOP && isMac;

    const Switches: Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        title: string;
        note: string;
    }> =
        [
            {
                key: "useQuickCss",
                title: "Enable Custom CSS",
                note: "Loads your Custom CSS"
            },
            !IS_WEB && {
                key: "enableReactDevtools",
                title: "Enable React Developer Tools",
                note: "Requires a full restart"
            },
            !IS_WEB && (!IS_DISCORD_DESKTOP || !isWindows ? {
                key: "frameless",
                title: "Disable the window frame",
                note: "Requires a full restart"
            } : {
                key: "winNativeTitleBar",
                title: "Use Windows' native title bar instead of Discord's custom one",
                note: "Requires a full restart"
            }),
            !IS_WEB && {
                key: "transparent",
                title: "Enable window transparency.",
                note: "You need a theme that supports transparency or this will do nothing. Will stop the window from being resizable. Requires a full restart"
            },
            IS_DISCORD_DESKTOP && {
                key: "disableMinSize",
                title: "Disable minimum window size",
                note: "Requires a full restart"
            },
            {
                key: "newPlugins",
                title: "New Plugin Badge",
                note: "Show the \"NEW\" badge on plugins"
            },
        ];

    return (
        <SettingsTab title="Tobler, uh. settings (or something)">
            <InfoCard />
            <Card className={cl("quick-actions-card")}>
                <React.Fragment>
                    {!IS_WEB && (
                        <Button
                            onClick={relaunch}
                            size={Button.Sizes.SMALL}>
                            Restart Client
                        </Button>
                    )}
                    <Button
                        onClick={() => VencordNative.quickCss.openEditor()}
                        size={Button.Sizes.SMALL}
                        disabled={settingsDir === "Loading..."}>
                        Open QuickCSS File
                    </Button>
                    {!IS_WEB && (
                        <Button
                            onClick={() => showItemInFolder(settingsDir)}
                            size={Button.Sizes.SMALL}
                            disabled={settingsDirPending}>
                            Open Settings Folder
                        </Button>
                    )}
                </React.Fragment>
            </Card>
            <Forms.FormDivider />
            <Forms.FormSection className={Margins.top16} title="Settings" tag="h5">
                {Switches.map(s => s && (
                    <Switch
                        key={s.key}
                        value={settings[s.key]}
                        onChange={v => settings[s.key] = v}
                        note={s.note}
                    >
                        {s.title}
                    </Switch>
                ))}
            </Forms.FormSection>


            {needsVibrancySettings && <>
                <Forms.FormTitle tag="h5">Window vibrancy style (requires restart)</Forms.FormTitle>
                <Select
                    className={Margins.bottom20}
                    placeholder="Window vibrancy style"
                    options={[
                        // Sorted from most opaque to most transparent
                        {
                            label: "No vibrancy", value: undefined
                        },
                        {
                            label: "Under Page (window tinting)",
                            value: "under-page"
                        },
                        {
                            label: "Content",
                            value: "content"
                        },
                        {
                            label: "Window",
                            value: "window"
                        },
                        {
                            label: "Selection",
                            value: "selection"
                        },
                        {
                            label: "Titlebar",
                            value: "titlebar"
                        },
                        {
                            label: "Header",
                            value: "header"
                        },
                        {
                            label: "Sidebar",
                            value: "sidebar"
                        },
                        {
                            label: "Tooltip",
                            value: "tooltip"
                        },
                        {
                            label: "Menu",
                            value: "menu"
                        },
                        {
                            label: "Popover",
                            value: "popover"
                        },
                        {
                            label: "Fullscreen UI (transparent but slightly muted)",
                            value: "fullscreen-ui"
                        },
                        {
                            label: "HUD (Most transparent)",
                            value: "hud"
                        },
                    ]}
                    select={v => settings.macosVibrancyStyle = v}
                    isSelected={v => settings.macosVibrancyStyle === v}
                    serialize={identity} />
            </>}

            {/*typeof Notification !== "undefined" && <NotificationSection settings={settings.notifications} />*/}
        </SettingsTab>
    );
}


function InfoCard() {
    return (
        <Card className={cl("card", "settings-info")}>
            <div>
                <Forms.FormTitle tag="h5">Info</Forms.FormTitle>
                <Forms.FormText>This is the settings tab- The window to tons of cool features. You could also just click the "Restart Client" button 50 times, its your choice.</Forms.FormText>
            </div>
            <img
                role="presentation"
                src={"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExemxxaGtwY3Fyam54OHF4cTJ2ajJwcWlpZ2lzamtyZmhsbTN1b2tpYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/CGUPvuvcTiwCVieKhC/giphy.gif"}
                alt=""
                height={128}
                style={{
                    marginLeft: "auto"
                }}
            />
        </Card>
    );
}
export default wrapTab(VencordSettings, "Vencord Settings");
