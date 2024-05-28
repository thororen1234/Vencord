/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { openImageModal } from "@utils/discord";
import { fetchAndUploadTheme } from "@utils/fetchAndUploadTheme";
import { Button, Card, Forms, React } from "@webpack/common";
import { Avatar } from "@webpack/common";

import themeLinks from "./themes";

export interface Theme {
    id: number;
    name: string;
    file_name: string;
    type: string;
    description: string;
    version: string;
    author: {
        github_id: string;
        github_name: string;
        display_name: string;
        discord_name: string;
        discord_avatar_hash: string;
        discord_snowflake: string;
        guild: any; // You can replace 'any' with the appropriate type if known
    };
    likes: number;
    downloads: number;
    tags: string[];
    thumbnail_url: string;
    release_date: string; // You may want to use a Date type if parsing date strings is required
    guild: any; // You can replace 'any' with the appropriate type if known
}

export async function getThemeList(): Promise<Theme[]> {
    const themes = themeLinks() as Theme[];
    return themes;
}

function checkImageExists(url, callback) {
    var img = new Image();
    img.onload = function() {
        callback(true);
    };
    img.onerror = function() {
        callback(false);
    };
    img.src = url;
}

export function renderBrowseThemes(themes, setThemes) {
    return (
        <>
            <Card className="vc-settings-card vc-text-selectable">
                <Forms.FormTitle tag="h3">Browse Themes</Forms.FormTitle>
                <Forms.FormText>Here you can view and download from the betterdiscord theme library</Forms.FormText>
            </Card>

            {themes.map(theme => (
                <Card className="vc-settings-card" outline={true} style={{ display: "flex" }}>
                    <div style={{ marginRight: "20px" }}>
                        <Avatar size="SIZE_40" src={`https://cdn.discordapp.com/avatars/${theme.author.discord_snowflake}/${theme.author.discord_avatar_hash}.webp?size=64`} />
                    </div>
                    <div>
                        <Forms.FormTitle tag="h4">{theme.name}</Forms.FormTitle>
                        <Forms.FormText>{theme.description}</Forms.FormText>
                        <br></br>
                        <img onClick={() => { openImageModal(`https://betterdiscord.app${theme.thumbnail_url}`, { width: 700 }); }} src={`https://betterdiscord.app${theme.thumbnail_url}`} style={{ borderRadius: "20px", width: "60%", marginBottom: "11.25px", cursor: "pointer" }}></img>
                        <Button look={Button.Looks.OUTLINED} color={Button.Colors.BRAND} onClick={() => { fetchAndUploadTheme(theme.id, `https://betterdiscord.app/Download?id=${theme.id}`); }}>Download</Button>
                    </div>
                </Card>
            ))}
        </>
    );
}
