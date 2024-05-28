/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { ModalContent, ModalHeader, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import definePlugin from "@utils/types";
import { Button, Text } from "@webpack/common";

function openInfoModal()
{
    openModal(props => <IntroductionModal {...props} />);
}

export default definePlugin({
    name: "Introduction",
    description: "Shows a quick modal saying hi on your first opening (I KNOW THE MODAL IS CURSED I DON'T KNOW HOW TO FIX IT)",
    authors: [Devs.Samwich],
    required: true,
    settingsAboutComponent: () => <Button onClick={openInfoModal}>Open Modal</Button>,
    start()
    {
        if(!VencordNative.settings.get().isFirstTime)
        {
            openInfoModal();
        }
    }
});

function IntroductionModal(props: ModalProps) {
    return (
        <ModalRoot {...props} size={ModalSize.MEDIUM}>
            <ModalHeader separator={false}>
                <Text color="header-primary" variant="heading-lg/semibold" tag="h1" style={{ flexGrow: 1 }}>
                    Heyo! Thanks for using my client mod :3
                </Text>
            </ModalHeader>
            <ModalContent scrollbarType="none">
                <div style={{ display: "flex" }}>
                    <img src="https://files.catbox.moe/7amhms.gif" style={{ borderRadius: "20px", width: "40%", marginRight: "16px", marginBottom: "16px" }}></img>
                    <div style={{ width: "60%" }}>
                        <Text color="header-primary" variant="text-md/normal" tag="h2">
                            This is a one time message for the first time you boot, so read closely!!!!
                            Below you can find some relevant links and utils,
                            make sure to join the discord if you would like to be notified about updates or anything else-
                            And if you feel like contributing, check out the github!
                        </Text>
                    </div>
                </div>
                <br></br>
                <div style={{ display: "flex" }}>
                    <Button color={Button.Colors.BRAND_NEW} size={Button.Sizes.SMALL} onClick={() => VencordNative.native.openExternal("https://github.com/cheesesamwich/Tobleronecord")} style={{ marginRight: "10px" }}>Github</Button>
                    <Button color={Button.Colors.BRAND_NEW} size={Button.Sizes.SMALL} onClick={() => VencordNative.native.openExternal("https://discord.gg/ZcnxKXud7j")} style={{ marginRight: "10px" }}>Discord</Button>
                    <Button color={Button.Colors.RED} size={Button.Sizes.SMALL} onClick={() =>
                    {
                        props.onClose();
                        const oldSettings = VencordNative.settings.get();
                        oldSettings.isFirstTime = true;
                        VencordNative.settings.set(oldSettings);
                    }} style={{ textAlign: "right" }}>Close</Button>
                </div>
            </ModalContent>

        </ModalRoot>
    );
}
