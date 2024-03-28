/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addContextMenuPatch, findGroupChildrenByChildId, NavContextMenuPatchCallback,removeContextMenuPatch } from "@api/ContextMenu";
import { DataStore } from "@api/index";
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { useForceUpdater } from "@utils/react";
import { OptionType } from "@utils/types";
import definePlugin from "@utils/types";
import { findStoreLazy } from "@webpack";
import { Button,Menu } from "@webpack/common";
import { Text } from "@webpack/common";
import React, { ReactNode } from "react";

const StickersStore = findStoreLazy("StickersStore");

let blockedStickers : string[] = [];

async function updateStickers()
{
    DataStore.set("blockedStickers", blockedStickers);
}

async function getStickers()
{
    const attemptGet = await DataStore.get("blockedStickers");
    if(attemptGet == undefined) { return; }
    blockedStickers = attemptGet;
}

function getBlockedStickers()
{
    return blockedStickers;
}
const settings = definePluginSettings({
    showGif: {
        type: OptionType.BOOLEAN,
        description: "Whether to show a snazzy cat gif",
        default: true,
        restartNeeded: true
    },
    showButton: {
        type: OptionType.BOOLEAN,
        description: "Whether to show a button to unblock the gif",
        default: true,
        restartNeeded: true
    },
    blockedStickerGallery:
    {
        type: OptionType.COMPONENT,
        description: "uh",
        component: stickerList
    }
});

function stickerList() {

    const update = useForceUpdater();

    const stickerGrid = blockedStickers.map(sticker => {
        const gotSticker = StickersStore.getStickerById(sticker);
        const imgSource = `https://media.discordapp.net/stickers/${sticker}.webp?size=240`;

        return (
            <div key={sticker} style={{ display: "inline-block", margin: "5px" }}>
                <img src={imgSource} alt={gotSticker.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px" }} />
                <Button key="button" onClick={() => { toggleBlock(gotSticker.id, update); }} color={Button.Colors.RED}>Unblock</Button>
            </div>
        );
    });

    return (
        <>
            <Text color="header-primary" variant="heading-lg/bold" tag="h1" style={{ textAlign: "center" }}>
                Blocked Stickers
            </Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", padding: "10px" }}>
                {stickerGrid}
            </div>
        </>
    );
}

export default definePlugin({
    name: "StickerBlocker",
    description: "Allows you to block stickers from being displayed.",
    authors: [Devs.Samwich],
    patches: [
        {
            find: "r.default.STICKER_MESSAGE",
            replacement: {
                match: /}\),\(null!=N\?N:t\)\.name]}\);/,
                replace: "}),(null!=N?N:t).name]}); if($self.blocked().includes(t.id)) { return($self.blockedComponent(t)) }"
            }
        }
    ],
    async start() {
        addContextMenuPatch("message", messageContextMenuPatch);
        await getStickers();
    },
    stop() {
        removeContextMenuPatch("message", messageContextMenuPatch);
    },
    blockedComponent: ErrorBoundary.wrap(blockedComponentRender, { fallback: () => <p style={{ color: "red" }}>Failed to render :(</p> }),
    settings,
    blocked: getBlockedStickers
});


function blockedComponentRender(sticker) {
    const { showGif, showButton } = settings.store;
    const elements = [] as ReactNode[];

    if (showGif) {
        elements.push(
            <img key="gif" src="https://files.catbox.moe/bdsc58.gif" style={{ width: "160px", borderRadius: "20px" }}/>
        );
    }
    if (showButton) {
        elements.push(
            <Button key="button" onClick={() => toggleBlock(sticker.id)}color={Button.Colors.RED}>Unblock {sticker.name}</Button>
        );
    }

    return <>{elements}</>;
}


const messageContextMenuPatch: NavContextMenuPatchCallback = (children, props) => () => {
    const { favoriteableType, favoriteableId } = props ?? {};
    if (favoriteableType !== "sticker") { return; }
    if (favoriteableId === null) { return; }
    const group = findGroupChildrenByChildId("reply", children);
    if (!group) return;

    group.splice(group.findIndex(c => c?.props?.id === "reply") + 1, 0, buttonThingy(favoriteableId));
};

function buttonThingy(name) {
    return (
        <Menu.MenuItem
            id="add-sticker-block"
            key="add-sticker-block"
            label={(blockedStickers.includes(name)) ? "Unblock" : "Block"}
            action={() => toggleBlock(name)}
        />
    );
}

async function toggleBlock(id, update?) {

    if (await isStickerBlocked(id)) {
        blockedStickers = blockedStickers.filter(item => item !== id);
        updateStickers();
    } else {
        blockedStickers.push(id);
        updateStickers();
    }
    if(update) { update(); }
    console.log(blockedStickers);
}

async function isStickerBlocked(id) {
    return blockedStickers.includes(id);
}
