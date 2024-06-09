/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByProps } from "@webpack";

/**
 * @description Gets the number of members with a specific role
 * @param {string} roleId
 * @param {string} guildId
 * @returns {number}
 */
export const getMemberCountForRole = findByProps("requestMembersForRole").requestMembersForRole();
