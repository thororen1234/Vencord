/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export async function fetchAndUploadTheme(id: string, link: string)
{
    const request = await fetch(link);
    const content = await request.text();
    console.log(content);
    await VencordNative.themes.uploadTheme(id, content);
}
