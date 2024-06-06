 import { findByProps } from "@webpack";

 /**
 * @description Gets the number of members with a specific role
 * @param {string} roleId
 * @param {string} guildId
 * @returns {number}
 */
export const getMemberCountForRole = findByProps("requestMembersForRole").requestMembersForRole();